const _ = require("lodash");
const { getUsers, addUser } = require("../repositories/userRepository");

async function createUser(userInput) {
    const users = await getUsers();
    const nextId = (_.maxBy(users, "id")?.id ?? 0) + 1;

    const newUser = {
        ...userInput,
        id: nextId,
        loyaltypointbalance: 0,
    };

    return addUser(newUser);
}

module.exports = { createUser };