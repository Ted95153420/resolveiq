class DuplicateUsernameError extends Error {
    constructor(username) {
        super(`Username '${username}' already exists`);
        this.name = "DuplicateUsernameError";
        this.username = username;
    }
}

module.exports = { DuplicateUsernameError };