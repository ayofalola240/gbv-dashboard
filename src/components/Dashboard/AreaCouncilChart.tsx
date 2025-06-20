import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const AreaCouncilChart = ({ data }: { data: { name: string; value: number }[] }) => {
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: 'Incidents by Area Council',
        data: data.map((item) => item.value),
        // --- MODIFIED: New color palette for consistency ---
        backgroundColor: [
          'rgba(0, 135, 81, 0.7)', // Primary Green
          'rgba(0, 87, 46, 0.7)', // Darker Green
          'rgba(75, 192, 192, 0.7)', // Teal
          'rgba(69, 178, 157, 0.7)', // Muted Teal
          'rgba(163, 193, 173, 0.7)', // Soft Grey-Green
          'rgba(127, 220, 198, 0.7)' // Aqua Highlight
        ],
        borderColor: [
          'rgba(0, 135, 81, 1)',
          'rgba(0, 87, 46, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(69, 178, 157, 1)',
          'rgba(163, 193, 173, 1)',
          'rgba(127, 220, 198, 1)'
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
        position: 'right' as const,
        labels: {
          color: '#333333'
        }
      },
      title: {
        display: true,
        text: 'Incidents by Area Council', // MODIFIED: Changed title for clarity
        color: '#008751',
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
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg h-[350px] sm:h-[400px]">
      <Doughnut options={options} data={chartData} />
    </div>
  );
};

export default AreaCouncilChart;
