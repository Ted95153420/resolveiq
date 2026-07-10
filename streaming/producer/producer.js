require("dotenv").config();
console.log("KAFKA_BROKER =", process.env.KAFKA_BROKER);

const { Kafka } = require("kafkajs");
const crypto = require("crypto");
const { generateRandomFullName } = require("../services/nameService");

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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildUserEvent(index) {
    const randomNumber = getRandomInt(1, 10_000_000);
    const username = `demo${randomNumber}`;
    const fullName = generateRandomFullName();
    const age = getRandomInt(21, 68);

    return {
        eventType: "user.created",
        eventId: crypto.randomUUID(),
        occurredAt: new Date().toISOString(),
        payload: {
            name: fullName,
            username,
            age,
            nationality: "CANADA",
            loyaltypointbalance: 0,
        },
    };
}

async function run() {
    try {
        await producer.connect();

        const events = Array.from({ length: 10 }, () => buildUserEvent());

        await Promise.all(
            events.map(async (event) => {
                await producer.send({
                    topic: "user-events",
                    messages: [
                        {
                            key: String(event.payload.username),
                            value: JSON.stringify(event),
                        },
                    ],
                });

                console.log(`Published ${event.payload.name} (${event.payload.username})`);
            })
        );

        console.log("All demo events published.");
    } catch (error) {
        console.error("Producer failed:", error);
    } finally {
        await producer.disconnect();
    }
}

run();