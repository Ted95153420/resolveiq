import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

import {
    formatCurrency,
    formatDate,
    formatPointsDelta,
} from "./transactionFormatters";

import type { Transaction } from "./transactionTypes";

type TransactionListItemProps = {
    transaction: Transaction;
    alternateBackground: boolean;
    showDivider: boolean;
};

function TransactionListItem({
    transaction,
    alternateBackground,
    showDivider,
}: TransactionListItemProps) {

    const isAdjustment =
        transaction.transactioncode === "ADJ";

    return (
        <Box key={transaction.id}>
            <ListItem
                sx={{
                    px: 2,
                    py: 1.5,
                    display: "block",
                    backgroundColor: alternateBackground
                        ? "#f8fbff"
                        : "#ffffff",
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

            {showDivider && <Divider />}
        </Box>
    );
}

export default TransactionListItem;