const { createUser } = require("../services/userService");
const { UserList } = require("../FakeUserData");
const { MovieList } = require("../FakeMovieData");
const _ = require("lodash");

const resolvers = {
    Query: {
        //USER RESOLVERS
        users: () => {
            return UserList
        },

        user:(parent, args) => {
            const id = args.id;
            const user = _.find(UserList, { id: Number(id) })
            return user;
        
        },

        //MOVIE RESOLVERS
        movies: () => {
            return MovieList
        },
        movie: (parent, args) => {
            const name = args.name;
            const movie = _.find(MovieList, { name: name })
            return movie;
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
        createUser: (parent, args) => {
            return createUser(args.input)
        },

        updateUserName: (parent, args) => {
            const { id, newUserName } = args.input;
            let userUpdated;
            UserList.forEach((user) => {
                if (user.id == Number(id)) {
                    user.username = newUserName;
                    userUpdated = user
                }
            });
            return userUpdated;
        },

        deleteUser: (parent, args) => {
            const id = args.id;
            _.remove(UserList, (user) => user.id === Number(id));
            return null;
        }
    },
};

module.exports = { resolvers };