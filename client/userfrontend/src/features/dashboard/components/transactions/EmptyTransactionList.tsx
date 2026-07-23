import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

function EmptyTransactionList() {
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
            <Typography
                variant="subtitle1"
                sx={{
                    fontWeight: 700,
                    mb: 0.5,
                }}
            >
                Recent Transactions
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    color: "#64748b",
                }}
            >
                No transactions found for this player yet.
            </Typography>
        </Paper>
    );
}

export default EmptyTransactionList;