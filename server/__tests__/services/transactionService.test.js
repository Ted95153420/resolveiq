jest.mock("../../repositories/processedEventRepository", () => ({
    recordProcessedEvent: jest.fn(),
    hasProcessedEvent: jest.fn(),
}));

jest.mock("../../repositories/transactionRepository", () => ({
    addTransaction: jest.fn(),
}));

jest.mock("../../repositories/userRepository", () => ({
    getUserByUsername: jest.fn(),
}));

jest.mock("../../services/loyaltyService", () => ({
    applyTransactionToLoyalty: jest.fn(),
}));

const {
    createTransaction,
} = require("../../services/transactionService");

const {
    getUserByUsername
} = require("../../repositories/userRepository");

const {
    recordProcessedEvent,
    hasProcessedEvent,
} = require("../../repositories/processedEventRepository");

const {
    addTransaction,
} = require("../../repositories/transactionRepository");

describe("transactionService", () => {
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
    beforeEach(() => {
        jest.clearAllMocks();
    });

    

    test("createTransaction returns null if transaction already processed", async () => {
        hasProcessedEvent.mockResolvedValue(true);
        const result = await createTransaction(event);
        expect(result).toBeNull();
    });

    test("createTransaction does not call getUserByUsername if Transaction event was already processed", async () => {
        hasProcessedEvent.mockResolvedValue(true);
        await createTransaction(event);
        expect(getUserByUsername).not.toHaveBeenCalled();
    });

    test("createTransaction calls recordProcessedEvent if user does not exist", async () => {
        hasProcessedEvent.mockResolvedValue(false); 
        getUserByUsername.mockResolvedValue(false);

        await createTransaction(event);

        expect(recordProcessedEvent).toHaveBeenCalledWith(
            "txn-event-123",
            "transaction.created");
    });

    test("createTransaction returns null if user does not exist", async () => {
        hasProcessedEvent.mockResolvedValue(false);
        getUserByUsername.mockResolvedValue(null);

        const result = await createTransaction(event);

        expect(result).toBeNull();
    });

    test("createTransaction calls addTransaction if transaction not processed before and user exists ", async () => {
        hasProcessedEvent.mockResolvedValue(false);
        getUserByUsername.mockResolvedValue({
            id: 1,
            name: "Demo User",
            username: "demo123",
            age: 32,
            nationality: "CANADA",
            loyaltypointbalance: 1000,
        });

        const result = await createTransaction(event);

        expect(addTransaction).toHaveBeenCalled();
    });
});