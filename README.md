# High-Performance News Aggregator

A modern, highly optimized React news aggregator that demonstrates performance engineering best practices. This project was built by identifying and fixing common performance bottlenecks like network waterfalls, excessive DOM nodes, and unoptimized assets.

## Features

- **HackerNews Integration:** Fetches the top 500 stories from the HackerNews API.
- **Systematic Optimization:** Comparison between an intentionally "Slow" version and a highly "Optimized" version.
- **List Virtualization:** Smoothly handles 500+ items using `@tanstack/react-virtual`.
- **Parallel Data Fetching:** Optimized network requests using `Promise.all`.
- **Responsive Design:** Premium UI with dark mode support and modern typography.
- **Dockerized:** Easy deployment using Docker and Docker Compose.
- **Performance Documentation:** Detailed audit report in `PERFORMANCE.md`.

## Project Structure

- `main` branch: The final, optimized version of the application.
- `slow-version` branch: The initial version with intentional performance anti-patterns.
- `PERFORMANCE.md`: A detailed report on performance metrics and optimizations.
- `Dockerfile` & `docker-compose.yml`: Containerization setup.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker & Docker Compose (optional, for containerized run)

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd news-aggregator
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

## Running the Project

### Local Development
To run the **Optimized** version (main branch):
```bash
npm run dev
```

To view the **Slow** version:
```bash
git checkout slow-version
npm install
npm run dev
```

### Using Docker
You can run the optimized version using Docker:
```bash
docker-compose up -d --build
```
The application will be available at `http://localhost:3000` (or the port specified in your `.env`).

## Performance Audit

Check the [PERFORMANCE.md](PERFORMANCE.md) file for a detailed breakdown of:
- Baseline scores vs. Optimized scores.
- Root cause analysis of performance bottlenecks.
- Detailed explanation of each optimization step.

## Technologies Used

- **React** (Vite)
- **Lodash** (Cherry-picked imports)
- **@tanstack/react-virtual** (List virtualization)
- **Lucide React** (Icons)
- **Docker** (Containerization)


