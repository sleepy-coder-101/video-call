import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Menu, MenuItem, Box } from "@mui/material";

const DropdownEl = ({ array, attribute, onItemChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleData = (arr) => {
    onItemChange(arr.deviceId);
    setAnchorEl(null);
  };

  return (
    <Box sx={{ py: "0.2rem" }}>
      <Button
        variant="outlined"
        onClick={handleClick}
        sx={{ minWidth: { md: "9rem" }, textTransform: "none" }}
      >
        {attribute}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {array.map((arr, index) => (
          <MenuItem key={index} onClick={() => handleData(arr)}>
            {arr.label || arr.deviceId}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

DropdownEl.propTypes = {
  array: PropTypes.array.isRequired,
  attribute: PropTypes.string.isRequired,
  onItemChange: PropTypes.func.isRequired,
};

export default DropdownEl;
