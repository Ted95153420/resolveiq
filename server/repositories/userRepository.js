const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const usersFilePath = path.join(__dirname, "..", "data", "users.json");
console.log("usersFilePath =", usersFilePath);

function getUsers() {
    const fileContents = fs.readFileSync(usersFilePath, "utf-8");
    return JSON.parse(fileContents);
}

function saveUsers(users) {
    console.log("Saving users to:", usersFilePath);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
}

function addUser(newUser) {
    const users = getUsers();
    users.push(newUser);
    console.log("User count before save:", users.length);
    saveUsers(users);
    return newUser;
}

function updateUserName(id, newUserName) {
    const users = getUsers();

    const userToUpdate = _.find(users, { id: Number(id) });

    if (!userToUpdate) {
        return null;
    }

    userToUpdate.username = newUserName;
    saveUsers(users);

    return userToUpdate;
}

function deleteUser(id) {
    const users = getUsers();
    const updatedUsers = users.filter((user) => user.id !== Number(id));

    if (updatedUsers.length === users.length) {
        return null;
    }

    saveUsers(updatedUsers);
    return null;
}

module.exports = {
    getUsers,
    saveUsers,
    addUser,
    updateUserName,
    deleteUser,
};