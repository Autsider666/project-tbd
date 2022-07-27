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
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TabsWrapper = ({ content = [], }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => setValue(newValue);

  const hideFilter = row => {
    if(row.hide !== undefined && row.hide) return false
    return true
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {content.filter(hideFilter).map(({ label }, index) => (
            <Tab key={index} label={label} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>
      {content.filter(hideFilter).map(({ Component, props = {} }, index) => (
        <TabPanel key={index} value={value} index={index}>
          <Component {...props} />
        </TabPanel>
      ))}

    </Box>
  );
}

export default TabsWrapper