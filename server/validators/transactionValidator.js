const {
    validateCommonFields,
} = require("./transactionValidators/validateCommonFields");

const {
    validateNormalTransaction,
} = require("./transactionValidators/validateNormalTransaction");

const {
    validateAdjustmentTransaction,
} = require(
    "./transactionValidators/validateAdjustmentTransaction"
);

const transactionValidators = {
    TRAN: validateNormalTransaction,
    ADJ: validateAdjustmentTransaction,
};

function validateIncomingTransaction(payload) {
    validateCommonFields(payload);

    const validator = transactionValidators[payload.transactioncode];

    if (!validator) {
        throw new Error("Invalid transaction code");
    }

    validator(payload);
}

module.exports = {
    validateIncomingTransaction,
};