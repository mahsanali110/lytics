import { Box, Grid } from '@mui/material'
import React from 'react'
import { memo } from 'react'

import './NewsBoardNew.scss';


function NewsBoardNew() {
  return (
    // <Box>NewsBoardNew</Box>
    <Grid container>
      <Grid className='test' item xs={12} lg={3}>sdfdsgf</Grid>
      <Grid item xs={12} lg={3}></Grid>
      <Grid item xs={12} lg={3}></Grid>
      <Grid item xs={12} lg={3}></Grid>
    </Grid>
  )
}

export default memo(NewsBoardNew)