
import { ChevronDown, Search, X } from 'lucide-react';

interface FilterBarProps {
  language: string;
  sortBy: string;
  searchQuery: string;
  onLanguageChange: (language: string) => void;
  onSortChange: (sort: string) => void;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  darkMode: boolean;
}

const POPULAR_LANGUAGES = [
  { value: '', label: 'All Languages' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'Python', label: 'Python' },
  { value: 'Java', label: 'Java' },
  { value: 'Go', label: 'Go' },
  { value: 'Rust', label: 'Rust' },
  { value: 'C++', label: 'C++' },
  { value: 'Swift', label: 'Swift' },
  { value: 'Kotlin', label: 'Kotlin' },
  { value: 'PHP', label: 'PHP' },
];

const SORT_OPTIONS = [
  { value: 'stars', label: 'Most Stars' },
  { value: 'forks', label: 'Most Forks' },
  { value: 'updated', label: 'Recently Updated' },
  { value: 'created', label: 'Newest' },
];

export const FilterBar = ({
  language,
  sortBy,
  searchQuery,
  onLanguageChange,
  onSortChange,
  onSearchChange,
  onSearchSubmit,
  darkMode
}: FilterBarProps) => {
  const selectClass = `appearance-none bg-transparent border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors ${darkMode
      ? 'border-gray-600 text-white hover:border-gray-500'
      : 'border-gray-300 text-gray-900 hover:border-gray-400'
    }`;

  return (
    <div className="px-4 pb-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Search Bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}
          className="flex gap-2 max-w-lg"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 opacity-60" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onSearchSubmit();
                }
              }}
              className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${darkMode
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 hover:border-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:border-gray-400'
                }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-3 h-4 w-4 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Search
          </button>
        </form>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-4">
          {/* Language Filter */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className={selectClass}
            >
              {POPULAR_LANGUAGES.map((lang) => (
                <option
                  key={lang.value}
                  value={lang.value}
                  className={darkMode ? 'bg-gray-800' : 'bg-white'}
                >
                  {lang.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-3 h-4 w-4 pointer-events-none opacity-60" />
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className={selectClass}
            >
              {SORT_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className={darkMode ? 'bg-gray-800' : 'bg-white'}
                >
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-3 h-4 w-4 pointer-events-none opacity-60" />
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="flex items-center space-x-2 text-sm opacity-70">
          {language && (
            <span className={`px-2 py-1 rounded ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}>
              {language}
            </span>
          )}
          <span>
            {SORT_OPTIONS.find(opt => opt.value === sortBy)?.label}
          </span>
        </div>
      </div>
    </div>
  );
};
