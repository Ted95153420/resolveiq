const { createUser } = require("../../server/services/userService");
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
        eachMessage: async ({ message }) => {
            const rawValue = message.value?.toString();

            if (!rawValue) return;

            const event = JSON.parse(rawValue);

            if (event.eventType === "user.created") {
                const createdUser = createUser(event.payload);

                console.log("User added from event:");
                console.log(createdUser);
            }
            
        },
    });
}

run().catch((error) => {
    console.error("Consumer failed:", error);
});