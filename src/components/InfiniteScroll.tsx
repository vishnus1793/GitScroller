
import { useEffect, useRef, ReactNode } from 'react';

interface InfiniteScrollProps {
  children: ReactNode;
  hasMore: boolean;
  onLoadMore: () => void;
  loading: boolean;
  threshold?: number;
}

export const InfiniteScroll = ({ 
  children, 
  hasMore, 
  onLoadMore, 
  loading,
  threshold = 1000 
}: InfiniteScrollProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
        threshold: 0.1
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.unobserve(sentinel);
    };
  }, [hasMore, loading, onLoadMore, threshold]);

  return (
    <>
      {children}
      <div ref={sentinelRef} className="h-4" />
    </>
  );
};
