import Typography from "@mui/material/Typography";

type SelectedPlayerPointsTotalProps = {
    pointsBalance: number;
};

function SelectedPlayerPointsTotal({
    pointsBalance,
}: SelectedPlayerPointsTotalProps) {
    return (
        <Typography
            variant="h5"
            sx={{
                fontWeight: 400,
                color: "#0f172a",
            }}
        >
            Welcome! Your current points balance is{" "}
            <strong>{pointsBalance.toLocaleString("en-CA")} points!</strong>
        </Typography>
    );
}

export default SelectedPlayerPointsTotal;