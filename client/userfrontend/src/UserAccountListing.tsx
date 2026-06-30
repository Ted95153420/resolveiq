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
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const QUERY_ALL_USERS = gql`
    query GetAllUsers {
        users {
            id
            name
            age
            nationality
            username
            loyaltypointbalance
        }
    }
`;

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

function UserAccountListing() {
    const { data, loading, error } = useQuery<GetAllUsersData>(QUERY_ALL_USERS, {
        pollInterval: 3000,
        notifyOnNetworkStatusChange: true,
    });

    if (loading && !data) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f7f9fc",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) return <div>Error loading users.</div>;

    return (
        <Box sx={{ p: 3, backgroundColor: "#f7f9fc", minHeight: "100vh" }}>
            <TableContainer
                component={Paper}
                elevation={4}
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        p: 3,
                        fontWeight: 700,
                        textAlign: "center",
                        background: "linear-gradient(90deg, #0f172a 0%, #1e3a8a 100%)",
                        color: "white",
                        letterSpacing: "0.5px",
                    }}
                >
                    Player Loyalty Overview
                </Typography>

                <Table>
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: "#e8eef7",
                            }}
                        >
                            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Age</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Nationality</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Loyalty Balance</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data?.users.map((user, index) => (
                            <TableRow
                                key={user.id}
                                sx={{
                                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fbff",
                                    "&:hover": {
                                        backgroundColor: "#eaf3ff",
                                    },
                                }}
                            >
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.age}</TableCell>
                                <TableCell>{user.nationality}</TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: "1rem",
                                        color: user.loyaltypointbalance > 0 ? "#1565c0" : "#6b7280",
                                    }}
                                >
                                    {user.loyaltypointbalance}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default UserAccountListing;