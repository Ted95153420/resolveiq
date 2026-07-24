import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

function DemoModeBanner() {
    return (
        <Alert
            severity="info"
            sx={{
                width: "100%",
                borderRadius: 2,
            }}
        >
            <AlertTitle sx={{ fontWeight: 700 }}>
                You are in Demo Mode
            </AlertTitle>

            Select a player below to view ResolveIQ from the player&apos;s
            perspective.
        </Alert>
    );
}

export default DemoModeBanner;