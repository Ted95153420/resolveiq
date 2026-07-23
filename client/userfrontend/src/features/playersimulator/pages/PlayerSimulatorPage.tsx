import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

function PlayerSimulatorPage() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f7f9fc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: "100%",
                    maxWidth: 500,
                    p: 4,
                    borderRadius: 3,
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: "#1e3a8a",
                    }}
                >
                    Player Simulator
                </Typography>

                <Typography
                    sx={{
                        mt: 2,
                        color: "#64748b",
                    }}
                >
                    Hello world — the player experience will appear here.
                </Typography>
            </Paper>
        </Box>
    );
}

export default PlayerSimulatorPage;