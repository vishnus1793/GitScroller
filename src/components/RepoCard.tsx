
import { useState } from 'react';
import { Star, GitFork, AlertCircle, Clock, ExternalLink, Heart, Code, Calendar } from 'lucide-react';
import { Repository } from '@/types/repository';
import { getLanguageColor } from '@/utils/githubApi';

interface RepoCardProps {
  repo: Repository;
  darkMode: boolean;
  onStar: (repoId: number) => void;
}

export const RepoCard = ({ repo, darkMode, onStar }: RepoCardProps) => {
  const [isLiked, setIsLiked] = useState(repo.starred || false);
  const [imageError, setImageError] = useState(false);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onStar(repo.id);
  };

  const cardBg = darkMode 
    ? 'bg-gray-800/50 border-gray-700' 
    : 'bg-white/80 border-gray-200';

  return (
    <div className={`${cardBg} backdrop-blur-sm rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl overflow-hidden group`}>
      {/* Header with Owner Info */}
      <div className="p-6 pb-4">
        <div className="flex items-center space-x-3 mb-4">
          {!imageError ? (
            <img
              src={repo.owner.avatar_url}
              alt={repo.owner.login}
              className="w-12 h-12 rounded-full ring-2 ring-blue-500/20"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <Code className="w-6 h-6 opacity-60" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate">{repo.owner.login}</h3>
            <p className="text-sm opacity-70">{repo.name}</p>
          </div>

          <button
            onClick={handleLike}
            className={`p-2 rounded-full transition-all duration-200 ${
              isLiked 
                ? 'text-red-500 scale-110' 
                : darkMode 
                  ? 'text-gray-400 hover:text-red-400' 
                  : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Repository Title */}
        <h2 className="text-xl font-bold mb-3 leading-tight">
          {repo.full_name}
        </h2>

        {/* Description */}
        {repo.description && (
          <p className={`mb-4 leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {repo.description}
          </p>
        )}

        {/* Stats Row */}
        <div className="flex items-center space-x-6 mb-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold">{formatNumber(repo.stargazers_count)}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <GitFork className="w-4 h-4 text-blue-500" />
            <span className="font-semibold">{formatNumber(repo.forks_count)}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="font-semibold">{formatNumber(repo.open_issues_count)}</span>
          </div>
        </div>

        {/* Language and Date */}
        <div className="flex items-center justify-between mb-4">
          {repo.language && (
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getLanguageColor(repo.language) }}
              />
              <span className="text-sm font-medium">{repo.language}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-1 text-sm opacity-70">
            <Clock className="w-4 h-4" />
            <span>{formatDate(repo.updated_at)}</span>
          </div>
        </div>

        {/* Topics/Tags */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {repo.topics.slice(0, 6).map((topic) => (
              <span
                key={topic}
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  darkMode 
                    ? 'bg-blue-900/30 text-blue-300' 
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                #{topic}
              </span>
            ))}
            {repo.topics.length > 6 && (
              <span className="px-3 py-1 text-xs rounded-full opacity-60">
                +{repo.topics.length - 6} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="px-6 pb-6">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 group"
        >
          <span>View on GitHub</span>
          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};
