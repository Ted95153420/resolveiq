import Button from "@mui/material/Button";
import TuneIcon from "@mui/icons-material/Tune";

type AdjustPointsButtonProps = {
    onClick: () => void;
};

function AdjustPointsButton({
    onClick,
}: AdjustPointsButtonProps) {
    return (
        <Button
            variant="outlined"
            size="small"
            startIcon={<TuneIcon />}
            onClick={onClick}
            sx={{
                fontWeight: 700,
                whiteSpace: "nowrap",
            }}
        >
            Adjust Points
        </Button>
    );
}

export default AdjustPointsButton;