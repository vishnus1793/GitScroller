import { FormEvent } from 'react';
import { Search } from 'lucide-react';

interface FilterBarProps {
  language: string;
  sortBy: string;
  searchQuery: string;
  onLanguageChange: (language: string) => void;
  onSortChange: (sort: string) => void;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
}

const POPULAR_LANGUAGES = [
  { value: '', label: 'All languages' },
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
  { value: 'stars', label: 'Top stars' },
  { value: 'forks', label: 'Top forks' },
  { value: 'updated', label: 'Recently updated' },
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
}: FilterBarProps) => {
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearchSubmit();
  };

  return (
    <div className="filter-controls">
      <form className="search-control" onSubmit={submitSearch}>
        <Search size={15} aria-hidden="true" />
        <input
          aria-label="Search repositories"
          placeholder="Search repos"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </form>
      <label className="select-control language-select">
        <span>Lang</span>
        <select aria-label="Filter by language" value={language} onChange={(event) => onLanguageChange(event.target.value)}>
          {POPULAR_LANGUAGES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </label>
      <label className="select-control sort-select">
        <span>Sort</span>
        <select aria-label="Sort repositories" value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
          {SORT_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </label>
    </div>
  );
};
