import { useState } from "react";
import { useQuery } from "@apollo/client/react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import DemoModeBanner from "../components/DemoModeBanner";
import PlayerSelector from "../components/PlayerSelector";
import SelectedPlayerSummary from "../components/SelectedPlayerSummary";

import { PLAYER_CHOICES_QUERY } from "../graphql/playerQueries";

import type { PlayerChoice } from "../types/playerTypes";

type PlayerChoicesData = {
    playerChoices: PlayerChoice[];
};

function PlayerSimulatorPage() {
    const [selectedPlayer, setSelectedPlayer] =
        useState<PlayerChoice | null>(null);

    const { data, loading, error } =
        useQuery<PlayerChoicesData>(
            PLAYER_CHOICES_QUERY
        );

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f7f9fc",
                p: 3,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 760,
                    mx: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
            >
                <DemoModeBanner />

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
                            fontWeight: 700,
                            color: "#1e3a8a",
                            mb: 1,
                        }}
                    >
                        Player Simulator
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "#64748b",
                            mb: 3,
                        }}
                    >
                        Choose a player account to begin the
                        customer-facing demonstration.
                    </Typography>

                    {error ? (
                        <Alert severity="error">
                            Unable to load players:{" "}
                            {error.message}
                        </Alert>
                    ) : (
                        <PlayerSelector
                            players={
                                data?.playerChoices ?? []
                            }
                            selectedPlayer={
                                selectedPlayer
                            }
                            loading={loading}
                            onPlayerSelected={
                                setSelectedPlayer
                            }
                        />
                    )}
                </Paper>

                {selectedPlayer && (
                    <SelectedPlayerSummary
                        player={selectedPlayer}
                    />
                )}
            </Box>
        </Box>
    );
}

export default PlayerSimulatorPage;