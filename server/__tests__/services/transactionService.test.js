jest.mock("../../repositories/processedEventRepository", () => ({
    hasProcessedEvent: jest.fn(),
}));

const { createTransaction } = require("../../services/transactionService");

const {
    hasProcessedEvent,
} = require("../../repositories/processedEventRepository");

describe("transactionService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    

    test("createTransaction returns null if transaction already processed", async () => {
        const event = {
            eventId: "txn-event-123",
            eventType: "transaction.created",
            payload: {
                id: 123456789,
                username: "demo123",
                gametype: "Slots",
                amountwagered: 45.66,
                transaction_timestamp: "2026-06-30T10:30:00.000Z",
            },
        };
        hasProcessedEvent.mockResolvedValue(true);
        const result = await createTransaction(event);
        expect(result).toBeNull();
    });
});