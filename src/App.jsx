import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import sortBy from 'lodash/sortBy'; // Cherry-picked import
import { useVirtualizer } from '@tanstack/react-virtual';
import './App.css';

// Code Splitting: Lazy load secondary component
const SecondaryContent = lazy(() => import('./SecondaryContent'));

// Optimized Date Formatter (Outside component to avoid re-creation)
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

function App() {
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSecondary, setShowSecondary] = useState(false);

  useEffect(() => {
    const fetchAllStories = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const storyIds = await response.json();
        
        // Optimized: Parallel fetching using Promise.all
        const storyPromises = storyIds.slice(0, 500).map(id => 
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
        );
        
        const stories = await Promise.all(storyPromises);
        setArticles(stories);
      } catch (error) {
        console.error("Failed to fetch stories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStories();
  }, []);

  // Memoized filter and sort
  const processedArticles = useMemo(() => {
    let result = articles.filter(article => 
      article && article.title && article.title.toLowerCase().includes(filter.toLowerCase())
    );
    // Sort by score
    return sortBy(result, 'score').reverse();
  }, [articles, filter]);

  const parentRef = React.useRef();

  // List Virtualization
  const rowVirtualizer = useVirtualizer({
    count: processedArticles.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Estimated height of each article item
    overscan: 5,
  });

  return (
    <div className="app-container">
      {/* Optimized Image Delivery */}
      <img 
        src="/hero-optimized.png" 
        className="hero-image" 
        data-testid="hero-image"
        alt="News Aggregator Hero"
        width="1200" // Explicit dimensions to prevent CLS
        height="400"
        loading="eager" // Hero image should load eagerly
        // Note: In a real app, we'd use srcset here
        srcSet="/hero-optimized.png 1200w, /hero-optimized.png 800w, /hero-optimized.png 400w"
      />
      
      <header>
        <h1>High-Performance News</h1>
        <div className="controls">
          <input 
            type="text" 
            placeholder="Filter by title..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button onClick={() => setShowSecondary(!showSecondary)}>
            {showSecondary ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </header>

      {/* Code Splitting: Suspense for lazy component */}
      <Suspense fallback={<div>Loading details...</div>}>
        {showSecondary && <SecondaryContent />}
      </Suspense>

      {loading ? (
        <div className="loading">Loading stories in parallel...</div>
      ) : (
        <div 
          ref={parentRef} 
          className="article-list-container" 
          style={{ height: '800px', overflow: 'auto' }}
          data-testid="article-list"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => (
              <div
                key={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <ArticleItem article={processedArticles[virtualRow.index]} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Optimized component with React.memo
const ArticleItem = React.memo(({ article }) => {
  // Memoized date formatting
  const formattedDate = useMemo(() => {
    return dateFormatter.format(new Date(article.time * 1000));
  }, [article.time]);

  return (
    <div className="article-item" data-testid="article-item" style={{ marginBottom: '15px' }}>
      <h3><a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a></h3>
      <div className="meta">
        <span>Score: {article.score}</span> | 
        <span> Author: {article.by}</span> | 
        <span> Date: {formattedDate}</span>
      </div>
    </div>
  );
});

export default App;
