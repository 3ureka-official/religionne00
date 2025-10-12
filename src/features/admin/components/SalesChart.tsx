import { Box, Typography, Paper, Switch, FormControlLabel } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

interface HeaderStat {
  label: string;
  value: string;
}

interface SalesChartProps {
  title: string;
  data: number[];
  labels: string[];
  yAxisTitle: string;
  color: string;
  headerStats?: HeaderStat[];
  showShippingToggle?: boolean;
  includeShipping?: boolean;
  onShippingToggle?: (value: boolean) => void;
  secondaryData?: {
    label: string;
    data: number[];
    color: string;
  };
}

export const SalesChart = ({ 
  title, 
  data, 
  labels, 
  yAxisTitle, 
  color,
  headerStats,
  showShippingToggle,
  includeShipping,
  onShippingToggle,
  secondaryData
}: SalesChartProps) => {
  const datasets = [
    {
      label: title,
      data: data,
      borderColor: color,
      backgroundColor: color.replace('0.6', '0.1'),
      tension: 0.4,
    }
  ];

  if (secondaryData) {
    datasets.push({
      label: secondaryData.label,
      data: secondaryData.data,
      borderColor: secondaryData.color,
      backgroundColor: secondaryData.color.replace('0.6', '0.1'),
      tension: 0.4,
    });
  }

  const chartData = {
    labels,
    datasets
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: !!secondaryData,
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yAxisTitle
        }
      }
    }
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        {showShippingToggle && (
          <FormControlLabel
            control={
              <Switch
                checked={includeShipping}
                onChange={(e) => onShippingToggle?.(e.target.checked)}
                size="small"
              />
            }
            label="送料込み"
          />
        )}
      </Box>
      
      {headerStats && headerStats.length > 0 && (
        <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
          {headerStats.map((stat, index) => (
            <Box key={index}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                {stat.label}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {stat.value}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      
      <Box sx={{ height: 300 }}>
        <Line data={chartData} options={chartOptions} />
      </Box>
    </Paper>
  );
};