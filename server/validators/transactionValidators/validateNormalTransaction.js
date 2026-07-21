function validateNormalTransaction(payload) {
    const {
        gametype,
        amountwagered,
        points_delta,
        adjustment_reason,
    } = payload;

    if (typeof gametype !== "string" || gametype.trim() === "") {
        throw new Error("TRAN transactions require gametype");
    }

    if (amountwagered === undefined || amountwagered === null) {
        throw new Error("TRAN transactions require amountwagered");
    }

    if (
        typeof amountwagered !== "number" ||
        !Number.isFinite(amountwagered) ||
        amountwagered <= 0
    ) {
        throw new Error("amountwagered must be greater than zero");
    }

    if (points_delta !== undefined && points_delta !== null) {
        throw new Error("TRAN transactions cannot supply points_delta");
    }

    if (
        adjustment_reason !== undefined &&
        adjustment_reason !== null &&
        adjustment_reason.trim() !== ""
    ) {
        throw new Error(
            "TRAN transactions cannot contain an adjustment reason"
        );
    }
}

module.exports = {
    validateNormalTransaction,
};