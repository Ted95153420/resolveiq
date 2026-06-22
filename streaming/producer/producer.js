require("dotenv").config();
console.log("KAFKA_BROKER =", process.env.KAFKA_BROKER);
const { Kafka } = require("kafkajs");
const crypto = require("crypto");

const kafka = new Kafka({
    clientId: "resolveiq-producer",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const producer = kafka.producer();

async function run() {
    try {
        await producer.connect();

        const event = {
            eventType: "user.created",
            eventId: crypto.randomUUID(),
            occurredAt: new Date().toISOString(),
            payload: {
                id : Date.now(),
                name: "Is this real??",
                username: "test101",
                age: 30,
                nationality: "CANADA",
                loyaltypointbalance: 0,
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