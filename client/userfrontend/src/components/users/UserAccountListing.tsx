import { Fragment, useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { Transaction } from "../transactions/transactionTypes";
import AdjustPointsButton from "../pointadjustments/AdjustPointsButton";
import AdjustPointsDialog from "../pointadjustments/AdjustPointsDialog";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import CreateUserDialog from "./CreateUserDialog";
import { ExpandButton } from "./ExpandButton";
import UserTransactionListing from "../transactions/UserTransactionListing";
import UserAccountHeader from "./UserAccountHeader";


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
    const [adjustmentUser, setAdjustmentUser] = useState<User | null>(null);

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
                <UserAccountHeader
                    onCreateUser={() => setCreateDialogOpen(true)}
                />

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
                            <TableCell
                                align="right"
                                sx={{
                                    fontWeight: 700,
                                    pr: 3,
                                }}
                            >
                                Actions
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
                                        <TableCell
                                            align="right"
                                            sx={{
                                                pr: 3,
                                            }}
                                        >
                                            <AdjustPointsButton
                                                onClick={() => setAdjustmentUser(user)}
                                            />
                                        </TableCell>
                                    </TableRow>

                                    {isOpen && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
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

            <AdjustPointsDialog
                open={adjustmentUser !== null}
                username={adjustmentUser?.username ?? null}
                currentBalance={
                    adjustmentUser?.loyaltypointbalance ?? null
                }
                onClose={() => setAdjustmentUser(null)}
                onPointsAdjusted={async () => {
                    await refetch();
                }}
            />
        </Box>
    );
}

export default UserAccountListing;