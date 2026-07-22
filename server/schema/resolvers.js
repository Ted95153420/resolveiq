const { GraphQLError } = require("graphql");
const {
    DuplicateUsernameError,
} = require("../errors/DuplicateUsernameError");

const { 
    createUserFromDashboard,
} = require("../services/userService");

const { 
    getUsers, 
    getUserById, 
    updateUserName, 
    deleteUser 
} = require("../repositories/userRepository");

const { 
    getTransactionsByUserId,
} = require("../repositories/transactionRepository");

const {
    adjustPoints,
} = require("../services/pointsAdjustmentService");

const resolvers = {
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
};

module.exports = { resolvers };