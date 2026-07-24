import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import type { PlayerChoice } from "../types/playerTypes";

type PlayerSelectorProps = {
    players: PlayerChoice[];
    selectedPlayer: PlayerChoice | null;
    loading: boolean;
    onPlayerSelected: (player: PlayerChoice | null) => void;
};

function PlayerSelector({
    players,
    selectedPlayer,
    loading,
    onPlayerSelected,
}: PlayerSelectorProps) {
    return (
        <Autocomplete
            options={players}
            value={selectedPlayer}
            loading={loading}
            onChange={(_, newValue) => {
                onPlayerSelected(newValue);
            }}
            getOptionLabel={(player) =>
                `${player.name} — ${player.username}`
            }
            isOptionEqualToValue={(option, value) =>
                option.id === value.id
            }
            noOptionsText="No matching players found"
            loadingText="Loading players..."
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Select a player"
                    placeholder="Search by name or username"
                    fullWidth
                />
            )}
        />
    );
}

export default PlayerSelector;