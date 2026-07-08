
jest.mock("../../repositories/userRepository", () => ({
    getUsers: jest.fn(),
    addUser: jest.fn(),
    getUserByUsername: jest.fn(),
}));

jest.mock("../../repositories/processedEventRepository", () => ({
    hasProcessedEvent: jest.fn(),
    recordProcessedEvent: jest.fn(),
}));

const { createUser } = require("../../services/userService");

const {
    getUsers,
    addUser,
    getUserByUsername,
} = require("../../repositories/userRepository");

const {
    hasProcessedEvent,
    recordProcessedEvent,
} = require("../../repositories/processedEventRepository");



describe("userService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("user is not created if username already exists", async () => {
        const existingUser = {
            id: 1,
            name: "Existing User",
            username: "demo123",
            age: 40,
            nationality: "CANADA",
            loyaltypointbalance: 500,
        };

        const event = {
            eventId: "event-123",
            eventType: "user.created",
            payload: {
                name: "New User",
                username: "demo123",
                age: 25,
                nationality: "CANADA",
                loyaltypointbalance: 100,
            },
        };

        hasProcessedEvent.mockResolvedValue(false);
        getUserByUsername.mockResolvedValue(existingUser);

        const result = await createUser(event);

        expect(result).toEqual(existingUser);
        expect(addUser).not.toHaveBeenCalled();
        expect(recordProcessedEvent).toHaveBeenCalledWith("event-123", "user.created");
    });
});