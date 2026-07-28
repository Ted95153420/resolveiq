import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import PlayerSelector from "./PlayerSelector";

import type {
    PlayerChoice,
} from "../types/playerTypes";

type PlayerSelectionPanelProps = {
    players: PlayerChoice[];
    selectedPlayer: PlayerChoice | null;
    loading: boolean;
    onPlayerSelected: (
        player: PlayerChoice | null
    ) => void;
};

function PlayerSelectionPanel({
    players,
    selectedPlayer,
    loading,
    onPlayerSelected,
}: PlayerSelectionPanelProps) {
    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                borderRadius: 3,
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    mb: 1,
                    color: "#1e3a8a",
                    fontWeight: 700,
                }}
            >
                Player Simulator
            </Typography>

            <Typography
                variant="body2"
                sx={{
                    mb: 3,
                    color: "#64748b",
                }}
            >
                Choose a player account to begin the
                customer-facing demonstration.
            </Typography>

            <PlayerSelector
                players={players}
                selectedPlayer={selectedPlayer}
                loading={loading}
                onPlayerSelected={onPlayerSelected}
            />
        </Paper>
    );
}

export default PlayerSelectionPanel;