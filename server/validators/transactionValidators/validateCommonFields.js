function validateCommonFields(payload) {
    if (!payload || typeof payload !== "object") {
        throw new Error("Transaction payload is required");
    }

    if (
        typeof payload.username !== "string" ||
        payload.username.trim() === ""
    ) {
        throw new Error("Transaction requires a username");
    }
}

module.exports = {
    validateCommonFields,
};