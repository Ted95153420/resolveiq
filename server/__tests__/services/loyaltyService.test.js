const { calculatePointsFromAmount } = require("../../services/loyaltyService");

describe("calculatePointsFromAmount", () => {
    test("awards 1 point per whole dollar waged", () => { 
        expect(calculatePointsFromAmount(45.66)).toBe(45);
    });

    test("awards exact points for whole dollar amounts", () => {
        expect(calculatePointsFromAmount(100)).toBe(100);
    });

    test("awards 0 points for amounts under 1 dollar", () => {
        expect(calculatePointsFromAmount(0.99)).toBe(0);
    });
});