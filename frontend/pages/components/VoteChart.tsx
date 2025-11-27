import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const VoteChart = ({ votes }: any) => {
  const data = {
    labels: ['A Favor', 'Contra'],
    datasets: [{
      data: [votes.for, votes.against],
      backgroundColor: ['#36A2EB', '#FF6384'],
    }],
  };

  return <Pie data={data} />;
};

export default VoteChart;