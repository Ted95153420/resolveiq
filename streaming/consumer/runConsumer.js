const { Kafka } = require("kafkajs");
const { buildKafkaConfig } = require("./kafkaConfig");

async function runConsumer({ clientId, groupId, topic, handler }) {
    const kafka = new Kafka(buildKafkaConfig(clientId));
    const consumer = kafka.consumer({ groupId });

    await consumer.connect();

    // TODO: We are using fromBeginning: false here because when running as a
    // Render Web Service, restarts/spin-downs could cause old messages to be
    // replayed unnecessarily. Revisit this setting later when running as a
    // proper always-on background service.
    await consumer.subscribe({ topic, fromBeginning: false });

    console.log(`Consumer is listening on topic: ${topic}`);

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                const rawValue = message.value?.toString();

                if (!rawValue) return;

                const event = JSON.parse(rawValue);
                await handler(event);
            } catch (error) {
                console.error(`Error handling message on topic ${topic}:`, error);
            }
        },
    });
}

module.exports = { runConsumer };