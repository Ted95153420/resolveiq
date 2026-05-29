require("dotenv").config();
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "resolveiq-consumer",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "resolveiq-test-group" });

async function run() {
    await consumer.connect();
    await consumer.subscribe({ topic: "user-events", fromBeginning: true });

    console.log("Consumer is listening on topic: user-events");

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log("Message received:");
            console.log({
                topic,
                partition,
                key: message.key?.toString(),
                value: message.value?.toString(),
            });
        },
    });
}

run().catch((error) => {
    console.error("Consumer failed:", error);
});