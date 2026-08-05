function buildKafkaConfig(clientId) {
    if (!process.env.KAFKA_BROKER) {
        throw new Error("KAFKA_BROKER is not set");
    }

    const useSecureKafka =
        process.env.KAFKA_USERNAME &&
        process.env.KAFKA_PASSWORD &&
        process.env.KAFKA_CA_CERT;

    let kafkaConfig = {
        clientId,
        brokers: [process.env.KAFKA_BROKER],
    };

    if (useSecureKafka) {
        console.log(
            "Starting Kafka client in secure mode (Aiven / Render)."
        );

        const caCert =
            process.env.KAFKA_CA_CERT.replace(
                /\\n/g,
                "\n"
            );

        kafkaConfig = {
            ...kafkaConfig,
            ssl: {
                rejectUnauthorized: true,
                ca: [caCert],
            },
            sasl: {
                mechanism: "plain",
                username:
                    process.env.KAFKA_USERNAME,
                password:
                    process.env.KAFKA_PASSWORD,
            },
        };
    } else {
        console.log(
            "Starting Kafka client in local mode (plain Redpanda)."
        );
    }

    return kafkaConfig;
}

module.exports = {
    buildKafkaConfig,
};