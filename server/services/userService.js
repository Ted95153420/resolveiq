const _ = require("lodash");
const { getUsers, addUser, getUserByUsername } = require("../repositories/userRepository");

const {
    hasProcessedEvent,
    recordProcessedEvent,
} = require("../repositories/processedEventRepository");

const {
    DuplicateUsernameError,
} = require("../errors/DuplicateUsernameError");

async function createUser(event) {
    const { eventId, eventType, payload } = event;

    const alreadyProcessed = await hasProcessedEvent(eventId);

    if (alreadyProcessed) {
        return null;
    }

    const existingUser = await getUserByUsername(payload.username);

    if (existingUser) {
        await recordProcessedEvent(eventId, eventType);
        return existingUser;
    }

    const newUser = {
        name: payload.name,
        username: payload.username,
        age: payload.age,
        nationality: payload.nationality,
        loyaltypointbalance: payload.loyaltypointbalance ?? 0,
    };

    const createdUser = await addUser(newUser);
    await recordProcessedEvent(eventId, eventType);

    return createdUser;
}

async function createUserFromDashboard(input) {
    const existingUser = await getUserByUsername(input.username);

    if (existingUser) {
        throw new Error(`Username '${input.username}' already exists`);
    }

    const newUser = {
        ...input,
        loyaltypointbalance: 0,
    };

    try
    {
        return await addUser(newUser);
    } catch(error){
        const isDuplicateUserName =
            error.code === "23505" &&
            error.constraint === "users_username_key";

        if (isDuplicateUserName) {
            throw new DuplicateUsernameError(input.username);
        }

        throw error;
    }
}

module.exports = {
    createUser,
    createUserFromDashboard,
};
