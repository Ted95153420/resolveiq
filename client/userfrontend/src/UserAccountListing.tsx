import { Fragment, useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { Transaction } from "./components/transactions/transactionTypes";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

import CreateUserDialog from "./CreateUserDialog";
import { ExpandButton } from "./ExpandButton";
import UserTransactionListing from "./components/transactions/UserTransactionListing";

const QUERY_ALL_USERS = gql`
    query GetAllUsers {
        users {
            id
            name
            age
            nationality
            username
            loyaltypointbalance
            transactions {
                id
                transactioncode
                gametype
                amountwagered
                points_delta
                adjustment_reason
                transaction_timestamp
            }
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
    transactions: Transaction[];
};

type GetAllUsersData = {
    users: User[];
};

function UserAccountListing() {
    const [openUserId, setOpenUserId] = useState<number | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const { data, loading, error, refetch } = useQuery<GetAllUsersData>(
        QUERY_ALL_USERS,
        {
            pollInterval: 3000,
            notifyOnNetworkStatusChange: true,
        }
    );

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

    if (error) {
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
                <Typography color="error">
                    Error loading users : {error.message}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                p: 3,
                backgroundColor: "#f7f9fc",
                minHeight: "100vh",
            }}
        >
            <TableContainer
                component={Paper}
                elevation={4}
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        px: 3,
                        py: 3,
                        background:
                            "linear-gradient(90deg, #0f172a 0%, #1e3a8a 100%)",
                        color: "white",
                        display: "flex",
                        flexDirection: {
                            xs: "column",
                            md: "row",
                        },
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                    }}
                >
                    <Box sx={{ textAlign: "center" }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color: "white",
                                letterSpacing: "0.5px",
                            }}
                        >
                            Player Loyalty Overview
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mt: 0.5,
                                color: "rgba(255, 255, 255, 0.72)",
                            }}
                        >
                            Manage users, balances and recent activity.
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<PersonAddAlt1Icon />}
                        onClick={() => setCreateDialogOpen(true)}
                        sx={{
                            position: {
                                xs: "static",
                                md: "absolute",
                            },
                            right: {
                                md: 24,
                            },
                            backgroundColor: "white",
                            color: "#1e3a8a",
                            fontWeight: 700,
                            "&:hover": {
                                backgroundColor: "#eff6ff",
                            },
                        }}
                    >
                        Create User
                    </Button>
                </Box>

                <Table>
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: "#e8eef7",
                            }}
                        >
                            <TableCell sx={{ width: "56px" }} />
                            <TableCell sx={{ fontWeight: 700 }}>
                                Name
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Username
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Age
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Nationality
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                                Loyalty Balance
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data?.users.map((user, index) => {
                            const isOpen = openUserId === user.id;

                            return (
                                <Fragment key={user.id}>
                                    <TableRow
                                        sx={{
                                            backgroundColor:
                                                index % 2 === 0
                                                    ? "#ffffff"
                                                    : "#f8fbff",
                                            "&:hover": {
                                                backgroundColor: "#eaf3ff",
                                            },
                                        }}
                                    >
                                        <TableCell sx={{ width: "56px" }}>
                                            <ExpandButton
                                                isOpen={isOpen}
                                                toggle={() =>
                                                    setOpenUserId(
                                                        isOpen
                                                            ? null
                                                            : user.id
                                                    )
                                                }
                                            />
                                        </TableCell>

                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.age}</TableCell>
                                        <TableCell>
                                            {user.nationality}
                                        </TableCell>

                                        <TableCell
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: "1rem",
                                                color:
                                                    user.loyaltypointbalance > 0
                                                        ? "#1565c0"
                                                        : "#6b7280",
                                            }}
                                        >
                                            {user.loyaltypointbalance}
                                        </TableCell>
                                    </TableRow>

                                    {isOpen && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                sx={{
                                                    p: 0,
                                                    backgroundColor: "#f8fbff",
                                                }}
                                            >
                                                <UserTransactionListing
                                                    transactions={
                                                        user.transactions
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <CreateUserDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onUserCreated={async () => {
                    await refetch();
                }}
            />
        </Box>
    );
}

export default UserAccountListing;