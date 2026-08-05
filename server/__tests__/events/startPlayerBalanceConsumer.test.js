jest.mock(
    "@resolveiq/kafka",
    () => ({
        runConsumer: jest.fn(),
    })
);

jest.mock(
    "../../events/handlers/playerBalanceUpdatedEventHandler",
    () => ({
        handlePlayerBalanceUpdatedEvent:
            jest.fn(),
    })
);

const {
    runConsumer,
} = require("@resolveiq/kafka");

const {
    handlePlayerBalanceUpdatedEvent,
} = require(
    "../../events/handlers/playerBalanceUpdatedEventHandler"
);

const {
    startPlayerBalanceConsumer,
} = require(
    "../../events/startPlayerBalanceConsumer"
);

describe("startPlayerBalanceConsumer", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        runConsumer.mockResolvedValue(undefined);
    });

    it("starts a Kafka consumer for player balance events", async () => {
        await startPlayerBalanceConsumer();

        expect(
            runConsumer
        ).toHaveBeenCalledTimes(1);

        expect(
            runConsumer
        ).toHaveBeenCalledWith({
            clientId:
                "resolveiq-player-balance-consumer",

            groupId:
                "resolveiq-player-balance-group",

            topic:
                "player-balance-events",

            handler:
                handlePlayerBalanceUpdatedEvent,
        });
    });

    it("allows startup errors to be handled by the GraphQL server", async () => {
        runConsumer.mockRejectedValue(
            new Error("Kafka unavailable")
        );

        await expect(
            startPlayerBalanceConsumer()
        ).rejects.toThrow(
            "Kafka unavailable"
        );
    });
});