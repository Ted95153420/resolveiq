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
            try {
                const rawValue = message.value?.toString();

                if (!rawValue) return;

                const event = JSON.parse(rawValue);

                if (event.eventType === "user.created") {
                    const createdUser = await createUser(event.payload);

                    console.log("User added from event:");
                    console.log(createdUser);
                }
            } catch (error) {
                console.error("Error handling message:", error);
            }
        },
    });
}

run().catch((error) => {
    console.error("Consumer failed:", error);
});