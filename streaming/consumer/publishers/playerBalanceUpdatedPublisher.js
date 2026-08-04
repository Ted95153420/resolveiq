const { Kafka } = require("kafkajs");
const crypto = require("crypto");

const {
    buildKafkaConfig,
} = require("../kafkaConfig");

let producer = null;
let isConnected = false;

function getProducer() {
    if (producer) {
        return producer;
    }

    const kafkaConfig = buildKafkaConfig(
        "resolveiq-player-balance-producer"
    );

    const kafka = new Kafka(kafkaConfig);

    producer = kafka.producer();

    return producer;
}

async function connectProducer() {
    const kafkaProducer = getProducer();

    if (isConnected) {
        return kafkaProducer;
    }

    await kafkaProducer.connect();

    isConnected = true;

    return kafkaProducer;
}

async function publishPlayerBalanceUpdated(
    balanceUpdate
) {
    const kafkaProducer =
        await connectProducer();

    const event = {
        eventType: "player.balance.updated",
        eventId: crypto.randomUUID(),
        occurredAt: new Date().toISOString(),

        payload: {
            username: balanceUpdate.username,
            previousBalance:
                balanceUpdate.previousBalance,
            newBalance:
                balanceUpdate.newBalance,
            pointsDelta:
                balanceUpdate.pointsDelta,
            sourceTransactionId:
                balanceUpdate.sourceTransactionId,
            sourceEventId:
                balanceUpdate.sourceEventId,
        },
    };

    await kafkaProducer.send({
        topic: "player-balance-events",

        messages: [
            {
                key: balanceUpdate.username,
                value: JSON.stringify(event),
            },
        ],
    });

    return event;
}

module.exports = {
    publishPlayerBalanceUpdated,
};