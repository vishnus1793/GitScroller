
import { useState, useEffect, useCallback } from 'react';
import { RepoCard } from '@/components/RepoCard';
import { InfiniteScroll } from '@/components/InfiniteScroll';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { FilterBar } from '@/components/FilterBar';
import { fetchTrendingRepos } from '@/utils/githubApi';
import { Repository } from '@/types/repository';
import { Moon, Sun, Github } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [language, setLanguage] = useState('');
  const [sortBy, setSortBy] = useState('stars');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  const loadRepos = useCallback(async (pageNum: number, reset = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      const newRepos = await fetchTrendingRepos({
        page: pageNum,
        language,
        sort: sortBy,
        query: searchQuery,
        per_page: 10
      });

      if (newRepos.length === 0) {
        setHasMore(false);
        toast({
          title: "End of feed",
          description: "You've reached the end! Try changing filters for more repos.",
        });
        return;
      }

      setRepos(prev => reset ? newRepos : [...prev, ...newRepos]);
      setPage(pageNum + 1);
    } catch (err) {
      setError('Failed to load repositories. Please try again.');
      toast({
        title: "Error loading repos",
        description: "Check your connection and try again.",
        variant: "destructive"
      });
      console.error('Error loading repos:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, language, sortBy, searchQuery, toast]);

  useEffect(() => {
    setRepos([]);
    setPage(1);
    setHasMore(true);
    loadRepos(1, true);
  }, [language, sortBy, searchQuery]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadRepos(page);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleStarRepo = (repoId: number) => {
    // Update local state to show starred status
    setRepos(prev => prev.map(repo => 
      repo.id === repoId 
        ? { ...repo, starred: !repo.starred }
        : repo
    ));
    
    toast({
      title: "Repository starred!",
      description: "Added to your favorites (local storage)",
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md ${
        darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
      } border-b transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Github className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RepoReel
              </h1>
              <p className="text-sm opacity-70">Discover amazing repositories</p>
            </div>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors ${
              darkMode 
                ? 'hover:bg-gray-700 text-yellow-400' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
        
        <FilterBar
          language={language}
          sortBy={sortBy}
          searchQuery={searchQuery}
          onLanguageChange={setLanguage}
          onSortChange={setSortBy}
          onSearchChange={setSearchQuery}
          onSearchSubmit={() => {
            setRepos([]);
            setPage(1);
            setHasMore(true);
            loadRepos(1, true);
          }}
          darkMode={darkMode}
        />
      </header>

      {/* Main Feed */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {error && (
          <div className={`p-4 rounded-lg mb-6 ${
            darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
          }`}>
            {error}
          </div>
        )}

        <InfiniteScroll
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          loading={loading}
        >
          <div className="space-y-6">
            {repos.map((repo, index) => (
              <RepoCard
                key={`${repo.id}-${index}`}
                repo={repo}
                darkMode={darkMode}
                onStar={handleStarRepo}
              />
            ))}
          </div>
        </InfiniteScroll>

        {loading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner darkMode={darkMode} />
          </div>
        )}

        {!hasMore && repos.length > 0 && (
          <div className="text-center py-8 opacity-60">
            <p>You've scrolled through all trending repos!</p>
            <p className="text-sm mt-2">Try changing the filters above for more discoveries.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
