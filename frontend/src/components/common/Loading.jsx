const LoadingSpinner = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    gray: 'text-gray-600'
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
        style={{ borderTopColor: 'currentColor' }}
      />
    </div>
  );
};

const LoadingCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="animate-pulse">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="h-6 bg-gray-300 rounded w-20 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-5 bg-gray-300 rounded w-16"></div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-300 rounded w-24"></div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div>
              <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </div>
            <div>
              <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <LoadingSpinner size="xl" />
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );
};

export { LoadingSpinner, LoadingCard, LoadingScreen };
