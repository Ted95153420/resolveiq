import React from "react";
import { gql } from "@apollo/client";
import { useQuery} from "@apollo/client/react";

const QUERY_ALL_USERS = gql`
    query GetAllUsers{
        users{
            name
            age
            nationality
            username
  }
}`

function DisplayData() {
    const { data } = useQuery(QUERY_ALL_USERS);

    if (data) {
        console.log(data)
    }

    return (
        <div>
            {data &&
                data.users.map((user) => {
                    return (
                        <div key={user.username}>
                            <h2>Name: {user.name}</h2>
                            <h3>Age: {user.age}</h3>
                            <h3>Username: {user.username}</h3>
                            <h3>Nationality: {user.nationality}</h3>
                        </div>
                    );
                })}
        </div>
    );
}

export default DisplayData;