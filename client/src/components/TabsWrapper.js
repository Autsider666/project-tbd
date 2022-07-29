import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, height:'calc(100% - 48px)' }}>
          {children}
        </Box>
      )}
    </div>
  );
}


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TabsWrapper = ({ content = [], }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => setValue(newValue);

  const disableFilter = row => {
    if(row.disable !== undefined && row.disable) return false
    return true
  }

  return (
    <Box sx={{ height:"100%", width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {content.map((row, index) => (
            <Tab sx={row.tabSx} disabled={!disableFilter(row)} key={index} label={row.label} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {content.map(({ Component, props = {} }, index) => (
        <TabPanel style={{height:'100%', width:'100%'}} key={index} value={value} index={index}>
          <Component {...props} />
        </TabPanel>
      ))}

    </Box>
  );
}

export default TabsWrapper