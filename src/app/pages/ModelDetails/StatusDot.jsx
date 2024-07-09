import React from 'react';

const StatusDot = ({ status }) => {
  let colorClass = '';
  let textClass = '';
  let title = '';

  switch (status.toLowerCase()) {
    case 'active':
      colorClass = 'dot-green';
      textClass = 'text-green';
      title = 'Active';
      break;
    case 'pending':
      colorClass = 'dot-yellow';
      textClass = 'text-yellow';
      title = 'Pending';
      break;
    case 'inactive':
      colorClass = 'dot-red';
      textClass = 'text-red';
      title = 'Inactive';
      break;
    default:
      colorClass = '';
      textClass = '';
      title = '';
      break;
  }

  return <span className={`status-text ${textClass}`}>{title}</span>;
};

export default StatusDot;
