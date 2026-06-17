const { createUser } = require("../services/userService");
const { getUsers, getUserById, updateUserName, deleteUser } = require("../repositories/userRepository");
const { MovieList } = require("../FakeMovieData");
const _ = require("lodash");

const resolvers = {
    Query: {
        users: async () => {
            return await getUsers();
        },

        user: async (parent, args) => {
            return await getUserById(args.id);
        },

        movies: () => {
            return MovieList;
        },

        movie: (parent, args) => {
            return _.find(MovieList, { name: args.name });
        }
    },

    User: {
        favouriteMovies: () => {
            return _.filter(
                MovieList,
                (movie) =>
                    movie.yearOfPublication >= 1982 && movie.yearOfPublication <= 1987
            );
        }
    },

    Mutation: {
        createUser: async (parent, args) => {
            return await createUser(args.input);
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