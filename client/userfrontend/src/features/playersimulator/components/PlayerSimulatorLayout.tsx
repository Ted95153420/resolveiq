import type {
    PropsWithChildren,
} from "react";

import Box from "@mui/material/Box";

function PlayerSimulatorLayout({
    children,
}: PropsWithChildren) {
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
                {children}
            </Box>
        </Box>
    );
}

export default PlayerSimulatorLayout;