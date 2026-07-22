import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

type Transaction = {
    id: string;
    transactioncode: "TRAN" | "ADJ";
    gametype: string | null;
    amountwagered: number | null;
    points_delta: number;
    adjustment_reason: string | null;
    transaction_timestamp: string;
};

type UserTransactionListingProps = {
    transactions: Transaction[];
};

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
    }).format(amount);
}

function formatDate(timestamp: string) {
    return new Date(timestamp).toLocaleString("en-CA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatPointsDelta(pointsDelta: number) {
    return pointsDelta > 0
        ? `+${pointsDelta} points`
        : `${pointsDelta} points`;
}

function UserTransactionListing({ transactions }: UserTransactionListingProps) {
    if (!transactions || transactions.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    m: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#f8fbff",
                    border: "1px solid #dbe7f3",
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Recent Transactions
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                    No transactions found for this player yet.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                m: 2,
                borderRadius: 2,
                backgroundColor: "#f8fbff",
                border: "1px solid #dbe7f3",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    background: "linear-gradient(90deg, #eff6ff 0%, #f8fbff 100%)",
                    borderBottom: "1px solid #dbe7f3",
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e3a8a" }}>
                    Recent Transactions
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Latest {transactions.length} activity for this player
                </Typography>
            </Box>

            <List disablePadding>
                {transactions.map((transaction, index) => {
                    const isAdjustment =
                        transaction.transactioncode === "ADJ";

                    return (
                        <Box key={transaction.id}>
                            <ListItem
                                sx={{
                                    px: 2,
                                    py: 1.5,
                                    display: "block",
                                    backgroundColor:
                                        index % 2 === 0
                                            ? "#ffffff"
                                            : "#f8fbff",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: {
                                            xs: "column",
                                            md: "row",
                                        },
                                        justifyContent: "space-between",
                                        alignItems: {
                                            xs: "flex-start",
                                            md: "center",
                                        },
                                        gap: 2,
                                    }}
                                >
                                    <Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                flexWrap: "wrap",
                                                gap: 1,
                                                mb: 0.5,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight: 700,
                                                    color: "#0f172a",
                                                }}
                                            >
                                                {isAdjustment
                                                    ? "Points Adjustment"
                                                    : transaction.gametype}
                                            </Typography>

                                            <Chip
                                                label={
                                                    transaction.transactioncode
                                                }
                                                size="small"
                                                sx={{
                                                    backgroundColor:
                                                        isAdjustment
                                                            ? "#fff3e0"
                                                            : "#e8eef7",
                                                    color: isAdjustment
                                                        ? "#b45309"
                                                        : "#334155",
                                                    fontWeight: 700,
                                                }}
                                            />

                                            <Chip
                                                label={`Txn ${transaction.id}`}
                                                size="small"
                                                sx={{
                                                    backgroundColor: "#e8eef7",
                                                    color: "#334155",
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </Box>

                                        {isAdjustment &&
                                            transaction.adjustment_reason && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "#334155",
                                                        mb: 0.5,
                                                    }}
                                                >
                                                    {
                                                        transaction.adjustment_reason
                                                    }
                                                </Typography>
                                            )}

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#64748b",
                                            }}
                                        >
                                            {formatDate(
                                                transaction.transaction_timestamp
                                            )}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            textAlign: {
                                                xs: "left",
                                                md: "right",
                                            },
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {isAdjustment ? (
                                            <Typography
                                                sx={{
                                                    fontWeight: 800,
                                                    fontSize: "1rem",
                                                    color:
                                                        transaction.points_delta >
                                                            0
                                                            ? "#1565c0"
                                                            : "#c62828",
                                                }}
                                            >
                                                {formatPointsDelta(
                                                    transaction.points_delta
                                                )}
                                            </Typography>
                                        ) : (
                                            transaction.amountwagered !==
                                            null && (
                                                <Typography
                                                    sx={{
                                                        fontWeight: 800,
                                                        fontSize: "1rem",
                                                        color: "#1565c0",
                                                    }}
                                                >
                                                    {formatCurrency(
                                                        transaction.amountwagered
                                                    )}
                                                </Typography>
                                            )
                                        )}
                                    </Box>
                                </Box>
                            </ListItem>

                            {index < transactions.length - 1 && (
                                <Divider />
                            )}
                        </Box>
                    );
                })}   
            </List>
        </Paper>
    );
}

export default UserTransactionListing;