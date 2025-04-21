import { useNavigate } from 'react-router-dom';

const ReportsMenu = () => {
  const navigate = useNavigate();

  const handleClick = (view) => {
    navigate(`/reports?view=${view}`);
  };

  return (
    <div className="flex flex-col w-40">
      {['income', 'expenses', 'both'].map((type) => (
        <button
          key={type}
          onClick={() => handleClick(type)}
          className="px-4 py-2 text-left hover:text-[#2ecfe3] hover:bg-gray-100 transition-colors duration-150"
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default ReportsMenu;
