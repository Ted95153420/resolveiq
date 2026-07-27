import Typography from "@mui/material/Typography";

type SelectedPlayerIdentityProps = {
    name: string;
    username: string;
};

function SelectedPlayerIdentity({
    name,
    username,
}: SelectedPlayerIdentityProps) {
    return (
        <Typography
            variant="h5"
            sx={{
                fontWeight: 700,
                color: "#0f172a",
            }}
        >
            Currently Viewing as {name} (
            Username : {username})
        </Typography>
    );
}

export default SelectedPlayerIdentity;