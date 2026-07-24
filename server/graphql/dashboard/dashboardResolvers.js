const {
    getUsers,
    getUserById,
    updateUserName,
    deleteUser,
} = require("../../repositories/userRepository");

const {
    getTransactionsByUserId,
} = require("../../repositories/transactionRepository");

const {
    createUserFromDashboard,
} = require("../../services/userService");

const {
    adjustPoints,
} = require("../../services/pointsAdjustmentService");

const {
    DuplicateUsernameError,
} = require("../../errors/DuplicateUsernameError");



const dashboardResolvers = {
    Query: {
        users: async () => {
            return await getUsers();
        },

        user: async (parent, args) => {
            return await getUserById(args.id);
        },
    },

    User: {
        transactions: async (parent) => {
            return await getTransactionsByUserId(parent.id);
        },
    },


    Mutation: {
        createUser: async (parent, args) => {
        try {
            return await createUserFromDashboard(args.input);
        } catch (error) {
            if (error instanceof DuplicateUsernameError) {
                throw new GraphQLError(error.message, {
                    extensions: {
                        code: "BAD_USER_INPUT",
                        field: "username",
                    },
                });
            }

            throw error;
        }
    },

        adjustPoints: async (_, { input }) => {
            try {
                return await adjustPoints(input);
            } catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: {
                        code: "BAD_USER_INPUT",
                    },
                });
            }
        },

        updateUserName: async (parent, args) => {
            const { id, newUserName } = args.input;
            return await updateUserName(id, newUserName);
        },

        deleteUser: async (parent, args) => {
            return await deleteUser(args.id);
        }
    },

    Transaction: {
        transaction_timestamp: (transaction) => {
            const timestamp = transaction.transaction_timestamp;

            if (timestamp instanceof Date) {
                return timestamp.toISOString();
            }

            const parsedTimestamp =
                typeof timestamp === "string" &&
                    /^\d+$/.test(timestamp)
                    ? new Date(Number(timestamp))
                    : new Date(timestamp);

            if (Number.isNaN(parsedTimestamp.getTime())) {
                throw new Error(
                    `Invalid transaction timestamp: ${timestamp}`
                );
            }

            return parsedTimestamp.toISOString();
        },
    },
};

module.exports = { dashboardResolvers };