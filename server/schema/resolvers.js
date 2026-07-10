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
            return await createUserFromDashboard(args.input);
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