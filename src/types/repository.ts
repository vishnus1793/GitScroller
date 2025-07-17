
export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  updated_at: string;
  created_at: string;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  starred?: boolean; // Local state for UI
}

export interface GitHubApiResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
}

export interface FetchReposParams {
  page?: number;
  per_page?: number;
  language?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  query?: string;
}
