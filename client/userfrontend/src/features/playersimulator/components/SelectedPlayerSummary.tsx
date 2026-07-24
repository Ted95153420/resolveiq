import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import SelectedPlayerPointsTotal from "./SelectedPlayerPointsTotal";

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
                variant="h5"
                sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                }}
            >
                Currently Viewing as {player.name} (
                Username : {player.username})
            </Typography>

            <Divider
                sx={{
                    my: 3,
                }}
            />

            <SelectedPlayerPointsTotal
                pointsBalance={player.loyaltypointbalance}
            />
            
        </Paper>
    );
}

export default SelectedPlayerSummary;