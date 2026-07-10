const _ = require("lodash");
const { getUsers, addUser, getUserByUsername } = require("../repositories/userRepository");

const {
    hasProcessedEvent,
    recordProcessedEvent,
} = require("../repositories/processedEventRepository");

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

    return await addUser(newUser);
}

module.exports = {
    createUser,
    createUserFromDashboard,
};
