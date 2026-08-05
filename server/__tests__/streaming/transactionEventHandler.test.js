jest.mock("../../services/transactionService", () => ({
    createTransaction: jest.fn(),
}));

jest.mock(
    "../../../streaming/consumer/publishers/playerBalanceUpdatedPublisher",
    () => ({
        publishPlayerBalanceUpdated: jest.fn(),
    }),
    {
        virtual: true,
    }
);

const {
    createTransaction,
} = require("../../services/transactionService");

const {
    publishPlayerBalanceUpdated,
} = require(
    "../../../streaming/consumer/publishers/playerBalanceUpdatedPublisher"
);

const {
    handleTransactionEvent,
} = require(
    "../../../streaming/consumer/handlers/transactionEventHandler"
);

describe("handleTransactionEvent", () => {
    const transactionCreatedEvent = {
        eventId: "event-123",
        eventType: "transaction.created",
        occurredAt: "2026-08-04T18:00:00.000Z",
        payload: {
            id: 1001,
            username: "DSmith",
            transactioncode: "GAME",
            gametype: "SLOTS",
            amountwagered: 50,
            transaction_timestamp:
                "2026-08-04T18:00:00.000Z",
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("creates a transaction when a transaction.created event is received", async () => {
        createTransaction.mockResolvedValue({
            transaction: {
                id: 1001,
                user_id: 1,
                transactioncode: "GAME",
                gametype: "SLOTS",
                amountwagered: 50,
                points_delta: 50,
                adjustment_reason: null,
                transaction_timestamp:
                    "2026-08-04T18:00:00.000Z",
            },
            loyalty: {
                earnedPoints: 50,
                newBalance: 1050,
                previousBalance: 1000,
                updatedUser: {
                    id: 1,
                    name: "Dan Smith",
                    username: "DSmith",
                    loyaltypointbalance: 1050,
                },
            },
        });

        await handleTransactionEvent(
            transactionCreatedEvent
        );

        expect(
            createTransaction
        ).toHaveBeenCalledTimes(1);

        expect(
            createTransaction
        ).toHaveBeenCalledWith(
            transactionCreatedEvent
        );
    });

    it("publishes player.balance.updated after a transaction updates the player balance", async () => {
        createTransaction.mockResolvedValue({
            transaction: {
                id: 1001,
                user_id: 1,
                transactioncode: "GAME",
                gametype: "SLOTS",
                amountwagered: 50,
                points_delta: 50,
                adjustment_reason: null,
                transaction_timestamp:
                    "2026-08-04T18:00:00.000Z",
            },
            loyalty: {
                earnedPoints: 50,
                newBalance: 1050,
                previousBalance: 1000,
                updatedUser: {
                    id: 1,
                    name: "Dan Smith",
                    username: "DSmith",
                    loyaltypointbalance: 1050,
                },
            },
        });

        await handleTransactionEvent(
            transactionCreatedEvent
        );

        expect(
            publishPlayerBalanceUpdated
        ).toHaveBeenCalledTimes(1);

        expect(
            publishPlayerBalanceUpdated
        ).toHaveBeenCalledWith({
            username: "DSmith",
            previousBalance: 1000,
            newBalance: 1050,
            pointsDelta: 50,
            sourceTransactionId: 1001,
            sourceEventId: "event-123",
        });
    });

    it("does not publish a balance event when the transaction is skipped", async () => {
        createTransaction.mockResolvedValue(null);

        await handleTransactionEvent(
            transactionCreatedEvent
        );

        expect(
            publishPlayerBalanceUpdated
        ).not.toHaveBeenCalled();
    });

    it("does not publish a balance event when transaction processing fails", async () => {
        createTransaction.mockRejectedValue(
            new Error("Database unavailable")
        );

        await expect(
            handleTransactionEvent(
                transactionCreatedEvent
            )
        ).rejects.toThrow(
            "Database unavailable"
        );

        expect(
            publishPlayerBalanceUpdated
        ).not.toHaveBeenCalled();
    });

    it("ignores event types that are not transaction.created", async () => {
        const unknownEvent = {
            eventId: "event-999",
            eventType: "transaction.cancelled",
            payload: {},
        };

        await handleTransactionEvent(
            unknownEvent
        );

        expect(
            createTransaction
        ).not.toHaveBeenCalled();

        expect(
            publishPlayerBalanceUpdated
        ).not.toHaveBeenCalled();
    });

    it("publishes the previous balance returned by the loyalty service", async () => {
        createTransaction.mockResolvedValue({
            transaction: {
                id: 1001,
                user_id: 1,
                transactioncode: "TRAN",
                gametype: "Slots",
                amountwagered: 50,
                points_delta: 50,
                adjustment_reason: null,
                transaction_timestamp:
                    "2026-08-05T18:00:00.000Z",
            },

            loyalty: {
                earnedPoints: 50,
                newBalance: 1050,
                previousBalance: 1000,
                updatedUser: {
                    id: 1,
                    username: "DSmith",
                    loyaltypointbalance: 1050,
                },
            },
        });

        await handleTransactionEvent(
            transactionCreatedEvent
        );

        expect(
            publishPlayerBalanceUpdated
        ).toHaveBeenCalledWith({
            username: "DSmith",
            previousBalance: 1000,
            newBalance: 1050,
            pointsDelta: 50,
            sourceTransactionId: 1001,
            sourceEventId: "event-123",
        });
    });
});