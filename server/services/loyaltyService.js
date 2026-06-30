const { updateUserLoyaltyBalance } = require("../repositories/userRepository");

function calculatePointsFromAmount(amountWagered) {
    return Math.floor(Number(amountWagered));
}

async function applyTransactionToLoyalty(user, transaction) {
    const earnedPoints = calculatePointsFromAmount(transaction.amountwagered);
    const currentBalance = user.loyaltypointbalance ?? 0;
    const newBalance = currentBalance + earnedPoints;

    const updatedUser = await updateUserLoyaltyBalance(user.id, newBalance);

    return {
        earnedPoints,
        newBalance,
        updatedUser,
    };
}

module.exports = {
    calculatePointsFromAmount,
    applyTransactionToLoyalty,
};