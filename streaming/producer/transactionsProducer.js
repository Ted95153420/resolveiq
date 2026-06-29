require("dotenv").config();
console.log("KAFKA_BROKER =", process.env.KAFKA_BROKER);

const { Kafka } = require("kafkajs");
const crypto = require("crypto");

if (!process.env.KAFKA_BROKER) {
    throw new Error("KAFKA_BROKER is not set");
}

const targetUsername = process.argv[2];

if (!targetUsername) {
    throw new Error("Please provide a username. Example: node transactionsProducer.js demo12345");
}

const useSecureKafka =
    process.env.KAFKA_USERNAME &&
    process.env.KAFKA_PASSWORD &&
    process.env.KAFKA_CA_CERT;

let kafkaConfig = {
    clientId: "resolveiq-transactions-producer",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
};

if (useSecureKafka) {
    console.log("Starting transactions producer in secure Kafka mode (Aiven).");

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
    console.log("Starting transactions producer in local Kafka mode (plain Redpanda).");
}

const kafka = new Kafka(kafkaConfig);
const producer = kafka.producer();

function getRandomAmount(min, max) {
    return Number((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomGameType() {
    const gameTypes = ["Slots", "Blackjack", "Roulette", "Poker", "Baccarat"];
    return gameTypes[Math.floor(Math.random() * gameTypes.length)];
}

function buildTransactionEvent(username) {
    return {
        eventType: "transaction.created",
        eventId: crypto.randomUUID(),
        occurredAt: new Date().toISOString(),
        payload: {
            id: Date.now(),
            username,
            gametype: getRandomGameType(),
            amountwagered: getRandomAmount(1, 500),
            transaction_timestamp: new Date().toISOString(),
        },
    };
}

async function run() {
    try {
        await producer.connect();

        const event = buildTransactionEvent(targetUsername);

        await producer.send({
            topic: "transaction-events",
            messages: [
                {
                    key: String(event.payload.id),
                    value: JSON.stringify(event),
                },
            ],
        });

        console.log(`Published transaction for ${targetUsername}`);
        console.log(JSON.stringify(event, null, 2));
    } catch (error) {
        console.error("Transactions producer failed:", error);
    } finally {
        await producer.disconnect();
    }
}

run();