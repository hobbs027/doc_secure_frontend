const StatusBadge = ({ status }) => {
  const badgeStyles = {
    unverified: "bg-red-600",
    pending: "bg-yellow-500",
    verified: "bg-green-600"
  };

 return (
  <span
    title={descriptions[status]}
    className={`text-white px-2 py-1 rounded text-xs ${styles[status]}`}
  >
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
 );
};

export default StatusBadge;