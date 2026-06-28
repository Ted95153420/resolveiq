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
        console.log(`User with username ${payload.username} already exists. Skipping create.`);
        await recordProcessedEvent(eventId, eventType);
        return existingUser;
    }

    const users = await getUsers();
    const nextId = (_.maxBy(users, "id")?.id ?? 0) + 1;

    const newUser = {
        ...payload,
        id: nextId,
        loyaltypointbalance: payload.loyaltypointbalance ?? 0,
    };

    await addUser(newUser);
    await recordProcessedEvent(eventId, eventType);

    return newUser;
}



module.exports = { createUser };