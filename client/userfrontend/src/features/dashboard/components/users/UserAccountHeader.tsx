import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

type UserAccountHeaderProps = {
    onCreateUser: () => void;
};

function UserAccountHeader({
    onCreateUser,
}: UserAccountHeaderProps) {
    return (
        <Box
            sx={{
                position: "relative",
                px: 3,
                py: 3,
                background:
                    "linear-gradient(90deg, #0f172a 0%, #1e3a8a 100%)",
                color: "white",
                display: "flex",
                flexDirection: {
                    xs: "column",
                    md: "row",
                },
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
            }}
        >
            <Box sx={{ textAlign: "center" }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: "white",
                        letterSpacing: "0.5px",
                    }}
                >
                    Player Loyalty Overview
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        mt: 0.5,
                        color: "rgba(255, 255, 255, 0.72)",
                    }}
                >
                    Manage users, balances and recent activity.
                </Typography>
            </Box>

            <Button
                variant="contained"
                startIcon={<PersonAddAlt1Icon />}
                onClick={onCreateUser}
                sx={{
                    position: {
                        xs: "static",
                        md: "absolute",
                    },
                    right: {
                        md: 24,
                    },
                    backgroundColor: "white",
                    color: "#1e3a8a",
                    fontWeight: 700,
                    "&:hover": {
                        backgroundColor: "#eff6ff",
                    },
                }}
            >
                Create User
            </Button>
        </Box>
    );
}

export default UserAccountHeader;