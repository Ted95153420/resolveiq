const { createUser } = require("../services/userService");
const { getUsers, getUserById, updateUserName, deleteUser } = require("../repositories/userRepository");
const { MovieList } = require("../FakeMovieData");
const _ = require("lodash");

const resolvers = {
    Query: {
        //USER RESOLVERS
        users: () => {
            return getUsers();
        },

        user: (parent, args) => {
            return getUserById(args.id);
        },

        movies: () => {
            return MovieList;
        },

        movie: (parent, args) => {
            const name = args.name;
            return _.find(MovieList, { name: name });
        }
    },

    Mutation: {
        createUser: (parent, args) => {
            return createUser(args.input);
        },

        updateUserName: (parent, args) => {
            const { id, newUserName } = args.input;
            return updateUserName(id, newUserName);
        },

        deleteUser: (parent, args) => {
            return deleteUser(args.id);
        }
    }
};

module.exports = { resolvers };