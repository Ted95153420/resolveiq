jest.mock("../../repositories/userRepository", () => ({
    updateUserLoyaltyBalance: jest.fn(),
}));

const {
    updateUserLoyaltyBalance,
} = require("../../repositories/userRepository");

const {
    calculatePointsFromAmount,
    applyTransactionToLoyalty,
} = require("../../services/loyaltyService");

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

describe("applyTransactionToLoyalty", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns the previous balance, earned points, new balance and updated user", async () => {
        const user = {
            id: 1,
            username: "DSmith",
            loyaltypointbalance: 1000,
        };

        const transaction = {
            amountwagered: 50,
        };

        const updatedUser = {
            ...user,
            loyaltypointbalance: 1050,
        };

        updateUserLoyaltyBalance.mockResolvedValue(
            updatedUser
        );

        const result =
            await applyTransactionToLoyalty(
                user,
                transaction
            );

        expect(
            updateUserLoyaltyBalance
        ).toHaveBeenCalledTimes(1);

        expect(
            updateUserLoyaltyBalance
        ).toHaveBeenCalledWith(
            1,
            1050
        );

        expect(result).toEqual({
            previousBalance: 1000,
            earnedPoints: 50,
            newBalance: 1050,
            updatedUser,
        });
    });

    test("treats a missing loyalty balance as zero", async () => {
        const user = {
            id: 2,
            username: "MCooper",
            loyaltypointbalance: null,
        };

        const transaction = {
            amountwagered: 25.75,
        };

        const updatedUser = {
            ...user,
            loyaltypointbalance: 25,
        };

        updateUserLoyaltyBalance.mockResolvedValue(
            updatedUser
        );

        const result =
            await applyTransactionToLoyalty(
                user,
                transaction
            );

        expect(
            updateUserLoyaltyBalance
        ).toHaveBeenCalledWith(
            2,
            25
        );

        expect(result).toEqual({
            previousBalance: 0,
            earnedPoints: 25,
            newBalance: 25,
            updatedUser,
        });
    });
});