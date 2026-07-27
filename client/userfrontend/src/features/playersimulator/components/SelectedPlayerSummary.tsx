import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";


import SelectedPlayerIdentity from "./SelectedPlayerIdentity";
import SelectedPlayerPointsTotal from "./SelectedPlayerPointsTotal";

import type { PlayerChoice } from "../types/playerTypes";

type SelectedPlayerSummaryProps = {
    player: PlayerChoice;
    pointsBalance: number;
};

function SelectedPlayerSummary({
    player,
    pointsBalance,
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
            <SelectedPlayerIdentity
                name={player.name}
                username={player.username}
            />

            <Divider sx={{ my: 3 }} />

            <SelectedPlayerPointsTotal
                pointsBalance={pointsBalance}
            />
            
        </Paper>
    );
}

export default SelectedPlayerSummary;