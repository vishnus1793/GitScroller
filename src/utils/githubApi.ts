
import { Repository, GitHubApiResponse, FetchReposParams } from '@/types/repository';

const GITHUB_API_BASE = 'https://api.github.com';

// Rate limiting and caching
const cache = new Map<string, { data: Repository[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchTrendingRepos = async (params: FetchReposParams = {}): Promise<Repository[]> => {
  const {
    page = 1,
    per_page = 10,
    language = '',
    sort = 'stars',
    order = 'desc'
  } = params;

  // Create cache key
  const cacheKey = `${page}-${per_page}-${language}-${sort}-${order}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('Returning cached data for:', cacheKey);
    return cached.data;
  }

  // Build query
  let query = 'stars:>100'; // Only repos with at least 100 stars
  
  if (language) {
    query += ` language:${language}`;
  }

  // Add some randomness by varying the date range
  const days = Math.floor(Math.random() * 365) + 30; // Random between 30-395 days ago
  const date = new Date();
  date.setDate(date.getDate() - days);
  const dateStr = date.toISOString().split('T')[0];
  query += ` created:>${dateStr}`;

  const url = new URL(`${GITHUB_API_BASE}/search/repositories`);
  url.searchParams.set('q', query);
  url.searchParams.set('sort', sort);
  url.searchParams.set('order', order);
  url.searchParams.set('page', page.toString());
  url.searchParams.set('per_page', per_page.toString());

  console.log('Fetching from GitHub API:', url.toString());

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'RepoReel-App'
      }
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: GitHubApiResponse = await response.json();
    
    // Cache the result
    cache.set(cacheKey, {
      data: data.items,
      timestamp: Date.now()
    });

    return data.items;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
};

export const getLanguageColor = (language: string | null): string => {
  const colors: Record<string, string> = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C': '#555555',
    'C#': '#239120',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'Dart': '#00B4AB',
    'HTML': '#e34c26',
    'CSS': '#1572B6',
    'Vue': '#4FC08D',
    'React': '#61DAFB',
    'Angular': '#DD0031',
    'Svelte': '#ff3e00',
    'Shell': '#89e051',
    'PowerShell': '#012456',
    'Dockerfile': '#384d54',
    'YAML': '#cb171e',
    'JSON': '#292929',
    'Markdown': '#083fa1',
  };

  return colors[language || ''] || '#8b949e';
};
