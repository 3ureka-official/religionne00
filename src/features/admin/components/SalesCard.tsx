import { Box, Typography, Paper } from '@mui/material';
import { ComponentType } from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

interface SalesCardProps {
  title: string;
  value: string;
  icon: ComponentType<SvgIconProps>;
}

export const SalesCard = ({ title, value, icon: Icon }: SalesCardProps) => {
  return (
    <Paper 
      sx={{ 
        p: 1.5,  // パディングを小さく
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100px'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Icon sx={{ fontSize: 18 }} />
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
        {value}
      </Typography>
    </Paper>
  );
};
