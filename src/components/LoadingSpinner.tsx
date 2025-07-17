
interface LoadingSpinnerProps {
  darkMode: boolean;
}

export const LoadingSpinner = ({ darkMode }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className={`animate-spin rounded-full h-12 w-12 border-4 ${
        darkMode 
          ? 'border-gray-700 border-t-blue-500' 
          : 'border-gray-200 border-t-blue-600'
      }`} />
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Loading amazing repositories...
      </p>
    </div>
  );
};
