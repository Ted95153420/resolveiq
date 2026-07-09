
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

describe("createUser", () => {
    beforeEach(() => {
        jest.clearAllMocks();       
    });

    test("create User returns existing user returned if already in database", async () => {
        hasProcessedEvent.mockResolvedValue(false);
        getUserByUsername.mockResolvedValue(existingUser);
        const result = await createUser(event);

        expect(result).toEqual(existingUser);
    });

    test("createUser does not call addUser when existing user detected", async () => {
        hasProcessedEvent.mockResolvedValue(false);
        getUserByUsername.mockResolvedValue(existingUser);
        await createUser(event);

        expect(addUser).not.toHaveBeenCalled();
    });
    
    test("createUser does record event as processed even if existing user detected", async () => {
        hasProcessedEvent.mockResolvedValue(false);
        getUserByUsername.mockResolvedValue(existingUser);

        await createUser(event);

        expect(recordProcessedEvent).toHaveBeenCalledWith("event-123", "user.created");

    });
});