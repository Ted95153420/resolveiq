const _ = require("lodash");
const { UserList } = require("../FakeUserData");

function createUser(userInput) {
    const nextId = (_.maxBy(UserList, "id")?.id ?? 0) + 1;

    const newUser = {
        id: nextId,
        loyaltypointbalance: 0,
        ...userInput,
    };

    UserList.push(newUser);

    return newUser;
}

module.exports = { createUser };