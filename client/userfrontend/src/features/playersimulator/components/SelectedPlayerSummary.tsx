import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import type { PlayerChoice } from "../types/playerTypes";

type SelectedPlayerSummaryProps = {
    player: PlayerChoice;
};

function SelectedPlayerSummary({
    player,
}: SelectedPlayerSummaryProps) {
    return (
        <Paper
            elevation={1}
            sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid #dbe7f3",
            }}
        >
            <Typography
                variant="overline"
                sx={{
                    color: "#64748b",
                }}
            >
                Currently viewing as
            </Typography>

            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                }}
            >
                {player.name}
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    color: "#64748b",
                }}
            >
                Username: {player.username}
            </Typography>
        </Paper>
    );
}

export default SelectedPlayerSummary;