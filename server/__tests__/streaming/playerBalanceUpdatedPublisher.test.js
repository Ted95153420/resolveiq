const mockConnect = jest.fn();
const mockSend = jest.fn();
const mockDisconnect = jest.fn();

const mockProducer = {
    connect: mockConnect,
    send: mockSend,
    disconnect: mockDisconnect,
};

const mockKafkaConstructor = jest.fn(() => ({
    producer: jest.fn(() => mockProducer),
}));

jest.mock(
    "kafkajs",
    () => ({
        Kafka: mockKafkaConstructor,
    }),
    {
        virtual: true,
    }
);

jest.mock(
    "@resolveiq/kafka",
    () => ({
        buildKafkaConfig: jest.fn(() => ({
            clientId: "resolveiq-player-balance-producer",
            brokers: ["localhost:9092"],
        })),
    })
);

const {
    buildKafkaConfig,
} = require(
    "@resolveiq/kafka"
);

const {
    publishPlayerBalanceUpdated,
} = require(
    "../../../streaming/consumer/publishers/playerBalanceUpdatedPublisher"
);

describe("publishPlayerBalanceUpdated", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockConnect.mockResolvedValue(undefined);
        mockSend.mockResolvedValue(undefined);
        mockDisconnect.mockResolvedValue(undefined);
    });

    it("publishes a player.balance.updated event to Kafka", async () => {
        const balanceUpdate = {
            username: "DSmith",
            previousBalance: 1000,
            newBalance: 1050,
            pointsDelta: 50,
            sourceTransactionId: 1001,
            sourceEventId: "transaction-event-123",
        };

        const returnedEvent =
            await publishPlayerBalanceUpdated(
                balanceUpdate
        );

        expect(
            buildKafkaConfig
        ).toHaveBeenCalledWith(
            "resolveiq-player-balance-producer"
        );

        expect(
            mockKafkaConstructor
        ).toHaveBeenCalledWith({
            clientId:
                "resolveiq-player-balance-producer",
            brokers: ["localhost:9092"],
        });

        expect(
            mockConnect
        ).toHaveBeenCalledTimes(1);

        expect(
            mockSend
        ).toHaveBeenCalledTimes(1);

        const sendArguments =
            mockSend.mock.calls[0][0];

        expect(sendArguments.topic).toBe(
            "player-balance-events"
        );

        expect(sendArguments.messages).toHaveLength(
            1
        );

        const publishedMessage =
            sendArguments.messages[0];

        expect(publishedMessage.key).toBe(
            "DSmith"
        );

        const publishedEvent =
            JSON.parse(publishedMessage.value);

        expect(returnedEvent).toEqual(
            publishedEvent
        );

        expect(publishedEvent).toEqual({
            eventType: "player.balance.updated",
            eventId: expect.any(String),
            occurredAt: expect.any(String),

            payload: {
                username: "DSmith",
                previousBalance: 1000,
                newBalance: 1050,
                pointsDelta: 50,
                sourceTransactionId: 1001,
                sourceEventId:
                    "transaction-event-123",
            },
        });
    });
});