const {
    validateIncomingTransaction,
} = require("../../validators/transactionValidator");

describe("validateIncomingTransaction", () => {
    const validNormalTransaction = {
        username: "demo123",
        transactioncode: "TRAN",
        gametype: "Slots",
        amountwagered: 45.66,
    };

    const validAdjustment = {
        username: "demo123",
        transactioncode: "ADJ",
        points_delta: 500,
        adjustment_reason: "Missing points correction",
    };

    test("throws when transactioncode is not TRAN or ADJ", () => {
        const payload = {
            ...validNormalTransaction,
            transactioncode: "INVALID",
        };

        expect(() => validateIncomingTransaction(payload)).toThrow(
            "Invalid transaction code"
        );
    });

    test("does not throw for a valid TRAN transaction", () => {
        expect(() =>
            validateIncomingTransaction(validNormalTransaction)
        ).not.toThrow();
    });

    test("does not throw for a valid positive ADJ transaction", () => {
        expect(() =>
            validateIncomingTransaction(validAdjustment)
        ).not.toThrow();
    });

    test("does not throw for a valid negative ADJ transaction", () => {
        const payload = {
            ...validAdjustment,
            points_delta: -200,
        };

        expect(() => validateIncomingTransaction(payload)).not.toThrow();
    });

    test("throws when an ADJ transaction contains amountwagered", () => {
        const payload = {
            ...validAdjustment,
            amountwagered: 50,
        };

        expect(() => validateIncomingTransaction(payload)).toThrow(
            "ADJ transactions cannot contain amountwagered"
        );
    });

    test("throws when an ADJ transaction contains a gametype", () => {
        const payload = {
            ...validAdjustment,
            gametype: "Slots",
        };

        expect(() => validateIncomingTransaction(payload)).toThrow(
            "ADJ transactions cannot contain gametype"
        );
    });

    test("throws when an ADJ transaction has no points_delta", () => {
        const payload = {
            ...validAdjustment,
        };

        delete payload.points_delta;

        expect(() => validateIncomingTransaction(payload)).toThrow(
            "ADJ transactions require points_delta"
        );
    });

    test("throws when an ADJ transaction has a points_delta of zero", () => {
        const payload = {
            ...validAdjustment,
            points_delta: 0,
        };

        expect(() => validateIncomingTransaction(payload)).toThrow(
            "points_delta cannot be zero"
        );
    });

    test("throws when an ADJ transaction has a decimal points_delta", () => {
        const payload = {
            ...validAdjustment,
            points_delta: 25.5,
        };

        expect(() => validateIncomingTransaction(payload)).toThrow(
            "points_delta must be a whole number"
        );
    });

    test("throws when an ADJ transaction has no adjustment reason", () => {
        const payload = {
            ...validAdjustment,
            adjustment_reason: "",
        };

        expect(() => validateIncomingTransaction(payload)).toThrow(
            "ADJ transactions require an adjustment reason"
        );
    });

    test("throws when a TRAN transaction contains points_delta", () => {
        const payload = {
            ...validNormalTransaction,
            points_delta: 45,
        };

        expect(() => validateIncomingTransaction(payload)).toThrow(
            "TRAN transactions cannot supply points_delta"
        );
    });

    test("throws when a TRAN transaction has no gametype", () => {
        const payload = {
            ...validNormalTransaction,
            gametype: "",
        };

        expect(() => validateIncomingTransaction(payload)).toThrow(
            "TRAN transactions require gametype"
        );
    });

    test("throws when a TRAN transaction has no amountwagered", () => {
        const payload = {
            ...validNormalTransaction,
        };

        delete payload.amountwagered;

        expect(() => validateIncomingTransaction(payload)).toThrow(
            "TRAN transactions require amountwagered"
        );
    });

    test("throws when a TRAN transaction has a zero amountwagered", () => {
        const payload = {
            ...validNormalTransaction,
            amountwagered: 0,
        };

        expect(() => validateIncomingTransaction(payload)).toThrow(
            "amountwagered must be greater than zero"
        );
    });

    test("throws when username is missing", () => {
        const payload = {
            ...validNormalTransaction,
            username: "",
        };

        expect(() => validateIncomingTransaction(payload)).toThrow(
            "Transaction requires a username"
        );
    });
});