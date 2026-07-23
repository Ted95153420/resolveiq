import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type ExpandButtonProps = {
    isOpen: boolean;
    toggle: () => void;
};

export const ExpandButton = ({ isOpen, toggle } : ExpandButtonProps) => {
    return (
        <IconButton
            onClick={toggle}
            size="small"
            aria-label={isOpen ? "Collapse row" : "Expand row"}
            sx={{
                transition: "transform 0.25s",
                transform: `rotate(${isOpen ? 180 : 0}deg)`,
            }}
        >
            <ExpandMoreIcon />
        </IconButton>
    );
};