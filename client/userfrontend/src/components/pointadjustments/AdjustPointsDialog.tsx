import { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const ADJUST_POINTS = gql`
    mutation AdjustPoints($input: AdjustPointsInput!) {
        adjustPoints(input: $input) {
            transaction {
                id
                transactioncode
                points_delta
                adjustment_reason
                transaction_timestamp
            }
            user {
                id
                username
                loyaltypointbalance
            }
        }
    }
`;

type AdjustPointsDialogProps = {
    open: boolean;
    username: string | null;
    currentBalance: number | null;
    onClose: () => void;
    onPointsAdjusted: () => Promise<void> | void;
};

function AdjustPointsDialog({
    open,
    username,
    currentBalance,
    onClose,
    onPointsAdjusted,
}: AdjustPointsDialogProps) {
    const [pointsDelta, setPointsDelta] = useState("");
    const [reason, setReason] = useState("");
    const [formError, setFormError] = useState("");

    const [adjustPoints, { loading, error }] =
        useMutation(ADJUST_POINTS);

    useEffect(() => {
        if (!open) {
            setPointsDelta("");
            setReason("");
            setFormError("");
        }
    }, [open]);

    const handleSubmit = async () => {
        setFormError("");

        const parsedPointsDelta = Number(pointsDelta);

        if (!username) {
            setFormError("No user has been selected.");
            return;
        }

        if (pointsDelta.trim() === "") {
            setFormError("Adjustment amount is required.");
            return;
        }

        if (!Number.isInteger(parsedPointsDelta)) {
            setFormError(
                "Adjustment amount must be a whole number."
            );
            return;
        }

        if (parsedPointsDelta === 0) {
            setFormError(
                "Adjustment amount cannot be zero."
            );
            return;
        }

        if (reason.trim() === "") {
            setFormError("Adjustment reason is required.");
            return;
        }

        await adjustPoints({
            variables: {
                input: {
                    username,
                    pointsDelta: parsedPointsDelta,
                    reason: reason.trim(),
                },
            },
        });

        await onPointsAdjusted();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Adjust Loyalty Points
            </DialogTitle>

            <DialogContent>
                <Box
                    sx={{
                        pt: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 700,
                            }}
                        >
                            {username}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "#64748b",
                            }}
                        >
                            Current balance:{" "}
                            {currentBalance ?? 0} points
                        </Typography>
                    </Box>

                    {(formError || error) && (
                        <Alert severity="error">
                            {formError || error?.message}
                        </Alert>
                    )}

                    <TextField
                        label="Points adjustment"
                        value={pointsDelta}
                        onChange={(event) =>
                            setPointsDelta(event.target.value)
                        }
                        type="number"
                        required
                        fullWidth
                        helperText="Use a positive number to add points or a negative number to remove points."
                        slotProps={{
                            htmlInput: {
                                step: 1,
                            },
                        }}
                    />

                    <TextField
                        label="Adjustment reason"
                        value={reason}
                        onChange={(event) =>
                            setReason(event.target.value)
                        }
                        required
                        fullWidth
                        multiline
                        minRows={3}
                    />
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2,
                }}
            >
                <Button
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <CircularProgress
                            size={22}
                            color="inherit"
                        />
                    ) : (
                        "Adjust Points"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AdjustPointsDialog;