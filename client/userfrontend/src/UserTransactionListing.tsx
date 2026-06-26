import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

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
        <TableContainer component={Paper}>
            <Typography variant="h5" sx={{ p: 2 }}>
                List Of Loyalty Customers
            </Typography>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Nationality</TableCell>
                        <TableCell>Loyalty Balance</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {data?.users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.age}</TableCell>
                            <TableCell>{user.nationality}</TableCell>
                            <TableCell>{user.loyaltypointbalance}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default UserTransactionListing;