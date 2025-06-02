import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ViolenceTypeChart = ({ data }) => {
  // data will be stats.incidentsByViolenceType
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: 'Incidents by Violence Type',
        data: data.map((item) => item.value),
        backgroundColor: 'rgba(0, 135, 81, 0.6)', // var(--primary-green) with opacity
        borderColor: 'rgba(0, 135, 81, 1)', // var(--primary-green)
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#333333' // var(--text-dark)
        }
      },
      title: {
        display: true,
        text: 'Incidents by Violence Type',
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
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#333333', // var(--text-dark)
          stepSize: 1 // Adjust as needed, or remove for auto-stepping
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)' // Lighter grid lines
        }
      },
      x: {
        ticks: {
          color: '#333333' // var(--text-dark)
        },
        grid: {
          display: false // Hide vertical grid lines if desired
        }
      }
    }
  };

  return (
    <div className="bg-primary-white p-4 sm:p-6 rounded-lg shadow-lg h-[350px] sm:h-[400px]">
      {' '}
      {/* Added height */}
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default ViolenceTypeChart;
