import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useState } from 'react';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <>
      {value === index
        && <Box sx={{ p: 1, height: 'calc(100% - 48px)' }}>
          {children}
        </Box>
      }
    </>
  );
}


const a11yProps = index => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
})

const TabsWrapper = ({ content = [], tabIndexValue, handleIndexChange }) => {

  const disableFilter = row => row.disable !== undefined && row.disable ? false : true

  return (
    <Box sx={{ height: "100%", width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndexValue} onChange={handleIndexChange} aria-label="basic tabs example">
          {content.map((row, index) => (
            <Tab sx={row.tabSx} disabled={!disableFilter(row)} key={index} label={row.label} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {content.map(({ Component, props = {} }, index) => (
        <TabPanel sx={{ height: '100%', width: '100%', overflow: 'hidden' }} key={index} value={tabIndexValue} index={index}>
          <Component {...props} />
        </TabPanel>
      ))}

    </Box>
  );
}

export default TabsWrapper