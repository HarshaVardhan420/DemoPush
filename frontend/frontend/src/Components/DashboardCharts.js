import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardChart = () => {
  const [data, setData] = useState({ workers: 0, supervisors: 0 });

  useEffect(() => {
    axios.get('http://localhost:5000/api/stats/counts')
      .then(res => setData(res.data))
      .catch(err => console.error('Error loading stats', err));
  }, []);

  const chartData = {
    labels: ['Supervisors', 'Workers'],
    datasets: [{
      label: 'Registration Count',
      data: [data.supervisors, data.workers],
      backgroundColor: ['#36A2EB', '#FF6384'],
    }]
  };

  return (
    <div style={{ width: '500px', margin: 'auto' }}>
      <h3>User Stats</h3>
      <Bar data={chartData} />
    </div>
  );
};

export default DashboardChart;
