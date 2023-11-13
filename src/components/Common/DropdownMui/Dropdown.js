import React from 'react';
import { memo } from 'react';
import './Dropdown.scss'
import { Menu, MenuItem, Button, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styled } from '@mui/system';

const StyledButton = styled(Button)({
  textTransform: 'capitalize', // This will prevent the uppercase transformation
  color:'white',
  fontSize:'14px'
});

const ChannelDropdown = ({ title, channels, onSelect }) => {
  const handleItemClick = (item) => {
    onSelect(item);
  };

  return (
    <React.Fragment>
      <StyledButton
        aria-haspopup="true"
        onClick={(e) => e.stopPropagation()} // To prevent the dropdown from closing on button click
      >
        <Typography variant="body1" style={{ marginRight: '4px',  textTransform: 'capitalize',}}>
          {title || ''}
        </Typography>
        <ArrowDropDownIcon />
      </StyledButton>
      <Menu
        id="channel-menu"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        getContentAnchorEl={null}
      >
        {channels?.map((item, index) => (
          <MenuItem key={index} onClick={() => handleItemClick(item)}>
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
};

export default memo(ChannelDropdown);
