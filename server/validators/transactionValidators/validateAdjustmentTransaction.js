function validateAdjustmentTransaction(payload) {
    const {
        gametype,
        amountwagered,
        points_delta,
        adjustment_reason,
    } = payload;

    if (amountwagered !== undefined && amountwagered !== null) {
        throw new Error(
            "ADJ transactions cannot contain amountwagered"
        );
    }

    if (
        gametype !== undefined &&
        gametype !== null &&
        gametype.trim() !== ""
    ) {
        throw new Error("ADJ transactions cannot contain gametype");
    }

    if (points_delta === undefined || points_delta === null) {
        throw new Error("ADJ transactions require points_delta");
    }

    if (!Number.isInteger(points_delta)) {
        throw new Error("points_delta must be a whole number");
    }

    if (points_delta === 0) {
        throw new Error("points_delta cannot be zero");
    }

    if (
        typeof adjustment_reason !== "string" ||
        adjustment_reason.trim() === ""
    ) {
        throw new Error(
            "ADJ transactions require an adjustment reason"
        );
    }
}

module.exports = {
    validateAdjustmentTransaction,
};