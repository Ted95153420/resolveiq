const {
    Kafka,
} = require("kafkajs");

const crypto = require("crypto");

const {
    buildKafkaConfig,
} = require("@resolveiq/kafka");

const CLIENT_ID =
    "resolveiq-player-balance-producer";

const TOPIC =
    "player-balance-events";

let producer;
let isConnected = false;

function buildPlayerBalanceUpdatedEvent(
    balanceUpdate
) {
    return {
        eventType:
            "player.balance.updated",

        eventId:
            crypto.randomUUID(),

        occurredAt:
            new Date().toISOString(),

        payload: {
            username:
                balanceUpdate.username,

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
}

function buildKafkaMessage(event) {
    return {
        key: event.payload.username,
        value: JSON.stringify(event),
    };
}

function getProducer() {
    if (producer) {
        return producer;
    }

    const kafka = new Kafka(
        buildKafkaConfig(CLIENT_ID)
    );

    producer = kafka.producer();

    return producer;
}

async function getConnectedProducer() {
    const kafkaProducer =
        getProducer();

    if (!isConnected) {
        await kafkaProducer.connect();
        isConnected = true;
    }

    return kafkaProducer;
}

async function publishPlayerBalanceUpdated(
    balanceUpdate
) {
    const event =
        buildPlayerBalanceUpdatedEvent(
            balanceUpdate
        );

    const kafkaProducer =
        await getConnectedProducer();

    await kafkaProducer.send({
        topic: TOPIC,
        messages: [
            buildKafkaMessage(event),
        ],
    });

    return event;
}

module.exports = {
    publishPlayerBalanceUpdated,
};