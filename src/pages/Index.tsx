import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Bookmark,
  Check,
  Code2,
  ExternalLink,
  GitFork,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Search,
  Share2,
  Sparkles,
  Star,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { FilterBar } from '@/components/FilterBar';
import { useToast } from '@/hooks/use-toast';
import { Repository } from '@/types/repository';
import { fetchTrendingRepos, getLanguageColor } from '@/utils/githubApi';

const formatCount = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
};

const Index = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [language, setLanguage] = useState('');
  const [sortBy, setSortBy] = useState('stars');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const [likedRepos, setLikedRepos] = useState<Set<number>>(() => new Set());
  const [savedRepos, setSavedRepos] = useState<Set<number>>(() => new Set());
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const loadingMoreRef = useRef(false);
  const transitionLock = useRef(false);
  const transitionTimer = useRef<number | null>(null);
  const wheelGestureActive = useRef(false);
  const wheelDelta = useRef(0);
  const wheelGestureTimer = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const [transition, setTransition] = useState<{ fromIndex: number; direction: -1 | 1 } | null>(null);
  const { toast } = useToast();
  const activeRepo = repos[activeIndex];

  useEffect(() => {
    let cancelled = false;
    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
    transitionTimer.current = null;
    transitionLock.current = false;
    setTransition(null);
    setRepos([]);
    setActiveIndex(0);
    setNextPage(2);
    setHasMore(true);
    setError(null);
    setLoading(true);

    fetchTrendingRepos({
      page: 1,
      per_page: 10,
      language,
      sort: sortBy,
      query: activeSearchQuery,
    })
      .then((items) => {
        if (cancelled) return;
        setRepos(items);
        setHasMore(items.length > 0);
        if (items.length === 0) setError('No repositories found. Try adjusting your search or filters.');
      })
      .catch(() => {
        if (!cancelled) setError('Could not load repositories. Check your connection and try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeSearchQuery, language, reloadToken, sortBy]);

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMore) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const items = await fetchTrendingRepos({
        page: nextPage,
        per_page: 10,
        language,
        sort: sortBy,
        query: activeSearchQuery,
      });
      setRepos((current) => {
        const existingIds = new Set(current.map((repo) => repo.id));
        return [...current, ...items.filter((repo) => !existingIds.has(repo.id))];
      });
      setNextPage((page) => page + 1);
      if (items.length === 0) setHasMore(false);
    } catch {
      toast({
        title: 'Could not load more repositories',
        description: 'Check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [activeSearchQuery, hasMore, language, nextPage, sortBy, toast]);

  useEffect(() => {
    if (repos.length > 0 && activeIndex >= repos.length - 2 && hasMore) {
      void loadMore();
    }
  }, [activeIndex, hasMore, loadMore, repos.length]);

  const moveReel = useCallback((direction: -1 | 1) => {
    if (transitionLock.current) return;
    if (direction > 0 && activeIndex >= repos.length - 1) {
      if (hasMore) void loadMore();
      return;
    }
    const targetIndex = Math.max(0, Math.min(activeIndex + direction, repos.length - 1));
    if (targetIndex === activeIndex) return;

    transitionLock.current = true;
    setTransition({ fromIndex: activeIndex, direction });
    setCaptionExpanded(false);
    setActiveIndex(targetIndex);
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 560;
    transitionTimer.current = window.setTimeout(() => {
      setTransition(null);
      transitionLock.current = false;
      transitionTimer.current = null;
    }, duration);
  }, [activeIndex, hasMore, loadMore, repos.length]);

  useEffect(() => () => {
    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current);
    if (wheelGestureTimer.current !== null) window.clearTimeout(wheelGestureTimer.current);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof Element && event.target.closest('button, a, input, select, textarea, [contenteditable="true"]')) return;
      if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        event.preventDefault();
        moveReel(1);
      } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        event.preventDefault();
        moveReel(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveReel]);

  const toggleLike = (repoId: number) => {
    setLikedRepos((current) => {
      const next = new Set(current);
      if (next.has(repoId)) next.delete(repoId);
      else next.add(repoId);
      return next;
    });
  };

  const toggleSave = (repoId: number) => {
    setSavedRepos((current) => {
      const next = new Set(current);
      if (next.has(repoId)) next.delete(repoId);
      else next.add(repoId);
      return next;
    });
  };

  const shareRepo = async (repo: Repository) => {
    try {
      if (navigator.share) {
        await navigator.share({ title: repo.full_name, text: repo.description ?? undefined, url: repo.html_url });
      } else {
        await navigator.clipboard.writeText(repo.html_url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
        toast({ title: 'Link copied', description: 'Repository link copied to your clipboard.' });
      }
    } catch (shareError) {
      if (shareError instanceof Error && shareError.name !== 'AbortError') {
        toast({ title: 'Unable to share this repository', variant: 'destructive' });
      }
    }
  };

  const renderScene = (repoIndex: number, sceneClass: string, isOutgoing = false) => {
    const repo = repos[repoIndex];
    if (!repo) return null;

    return (
      <div
        className={`reel-scene ${sceneClass}`}
        key={repo.id}
        aria-hidden={isOutgoing}
      >
        <article className={`reel-card artwork-theme-${repoIndex % 4}`}>
          <div className="artwork" aria-hidden="true">
            <div className="artwork-orbit orbit-one" />
            <div className="artwork-orbit orbit-two" />
            <div className="artwork-glow" />
            <div className="artwork-index">PROJECT SPOTLIGHT <span>·</span> {String(repoIndex + 1).padStart(2, '0')}</div>
            <div className="artwork-symbol">{repo.language ? repo.language.slice(0, 2).toUpperCase() : 'GH'}</div>
            <div className="code-window">
              <div className="code-window-top"><span /><span /><span /><small>{repo.name}</small></div>
              <div className="code-lines">
                <span><i>01</i><b>const</b> project = <em>'{repo.name}'</em></span>
                <span><i>02</i><b>stars</b>: {formatCount(repo.stargazers_count)},</span>
                <span><i>03</i><b>language</b>: <em>'{repo.language ?? 'Open source'}'</em></span>
                <span><i>04</i><b>built</b> for the curious.</span>
              </div>
            </div>
            <div className="artwork-bottom-note">A little inspiration from the open web <span>↗</span></div>
          </div>

          <div className="reel-shade" />
          <div className="reel-topline">
            <span className="spotlight-pill"><span className="live-dot" /> TRENDING ON GITHUB</span>
            <a className="repo-open-top" href={repo.html_url} target="_blank" rel="noopener noreferrer" aria-label="Open repository on GitHub">
              <ExternalLink size={17} />
            </a>
          </div>

          <div className="reel-info">
            <div className="creator-row">
              <a className="creator-avatar" href={repo.owner.html_url} target="_blank" rel="noopener noreferrer">
                <img src={repo.owner.avatar_url} alt="" />
              </a>
              <a className="creator-name" href={repo.owner.html_url} target="_blank" rel="noopener noreferrer">
                {repo.owner.login}
              </a>
              <span className="creator-separator">·</span>
              <a className="follow-link" href={repo.owner.html_url} target="_blank" rel="noopener noreferrer">Follow</a>
            </div>
            <a className="repo-title" href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.full_name}
            </a>
            {repo.description && (
              <div className={`repo-description ${captionExpanded && !isOutgoing ? 'expanded' : ''}`}>
                <span>{repo.description}</span>
                {repo.description.length > 98 && !isOutgoing && (
                  <button onClick={() => setCaptionExpanded((expanded) => !expanded)}>
                    {captionExpanded ? 'less' : 'more'}
                  </button>
                )}
              </div>
            )}
            <div className="reel-meta">
              {repo.language && (
                <span className="language-chip">
                  <i style={{ backgroundColor: getLanguageColor(repo.language) }} />
                  {repo.language}
                </span>
              )}
              <span className="audio-label"><Code2 size={13} /> Open source · GitHub</span>
            </div>
            {repo.topics.length > 0 && (
              <div className="topic-list">
                {repo.topics.slice(0, 3).map((topic) => <span key={topic}>#{topic}</span>)}
              </div>
            )}
          </div>
        </article>

        <aside className="action-rail" aria-label="Repository actions">
          <button className={`action-button ${likedRepos.has(repo.id) && !isOutgoing ? 'is-liked' : ''}`} onClick={() => toggleLike(repo.id)} aria-label={likedRepos.has(repo.id) ? 'Unlike repository' : 'Like repository'}>
            <span className="action-icon"><Heart size={23} fill={likedRepos.has(repo.id) && !isOutgoing ? 'currentColor' : 'none'} /></span>
            <span className="action-count">{formatCount(repo.stargazers_count + (likedRepos.has(repo.id) ? 1 : 0))}</span>
          </button>
          <a className="action-button" href={`${repo.html_url}/issues`} target="_blank" rel="noopener noreferrer" aria-label="View repository issues">
            <span className="action-icon"><MessageCircle size={23} /></span>
            <span className="action-count">{formatCount(repo.open_issues_count)}</span>
          </a>
          <button className="action-button" onClick={() => void shareRepo(repo)} aria-label="Share repository">
            <span className="action-icon">{copied && !isOutgoing ? <Check size={22} /> : <Share2 size={22} />}</span>
            <span className="action-count">{copied && !isOutgoing ? 'Copied' : 'Share'}</span>
          </button>
          <button className={`action-button ${savedRepos.has(repo.id) && !isOutgoing ? 'is-saved' : ''}`} onClick={() => toggleSave(repo.id)} aria-label={savedRepos.has(repo.id) ? 'Remove bookmark' : 'Bookmark repository'}>
            <span className="action-icon"><Bookmark size={22} fill={savedRepos.has(repo.id) && !isOutgoing ? 'currentColor' : 'none'} /></span>
            <span className="action-count">{savedRepos.has(repo.id) && !isOutgoing ? 'Saved' : 'Save'}</span>
          </button>
          <a className="action-button" href={repo.html_url} target="_blank" rel="noopener noreferrer" aria-label="More about this repository">
            <span className="action-icon"><MoreHorizontal size={23} /></span>
            <span className="action-count">More</span>
          </a>
          <div className="repo-stats">
            <Star size={13} fill="currentColor" />
            <span>{formatCount(repo.stargazers_count)}</span>
            <GitFork size={13} />
            <span>{formatCount(repo.forks_count)}</span>
          </div>
        </aside>
      </div>
    );
  };

  const handleWheel = (event: React.WheelEvent<HTMLElement>) => {
    if (event.target instanceof Element && event.target.closest('button, a, input, select, textarea, [contenteditable="true"]')) return;
    if (wheelGestureTimer.current !== null) window.clearTimeout(wheelGestureTimer.current);
    wheelGestureTimer.current = window.setTimeout(() => {
      wheelGestureActive.current = false;
      wheelDelta.current = 0;
      wheelGestureTimer.current = null;
    }, 180);
    if (wheelGestureActive.current) return;

    const delta = event.deltaY * (event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? window.innerHeight : 1);
    if (Math.sign(delta) !== Math.sign(wheelDelta.current)) wheelDelta.current = 0;
    wheelDelta.current += delta;
    if (Math.abs(wheelDelta.current) < 36) return;
    wheelGestureActive.current = true;
    const direction = wheelDelta.current > 0 ? 1 : -1;
    wheelDelta.current = 0;
    moveReel(direction);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    if (event.target instanceof Element && event.target.closest('button, a, input, select, textarea, [contenteditable="true"]')) {
      touchStartY.current = null;
      return;
    }
    touchStartY.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (touchStartY.current === null) return;
    if (event.target instanceof Element && event.target.closest('button, a, input, select, textarea, [contenteditable="true"]')) {
      touchStartY.current = null;
      return;
    }
    const delta = touchStartY.current - (event.changedTouches[0]?.clientY ?? touchStartY.current);
    if (Math.abs(delta) > 48) moveReel(delta > 0 ? 1 : -1);
    touchStartY.current = null;
  };

  const handleSearchSubmit = () => {
    const query = searchQuery.trim();
    if (query === activeSearchQuery) setReloadToken((token) => token + 1);
    else setActiveSearchQuery(query);
  };

  return (
    <main className="reel-app" onWheel={handleWheel} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <header className="topbar">
        <a className="brand" href="/" aria-label="RepoReel home">
          <span className="brand-mark"><Code2 size={17} strokeWidth={2.5} /></span>
          <span>repo<span className="brand-accent">reel</span></span>
        </a>
        <div className="topbar-center">
          <span className="feed-label"><Sparkles size={14} /> For you</span>
          <span className="topbar-divider" />
          <span className="feed-caption">Open source, in motion</span>
        </div>
        <div className="topbar-search">
          <FilterBar
            language={language}
            sortBy={sortBy}
            searchQuery={searchQuery}
            onLanguageChange={setLanguage}
            onSortChange={setSortBy}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
          />
        </div>
      </header>

      <section className="viewer" aria-label="Repository reel viewer">
        {loading ? (
          <div className="viewer-state"><LoadingSpinner darkMode /></div>
        ) : error && repos.length === 0 ? (
          <div className="viewer-state">
            <div className="empty-icon"><Search size={24} /></div>
            <h1>{error}</h1>
            <button className="retry-button" onClick={() => setReloadToken((token) => token + 1)}>Try again</button>
          </div>
        ) : activeRepo ? (
          <>
            <div className="reel-stage">
              {transition && renderScene(transition.fromIndex, `is-exiting ${transition.direction > 0 ? 'exit-next' : 'exit-previous'}`, true)}
              {renderScene(activeIndex, transition ? `is-entering ${transition.direction > 0 ? 'enter-next' : 'enter-previous'}` : '')}
            </div>
            <nav className="reel-navigation" aria-label="Navigate repositories">
              <span className="reel-position">{String(activeIndex + 1).padStart(2, '0')} <i>/</i> {hasMore ? '···' : String(repos.length).padStart(2, '0')}</span>
              <button onClick={() => moveReel(-1)} disabled={activeIndex === 0} aria-label="Previous repository"><ArrowUp size={17} /></button>
              <button onClick={() => moveReel(1)} disabled={!hasMore && activeIndex === repos.length - 1} aria-label="Next repository"><ArrowDown size={17} /></button>
            </nav>
          </>
        ) : null}
      </section>

      <footer className="viewer-footer">
        <span>Scroll to discover</span>
        <span className="footer-line" />
        <span>{loadingMore ? 'Finding more projects…' : 'Made for the curious'}</span>
      </footer>
    </main>
  );
};

export default Index;
