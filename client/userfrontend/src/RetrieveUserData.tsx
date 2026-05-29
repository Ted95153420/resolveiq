import { gql } from "@apollo/client";
import { useQuery} from "@apollo/client/react";

const QUERY_ALL_USERS = gql`
    query GetAllUsers{
        users{
            name
            age
            nationality
            loyaltypointbalance
  }
}`;

type User = {
    name: string;
    age: number;
    nationality: string;
    username: string;
    loyaltypointbalance: number;
};

type GetAllUsersData = {
    users: User[];
};

function DisplayData() {
    const { data } = useQuery<GetAllUsersData>(QUERY_ALL_USERS);

    if (data) {
        console.log(data)
    }

    return (
        <div>
            { data?.users.map((user) => {
                    return (
                        <div key={user.username}>
                            <h2>Name: {user.name}</h2>
                            <h3>Age: {user.age}</h3>
                            <h3>Nationality: {user.nationality}</h3>
                            <h3>Loyalty Balance: {user.loyaltypointbalance}</h3>
                        </div>
                    );
                })}
        </div>
    );
}

export default DisplayData;