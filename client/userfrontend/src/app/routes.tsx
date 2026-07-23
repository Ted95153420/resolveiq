import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import UserAccountListing from
    "../features/dashboard/pages/UserAccountListing";

import PlayerSimulatorPage from
    "../features/playersimulator/pages/PlayerSimulatorPage";

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/dashboard"
                element={<UserAccountListing />}
            />

            <Route
                path="/player"
                element={<PlayerSimulatorPage />}
            />

            <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
            />

            <Route
                path="*"
                element={<Navigate to="/dashboard" replace />}
            />
        </Routes>
    );
}

export default AppRoutes;