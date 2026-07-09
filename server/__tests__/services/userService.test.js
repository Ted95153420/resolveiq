
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

const newUser = {
    id: 2,
    name: "New User",
    username: "demo124",
    age: 27,
    nationality: "CANADA",
    loyaltypointbalance: 0,
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


describe("createUser", () => {
    beforeEach(() => {
        jest.clearAllMocks();       
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

        expect(addUser).toHaveBeenCalled()

    });

    test("createUser does record event when user does not pre exist", async () => {
        hasProcessedEvent.mockResolvedValue(false);
        getUserByUsername.mockResolvedValue(null);

        await createUser(newUserEvent);

        expect(recordProcessedEvent).toHaveBeenCalledWith("event-124", "user.created");

    });


});