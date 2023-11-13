import { Box, Typography } from '@mui/material';
import Dropdown from 'components/Common/DropdownMui/Dropdown';
import React, { memo } from 'react'
import FilterListIcon from '@mui/icons-material/FilterList';

const ListingHeaderContent = ({  isTv, graph }) => {
    const channels = ['Geo']; // Replace with your default value
    const channel = { name: 'test' }; // Replace with your default value
    const onChannelChange = () => {}; // Replace with your default function
    const programInfo = { channel: 'test' }; // Replace with your default value
    const handleTabChange = () => {}; // Replace with your default function
    const activeTab = ''; // Replace with your default value
    const classes = {}; // Replace with your default value
  
    const TV = 'TV'; // Assuming 'TV' is defined
  
    return (
      <Box
        className={classes.header}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {isTv ? (
          <Dropdown
            channels={channels}
            title={'Top Trending Topics'}
            onSelect={onChannelChange}
            color="white"
          />
        ) : (
          <Typography
            className={classes.previewChannelName}
            sx={{
              background: '#EF233C',
              borderRadius: '8px 8px 0 0',
              width: '130px',
              height: '30px',
              textAlign: 'center',
            }}
          >
            Video Preview
          </Typography>
        )}
        <Box display={'flex'}>
          {graph && (
            <Typography
              className={classes.previewChannelName}
              sx={{
                background: '#EF233C',
                borderRadius: '3px 0 0 3px',
                width: '52px',
                height: '17px',
                textAlign: 'center',
                fontSize: '12px',
              }}
            >
              Graph
            </Typography>
          )}
        <FilterListIcon fontSize='small'/>
        </Box>
      </Box>
    );
}

export default memo(ListingHeaderContent)