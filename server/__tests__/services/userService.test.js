
jest.mock("../../repositories/userRepository", () => ({
    addUser: jest.fn(),
    getUserByUsername: jest.fn(),
}));

jest.mock("../../repositories/processedEventRepository", () => ({
    hasProcessedEvent: jest.fn(),
    recordProcessedEvent: jest.fn(),
}));

const { 
    createUser,
    createUserFromDashboard,
} = require("../../services/userService");

const {
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

const existingUserEvent = {
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

const newUserEvent = {
    eventId: "event-124",
    eventType: "user.created",
    payload: {
        name: "New User",
        username: "demo124",
        age: 27,
        nationality: "CANADA",
        loyaltypointbalance: 0,
    },
};

describe("createUserFromDashboard", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    test("createUserFromDashboard creates a user when username is available", async () => {
        const input = {
            name: "Sarah Thompson",
            username: "sarah123",
            age: 34,
            nationality: "CANADA",
        };

        getUserByUsername.mockResolvedValue(null);

        addUser.mockImplementation(async (user) => ({
            id: 2,
            ...user,
        }));

        const result = await createUserFromDashboard(input);

        expect(result).toEqual({
            id: 2,
            name: "Sarah Thompson",
            username: "sarah123",
            age: 34,
            nationality: "CANADA",
            loyaltypointbalance: 0,
        });
    });

    test("createUserFromDashboard calls addUser for a new username", async () => {
        const input = {
            name: "Sarah Thompson",
            username: "sarah123",
            age: 34,
            nationality: "CANADA",
        };

        getUserByUsername.mockResolvedValue(null);
        addUser.mockImplementation(async (user) => ({
            id: 2,
            ...user,
        }));

        await createUserFromDashboard(input);

        expect(addUser).toHaveBeenCalledWith({
            name: "Sarah Thompson",
            username: "sarah123",
            age: 34,
            nationality: "CANADA",
            loyaltypointbalance: 0,
        });
    });

    test("createUserFromDashboard rejects an existing username", async () => {
        const input = {
            name: "Different Person",
            username: "sarah123",
            age: 42,
            nationality: "CANADA",
        };

        getUserByUsername.mockResolvedValue({
            id: 1,
            name: "Sarah Thompson",
            username: "sarah123",
            age: 34,
            nationality: "CANADA",
            loyaltypointbalance: 500,
        });

        await expect(createUserFromDashboard(input)).rejects.toThrow(
            "Username 'sarah123' already exists"
        );
    });

    test("createUserFromDashboard does not call addUser when username exists", async () => {
        const input = {
            name: "Different Person",
            username: "sarah123",
            age: 42,
            nationality: "CANADA",
        };

        getUserByUsername.mockResolvedValue({
            id: 1,
            username: "sarah123",
        });

        await expect(createUserFromDashboard(input)).rejects.toThrow();

        expect(addUser).not.toHaveBeenCalled();
    });

    test("createUserFromDashboard converts PostgreSQL duplicate username error into a clear error", async () => {
        const input = {
            name: "Sarah Thompson",
            username: "sarah123",
            age: 34,
            nationality: "CANADA",
        };

        getUserByUsername.mockResolvedValue(null);

        addUser.mockRejectedValue({
            code: "23505",
            constraint: "users_username_key",
        });

        await expect(createUserFromDashboard(input)).rejects.toThrow(
            "Username 'sarah123' already exists"
        );
    });

    test("createUserFromDashboard rethrows unexpected database errors", async () => {
        const input = {
            name: "Sarah Thompson",
            username: "sarah123",
            age: 34,
            nationality: "CANADA",
        };

        const databaseError = new Error("Database unavailable");

        getUserByUsername.mockResolvedValue(null);
        addUser.mockRejectedValue(databaseError);

        await expect(createUserFromDashboard(input)).rejects.toThrow(
            "Database unavailable"
        );
    });
});

describe("createUser", () => {
    beforeEach(() => {
        jest.resetAllMocks();       
    });

    test("create User returns existing user returned if already in database", async () => {
        hasProcessedEvent.mockResolvedValue(false);
        getUserByUsername.mockResolvedValue(existingUser);
        const result = await createUser(existingUserEvent);

        expect(result).toEqual(existingUser);
    });

    test("createUser does not call addUser when existing user detected", async () => {
        hasProcessedEvent.mockResolvedValue(false);
        getUserByUsername.mockResolvedValue(existingUser);
        await createUser(existingUserEvent);

        expect(addUser).not.toHaveBeenCalled();
    });
    
    test("createUser does record event as processed even if existing user detected", async () => {
        hasProcessedEvent.mockResolvedValue(false);
        getUserByUsername.mockResolvedValue(existingUser);

        await createUser(existingUserEvent);

        expect(recordProcessedEvent).toHaveBeenCalledWith("event-123", "user.created");

    });

    test("createUser does call addUser when user does not pre exist", async () => {
        hasProcessedEvent.mockResolvedValue(false);
        getUserByUsername.mockResolvedValue(null);

        await createUser(newUserEvent);

        expect(addUser).toHaveBeenCalled();

    });

    test("createUser does record event when user does not pre exist", async () => {
        hasProcessedEvent.mockResolvedValue(false);
        getUserByUsername.mockResolvedValue(null);

        await createUser(newUserEvent);

        expect(recordProcessedEvent).toHaveBeenCalledWith("event-124", "user.created");

    });


});