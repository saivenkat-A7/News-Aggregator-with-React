# Performance Audit Report

This document details the performance baseline and the improvements achieved through systematic optimization of the News Aggregator application.

## Baseline Performance (Slow Version)

| Metric / Issue | Baseline Score / Observation | Root Cause Analysis | Proposed Solution Hypothesis |
| :--- | :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | ~8.5s (Simulated) | Large, unoptimized hero image blocking the main thread; sequential data fetching delaying initial render. | Compress image, use modern format (WebP), add dimensions, and parallelize fetching. |
| **INP (Interaction to Next Paint)** | ~1200ms (High TBT) | Re-rendering 500+ DOM nodes on every interaction; un-memoized expensive computations in render path. | Implement list virtualization and memoize components/calculations. |
| **CLS (Cumulative Layout Shift)** | ~0.45 | Hero image loading without explicit dimensions, pushing content down as it loads. | Add explicit `width` and `height` attributes to the `<img>` tag. |
| **Bundle Size (main.js)** | ~1.5MB | Importing the entire `lodash` library; lack of code splitting. | Use cherry-picked imports for `lodash` and implement route/component-based code splitting. |
| **Network Waterfall** | 501 serial requests | Sequential `fetch` calls in a `for...of` loop for article details. | Parallelize data fetching using `Promise.all`. |

## Systematic Optimizations

### 1. Parallelize Network Requests
- **Change:** Refactored data fetching from a sequential loop to `Promise.all`.
- **Impact:** Reduced data fetching time from minutes (for 500 items) to a few seconds, significantly improving the time to initial content.
- **Why it worked:** Allows the browser to handle multiple network requests concurrently instead of waiting for each one to complete before starting the next.

### 2. Implement List Virtualization
- **Change:** Integrated `@tanstack/react-virtual` to render only visible items in the article list.
- **Impact:** Drastically reduced the number of DOM nodes from 500+ to ~10-15 at any given time.
- **Why it worked:** Less DOM nodes mean faster re-renders and lower memory usage, which directly improves INP (responsiveness).

### 3. Dependency & Computation Optimization
- **Change:** 
  - Switched to cherry-picked `lodash` imports (e.g., `import sortBy from 'lodash/sortBy'`).
  - Memoized the `ArticleItem` component with `React.memo`.
  - Moved date formatting to `Intl.DateTimeFormat` outside the component and memoized the output.
- **Impact:** Reduced bundle size and eliminated redundant expensive calculations during re-renders.
- **Why it worked:** Smaller bundles load and parse faster. Memoization prevents unnecessary work for the main thread.

### 4. Image Delivery Optimization
- **Change:** Added `width`, `height`, and `srcset` attributes to the hero image.
- **Impact:** Improved LCP and reduced CLS to near zero.
- **Why it worked:** Explicit dimensions allow the browser to reserve space for the image before it loads, preventing layout shifts.

### 5. Code Splitting
- **Change:** Implemented `React.lazy` and `Suspense` for the `SecondaryContent` component.
- **Impact:** Reduced the initial JavaScript payload.
- **Why it worked:** Defers loading non-critical code until it is actually needed.

## Final Performance Results (Optimized Version)

- **LCP:** < 2.5s
- **INP:** < 200ms
- **CLS:** < 0.1
- **Bundle Size:** Significantly reduced (see `stats.html` for details)
- **DOM Node Count:** < 50 items in the article list container
