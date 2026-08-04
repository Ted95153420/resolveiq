jest.mock("../../events/playerBalanceEvents", () => ({
    publishPlayerBalanceUpdated: jest.fn(),
}));

const {
    publishPlayerBalanceUpdated,
} = require("../../events/playerBalanceEvents");

const {
    handlePlayerBalanceUpdatedEvent,
} = require(
    "../../events/handlers/playerBalanceUpdatedEventHandler"
);

describe("handlePlayerBalanceUpdatedEvent", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("forwards a player.balance.updated Kafka event to GraphQL PubSub", async () => {
        const event = {
            eventType: "player.balance.updated",
            eventId: "balance-event-123",
            occurredAt: "2026-08-04T18:00:00.000Z",

            payload: {
                username: "DSmith",
                previousBalance: 1000,
                newBalance: 1050,
                pointsDelta: 50,
                sourceTransactionId: 1001,
                sourceEventId: "transaction-event-123",
            },
        };

        await handlePlayerBalanceUpdatedEvent(event);

        expect(
            publishPlayerBalanceUpdated
        ).toHaveBeenCalledTimes(1);

        expect(
            publishPlayerBalanceUpdated
        ).toHaveBeenCalledWith({
            username: "DSmith",
            loyaltypointbalance: 1050,
        });
    });

    it("ignores event types other than player.balance.updated", async () => {
        const event = {
            eventType: "transaction.created",
            eventId: "transaction-event-123",
            payload: {
                username: "DSmith",
                newBalance: 1050,
            },
        };

        await handlePlayerBalanceUpdatedEvent(event);

        expect(
            publishPlayerBalanceUpdated
        ).not.toHaveBeenCalled();
    });
});