import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

type ErrorLike = {
    message: string;
};

type PlayerSimulatorErrorsProps = {
    playerQueryError?: ErrorLike;
    subscriptionError?: ErrorLike;
};

function PlayerSimulatorErrors({
    playerQueryError,
    subscriptionError,
}: PlayerSimulatorErrorsProps) {
    if (!playerQueryError && !subscriptionError) {
        return null;
    }

    return (
        <Stack spacing={2}>
            {playerQueryError && (
                <Alert severity="error">
                    Unable to load players:{" "}
                    {playerQueryError.message}
                </Alert>
            )}

            {subscriptionError && (
                <Alert severity="error">
                    Live balance updates are unavailable:{" "}
                    {subscriptionError.message}
                </Alert>
            )}
        </Stack>
    );
}

export default PlayerSimulatorErrors;