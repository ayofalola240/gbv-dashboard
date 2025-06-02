import React from 'react';
import { Doughnut } from 'react-chartjs-2'; // Using Doughnut for a slightly different look than Pie
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const StatusOverviewChart = ({ data }) => {
  // data will be stats.incidentStatusOverview
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: 'Incident Statuses',
        data: data.map((item) => item.value),
        backgroundColor: [
          'rgba(0, 135, 81, 0.7)', // Primary Green
          'rgba(0, 87, 46, 0.7)', // Dark Green
          'rgba(208, 240, 224, 0.8)', // Light Green
          'rgba(128, 128, 128, 0.7)', // A neutral Grey
          'rgba(224, 224, 224, 0.7)' // Lighter Grey
          // Add more colors if you have more statuses
        ],
        borderColor: [
          // Optional: borders for slices
          'rgba(0, 135, 81, 1)',
          'rgba(0, 87, 46, 1)',
          'rgba(208, 240, 224, 1)',
          'rgba(128, 128, 128, 1)',
          'rgba(224, 224, 224, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right', // Position legend to the right for doughnut/pie
        labels: {
          color: '#333333' // var(--text-dark)
        }
      },
      title: {
        display: true,
        text: 'Incident Status Overview',
        color: '#008751', // var(--primary-green)
        font: {
          size: 16
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff'
      }
    }
  };

  return (
    <div className="bg-primary-white p-4 sm:p-6 rounded-lg shadow-lg h-[350px] sm:h-[400px]">
      {' '}
      {/* Added height */}
      <Doughnut options={options} data={chartData} />
    </div>
  );
};

export default StatusOverviewChart;
