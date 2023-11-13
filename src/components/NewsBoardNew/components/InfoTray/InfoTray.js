import { Box, Grid, Paper, Typography } from '@mui/material';
import React from 'react';

const InfoTray = () => {
  const totalItems = 4;
  const itemsPerRow = 4; // Adjust this number based on your design

  const getGridSize = () => {
    const totalCols = 12; // Total columns in a row
    return Math.floor(totalCols / itemsPerRow);
  };
  return (
    <Grid
      container
      spacing={1}
      sx={{
        background: '#303030',
        height: '33px',
      }}
      p={0}
    >
      {[...Array(totalItems)].map((_, index) => (
        <Grid
          key={index}
          item
          xs={getGridSize()}
          sm={getGridSize()}
          md={getGridSize()}
          lg={getGridSize()}
          xl={getGridSize()}
          mb={2}
        >
          {/* Your content for each grid item */}
          <Box style={{ display: 'flex', justifyContent: 'space-between' , alignItems:'center'}}         
 >
            <Typography>Twitter Trends-Pakistan</Typography>
            <Typography sx={{
                color:'#999999',
                fontSize:'12px'
            }}>Updated 21 mins. ago </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default InfoTray;
