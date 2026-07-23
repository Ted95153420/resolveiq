import { useState } from "react";
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
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

const CREATE_USER_MUTATION = gql`
    mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
            id
            name
            username
            age
            nationality
            loyaltypointbalance
        }
    }
`;

type CreatedUser = {
    id: number;
    name: string;
    username: string;
    age: number;
    nationality: string;
    loyaltypointbalance: number;
};

type CreateUserMutationData = {
    createUser: CreatedUser;
};

type CreateUserMutationVariables = {
    input: {
        name: string;
        username: string;
        age: number;
        nationality: string;
    };
};

type CreateUserDialogProps = {
    open: boolean;
    onClose: () => void;
    onUserCreated: () => void | Promise<void>;
};

const nationalities = [
    "AUSTRALIA",
    "CANADA",
    "DENMARK",
    "FRANCE",
    "GERMANY",
    "IRELAND",
    "NETHERLANDS",
    "NEW_ZEALAND",
    "NORWAY",
    "SWEDEN",
    "UNITED_KINGDOM",
    "UNITED_STATES",
];

function CreateUserDialog({
    open,
    onClose,
    onUserCreated,
}: CreateUserDialogProps) {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [age, setAge] = useState("");
    const [nationality, setNationality] = useState("CANADA");
    const [formError, setFormError] = useState<string | null>(null);

    const [createUser, { loading }] = useMutation<
        CreateUserMutationData,
        CreateUserMutationVariables
    >(CREATE_USER_MUTATION);

    function resetForm() {
        setName("");
        setUsername("");
        setAge("");
        setNationality("CANADA");
        setFormError(null);
    }

    function handleClose() {
        if (loading) {
            return;
        }

        resetForm();
        onClose();
    }

    async function handleSubmit() {
        setFormError(null);

        const trimmedName = name.trim();
        const trimmedUsername = username.trim();
        const numericAge = Number(age);

        if (!trimmedName) {
            setFormError("Please enter the user's name.");
            return;
        }

        if (!trimmedUsername) {
            setFormError("Please enter a username.");
            return;
        }

        if (!Number.isInteger(numericAge) || numericAge <= 0) {
            setFormError("Please enter a valid whole-number age.");
            return;
        }

        try {
            await createUser({
                variables: {
                    input: {
                        name: trimmedName,
                        username: trimmedUsername,
                        age: numericAge,
                        nationality,
                    },
                },
            });

            await onUserCreated();
            resetForm();
            onClose();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "The user could not be created.";

            setFormError(message);
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        overflow: "hidden",
                    },
                },
            }}
            
        >
            <DialogTitle
                sx={{
                    px: 3,
                    py: 2.5,
                    background:
                        "linear-gradient(90deg, #0f172a 0%, #1e3a8a 100%)",
                    color: "white",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <PersonAddAlt1Icon />

                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Create Loyalty User
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.75)" }}
                        >
                            Add a new user to the loyalty platform.
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent
                sx={{
                    px: 3,
                    pb: 3,
                    overflow: "visible",
                }}
            >
            {formError && (
                <Alert severity="error" sx={{ mt: 2.5, mb: 2 }}>
                    {formError}
                </Alert>
            )}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                    },
                    columnGap: 2,
                    rowGap: 2.5,
                    mt: formError ? 0 : 3,
                }}
            >
                <TextField
                    label="Full name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoFocus
                    required
                    fullWidth
                />

                <TextField
                    label="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                    fullWidth
                    helperText="Must be unique"
                />

                <TextField
                    label="Age"
                    value={age}
                    onChange={(event) => setAge(event.target.value)}
                    type="number"
                    required
                    fullWidth
                    slotProps={{
                        htmlInput: {
                            min: 1,
                            step: 1,
                        },
                    }}
                />

                <TextField
                    select
                    label="Nationality"
                    value={nationality}
                    onChange={(event) => setNationality(event.target.value)}
                    fullWidth
                >
                    {nationalities.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option.replaceAll("_", " ")}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

                <Box
                    sx={{
                        mt: 3,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#f1f5f9",
                        border: "1px solid #e2e8f0",
                    }}
                >
                    <Typography variant="body2" sx={{ color: "#475569" }}>
                        New users begin with a loyalty balance of{" "}
                        <strong>0 points</strong>. Their balance will change as
                        qualifying transactions are processed.
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    borderTop: "1px solid #e2e8f0",
                }}
            >
                <Button onClick={handleClose} disabled={loading}>
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={
                        loading ? (
                            <CircularProgress size={18} color="inherit" />
                        ) : (
                            <PersonAddAlt1Icon />
                        )
                    }
                    sx={{
                        minWidth: 140,
                        fontWeight: 700,
                    }}
                >
                    {loading ? "Creating..." : "Create User"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateUserDialog;