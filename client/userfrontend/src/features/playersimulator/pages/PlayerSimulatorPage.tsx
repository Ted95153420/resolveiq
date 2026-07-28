import DemoModeBanner from "../components/DemoModeBanner";
import PlayerSelectionPanel from "../components/PlayerSelectionPanel";
import PlayerSimulatorErrors from "../components/PlayerSimulatorErrors";
import PlayerSimulatorLayout from "../components/PlayerSimulatorLayout";
import SelectedPlayerSummary from "../components/SelectedPlayerSummary";

import {
    usePlayerSimulator,
} from "../hooks/usePlayerSimulator";

function PlayerSimulatorPage() {
    const {
        players,
        selectedPlayer,
        pointsBalance,
        loadingPlayers,
        playerQueryError,
        subscriptionError,
        selectPlayer,
    } = usePlayerSimulator();

    return (
        <PlayerSimulatorLayout>
            <DemoModeBanner />

            <PlayerSimulatorErrors
                playerQueryError={playerQueryError}
                subscriptionError={subscriptionError}
            />

            <PlayerSelectionPanel
                players={players}
                selectedPlayer={selectedPlayer}
                loading={loadingPlayers}
                onPlayerSelected={selectPlayer}
            />

            {selectedPlayer &&
                pointsBalance !== undefined && (
                    <SelectedPlayerSummary
                        player={selectedPlayer}
                        pointsBalance={pointsBalance}
                    />
                )}
        </PlayerSimulatorLayout>
    );
}

export default PlayerSimulatorPage;