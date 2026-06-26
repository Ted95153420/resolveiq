require("dotenv").config();
console.log("KAFKA_BROKER =", process.env.KAFKA_BROKER);

const { Kafka } = require("kafkajs");
const crypto = require("crypto");

if (!process.env.KAFKA_BROKER) {
    throw new Error("KAFKA_BROKER is not set");
}

const useSecureKafka =
    process.env.KAFKA_USERNAME &&
    process.env.KAFKA_PASSWORD &&
    process.env.KAFKA_CA_CERT;

let kafkaConfig = {
    clientId: "resolveiq-producer",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
};

if (useSecureKafka) {
    console.log("Starting producer in secure Kafka mode (Aiven).");

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
    console.log("Starting producer in local Kafka mode (plain Redpanda).");
}

const kafka = new Kafka(kafkaConfig);
const producer = kafka.producer();

async function run() {
    try {
        await producer.connect();

        const event = {
            eventType: "user.created",
            eventId: crypto.randomUUID(),
            occurredAt: new Date().toISOString(),
            payload: {
                id: Date.now(),
                name: "Mick Jagger",
                username: "test105",
                age: 91,
                nationality: "CANADA",
                loyaltypointbalance: 3000,
            },
        };

        await producer.send({
            topic: "user-events",
            messages: [
                {
                    key: String(event.payload.id),
                    value: JSON.stringify(event),
                },
            ],
        });

        console.log("Published event:");
        console.log(JSON.stringify(event, null, 2));
    } catch (error) {
        console.error("Producer failed:", error);
    } finally {
        await producer.disconnect();
    }
}

run();