import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TransactionListItem from "./TransactionListItem";
import type { Transaction } from "./transactionTypes";


type UserTransactionListingProps = {
    transactions: Transaction[];
};



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
                {transactions.map((transaction, index) => (
                    <TransactionListItem
                        key={transaction.id}
                        transaction={transaction}
                        showDivider={index < transactions.length - 1}
                        alternateBackground={index % 2 !== 0}
                    />
                ))}   
            </List>
        </Paper>
    );
}

export default UserTransactionListing;