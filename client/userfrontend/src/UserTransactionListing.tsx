import { gql } from "@apollo/client";
import { useQuery} from "@apollo/client/react";

const QUERY_ALL_USERS = gql`
    query GetAllUsers{
        users{
            id
            name
            age
            nationality            
            username
            loyaltypointbalance
  }
}`;

type User = {
    id: number;
    name: string;
    age: number;
    nationality: string;
    username: string;
    loyaltypointbalance: number;
};

type GetAllUsersData = {
    users: User[];
};

function UserTransactionListing() {

    const { data, loading, error } = useQuery<GetAllUsersData>(QUERY_ALL_USERS , {
        pollInterval: 3000,
    });

    if (data) {
        console.log(data);
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading users.</div>;

    return (
        <div>
            { data?.users.map((user) => {
                    return (
                        <div key={user.id} style={{ marginBottom: "2rem" }}>
                            <h2>List Of Loyalty Customers</h2>
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

export default UserTransactionListing;