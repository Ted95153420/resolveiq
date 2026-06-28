/**
 * TEMPORARY RENDER WORKAROUND
 *
 * This consumer was originally intended to run as a true background worker that
 * continuously listens for Kafka / Redpanda messages and writes to the database.
 *
 * However, Render charges for Background Workers, and that cost is currently a
 * constraint for this project.
 *
 * As a workaround, this consumer has been modified to also behave like a very
 * small web service by exposing an HTTP endpoint. This allows it to be deployed
 * on Render as a Web Service instead of a paid Background Worker.
 *
 * IMPORTANT:
 * - The HTTP server in this file exists only to satisfy Render's expectation
 *   that a web service binds to a port.
 * - The real purpose of this process is still to consume Kafka messages.
 * - This is a cost-saving workaround, not the ideal long-term architecture.
 *
 * Longer term, if budget allows, this should probably be moved back to a proper
 * Background Worker style service and the HTTP server removed.
 */

const express = require("express");
const { createTransaction } = require("../../server/services/transactionService");
require("dotenv").config();
const { Kafka } = require("kafkajs");

const app = express();
const PORT = process.env.PORT || 10001;

// TODO: This HTTP endpoint was added purely so Render can treat this process
// as a Web Service. Remove this if/when the consumer is deployed as a true
// Background Worker.
app.get("/", (req, res) => {
    res.send("ResolveIQ transactions consumer is running.");
});

// TODO: This HTTP listener was added purely for the Render Web Service
// workaround. Remove this if/when the consumer runs as a proper Background Worker.
app.listen(PORT, "0.0.0.0", () => {
    console.log(`HTTP server listening on port ${PORT}`);
});

if (!process.env.KAFKA_BROKER) {
    throw new Error("KAFKA_BROKER is not set");
}

const useSecureKafka =
    process.env.KAFKA_USERNAME &&
    process.env.KAFKA_PASSWORD &&
    process.env.KAFKA_CA_CERT;

let kafkaConfig = {
    clientId: "resolveiq-transactions-consumer",
    brokers: [process.env.KAFKA_BROKER],
};

if (useSecureKafka) {
    console.log("Starting transactions consumer in secure Kafka mode (Aiven / Render).");

    const caCert = process.env.KAFKA_CA_CERT.replace(/\\n/g, "\n");

    kafkaConfig = {
        ...kafkaConfig,
        ssl: {
            rejectUnauthorized: true,
            ca: [caCert],
        },
        sasl: {
            mechanism: "plain",
            username: process.env.KAFKA_USERNAME,
            password: process.env.KAFKA_PASSWORD,
        },
    };
} else {
    console.log("Starting transactions consumer in local Kafka mode (plain Redpanda).");
}

console.log("Broker:", process.env.KAFKA_BROKER);
console.log("Port:", PORT);

const kafka = new Kafka(kafkaConfig);
const consumer = kafka.consumer({ groupId: "resolveiq-transactions-group" });

async function run() {
    await consumer.connect();

    // TODO: We are using fromBeginning: false here because when running as a
    // Render Web Service, restarts/spin-downs could cause old messages to be
    // replayed unnecessarily. Revisit this setting later when running as a
    // proper always-on background service.
    await consumer.subscribe({ topic: "transaction-events", fromBeginning: false });

    console.log("Transactions consumer is listening on topic: transaction-events");

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                const rawValue = message.value?.toString();

                if (!rawValue) return;

                const event = JSON.parse(rawValue);

                if (event.eventType === "transaction.created") {
                    const createdTransaction = await createTransaction(event);

                    if (createdTransaction) {
                        console.log("Transaction added from event:");
                        console.log(createdTransaction);
                    } else {
                        console.log(`Duplicate or skipped transaction event: ${event.eventId}`);
                    }
                }
            } catch (error) {
                console.error("Error handling transaction message:", error);
            }
        },
    });
}

run().catch((error) => {
    console.error("Transactions consumer failed:", error);
});