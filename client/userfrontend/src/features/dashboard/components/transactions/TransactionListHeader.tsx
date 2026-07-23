import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type TransactionListHeaderProps = {
    transactionCount: number;
};

function TransactionListHeader({
    transactionCount,
}: TransactionListHeaderProps) {
    return (
        <Box
            sx={{
                px: 2,
                py: 1.5,
                background:
                    "linear-gradient(90deg, #eff6ff 0%, #f8fbff 100%)",
                borderBottom: "1px solid #dbe7f3",
            }}
        >
            <Typography
                variant="subtitle1"
                sx={{
                    fontWeight: 700,
                    color: "#1e3a8a",
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
                Latest {transactionCount}{" "}
                {transactionCount === 1 ? "activity" : "activities"} for this
                player
            </Typography>
        </Box>
    );
}

export default TransactionListHeader;