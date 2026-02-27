# Setup Guide - Portfolio Website

## Quick Start

### 1. Prerequisites
- Node.js 18+ (for local development)
- Docker & Docker Compose (for containerized deployment)
- Git

### 2. Local Development Setup

Clone repository dan install dependencies:
```bash
git clone <repository-url>
cd portfolio-website
npm install
```

### 3. Configure Environment Variables

Copy template environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi dengan credentials Anda:

```env
# GitHub Configuration
NEXT_PUBLIC_GITHUB_USERNAME=your_github_username
GITHUB_ACCESS_TOKEN=your_github_token

# LinkedIn Configuration (opsional)
LINKEDIN_ACCESS_TOKEN=your_linkedin_token

# Medium Configuration
MEDIUM_API_KEY=your_medium_api_key
NEXT_PUBLIC_MEDIUM_USERNAME=your_medium_username

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Running Locally

**Development Mode (with hot reload):**
```bash
npm run dev
```
Buka browser: http://localhost:3000

**Production Build:**
```bash
npm run build
npm start
```

## Docker Setup

### Prerequisites untuk Docker
- Docker Desktop/Engine installed
- Docker Compose installed

### Development with Docker

Run dengan hot reload (mounted volumes):
```bash
docker-compose -f docker-compose.dev.yml up --build
```

Aplikasi akan berjalan di: http://localhost:3000

### Production with Docker

Build dan run untuk production:
```bash
docker-compose up --build
```

### Docker Commands

```bash
# View logs
docker-compose logs -f portfolio-web

# Stop containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Rebuild image without cache
docker-compose build --no-cache

# Run specific service
docker-compose up portfolio-web
```

## Obtaining API Credentials

### GitHub API

1. Go to: https://github.com/settings/tokens/new
2. Configure token dengan scopes:
   - ✓ public_repo
   - ✓ read:user
3. Copy token to `.env.local` as `GITHUB_ACCESS_TOKEN`
4. Set `NEXT_PUBLIC_GITHUB_USERNAME` to your GitHub username

**API Rate Limits:**
- Without token: 60 requests/hour
- With token: 5,000 requests/hour

### Medium

Medium menggunakan RSS feed, jadi tidak perlu API key:

1. Set `NEXT_PUBLIC_MEDIUM_USERNAME` to your Medium username
2. Pastikan profile Anda public
3. Aplikasi akan otomatis fetch dari: `https://medium.com/feed/@{username}`

### LinkedIn (Optional)

LinkedIn API memerlukan official setup yang lebih kompleks:

1. Go to: https://www.linkedin.com/developers/apps
2. Create new LinkedIn app
3. Configure OAuth 2.0 settings
4. Get your access token
5. Add to `.env.local` as `LINKEDIN_ACCESS_TOKEN`

**Note:** LinkedIn API approval dapat memakan waktu dan memiliki strict requirements.

## Troubleshooting

### Port Already in Use

Jika port 3000 sudah dipakai:

**Localhost (npm run dev):**
```bash
npm run dev -- -p 3001
```

**Docker:**
Edit `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change 3000 to other port
```

### GitHub API Rate Limit Exceeded

1. Check rate limit status:
   ```bash
   curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/rate_limit
   ```

2. Solutions:
   - Use a personal access token for higher limits
   - Implement caching
   - Wait for rate limit reset (usually 1 hour)

### Docker Build Fails

1. Check logs:
   ```bash
   docker-compose logs portfolio-web
   ```

2. Clean build (remove cache):
   ```bash
   docker-compose build --no-cache
   ```

3. Ensure Docker daemon is running:
   ```bash
   docker ps
   ```

### Cannot Connect to Container

1. Verify container is running:
   ```bash
   docker-compose ps
   ```

2. Check container health:
   ```bash
   docker-compose logs portfolio-web
   ```

3. Test container accessibility:
   ```bash
   curl http://localhost:3000
   ```

### Medium Articles Not Loading

1. Verify username is correct (case-sensitive)
2. Ensure Medium profile is public
3. Check browser console for errors
4. Test RSS feed directly:
   ```bash
   curl "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@{username}"
   ```

## Project Structure

```
portfolio-website/
├── app/
│   ├── api/                    # API Routes
│   │   ├── github/route.ts     # GitHub API endpoint
│   │   ├── linkedin/route.ts   # LinkedIn API endpoint
│   │   └── medium/route.ts     # Medium API endpoint
│   ├── components/             # React Components
│   │   ├── Header.tsx
│   │   ├── GitHubSection.tsx
│   │   ├── LinkedInSection.tsx
│   │   ├── MediumSection.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   └── services/           # API Services
│   │       ├── github.ts
│   │       ├── linkedin.ts
│   │       └── medium.ts
│   ├── types/                  # TypeScript Types
│   ├── layout.tsx              # Root Layout
│   └── page.tsx                # Home Page
├── styles/                     # Global Styles
├── public/                     # Static Assets
├── Dockerfile                  # Docker Image Definition
├── docker-compose.yml          # Production Compose
├── docker-compose.dev.yml      # Development Compose
├── next.config.ts              # Next.js Config
├── tailwind.config.ts          # Tailwind Config
├── tsconfig.json               # TypeScript Config
├── postcss.config.mjs          # PostCSS Config
└── package.json                # Dependencies

```

## Performance Tips

1. **Enable Caching:**
   - GitHub repos data: implement SWR or React Query
   - Medium articles: cache RSS feed responses

2. **Image Optimization:**
   - Next.js automatically optimizes images
   - Use next/image component for best results

3. **Bundle Size:**
   - Multi-stage Docker build reduces image size
   - Production build uses optimized output

4. **API Calls:**
   - Batch requests where possible
   - Implement request deduplication
   - Use appropriate rate limiting strategies

## Security Notes

1. **Environment Variables:**
   - Never commit `.env.local` to git (in .gitignore)
   - Never expose API tokens in client code
   - Use server-side API routes to hide tokens

2. **Docker Security:**
   - Non-root user runs application
   - Health checks enabled
   - Proper logging configuration

3. **CORS & Headers:**
   - Configure CORS if accessing from different domain
   - Set appropriate security headers in next.config.ts

## Deployment

### Vercel (Recommended for Next.js)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel settings
4. Automatic deployments on push

### Docker Hub

```bash
docker build -t yourusername/portfolio-website:latest .
docker tag portfolio-website:latest yourusername/portfolio-website:latest
docker push yourusername/portfolio-website:latest
```

### Self-hosted with Docker Compose

```bash
git clone <repo>
cd portfolio-website
cp .env.example .env.local
# Edit .env.local with your credentials
docker-compose up -d --build
```

## Support & Issues

- Check README.md for more details
- Review error logs: `docker-compose logs -f`
- Verify API credentials are correct
- Ensure public profiles for GitHub and Medium

## Next Steps

1. Set up GitHub Personal Access Token
2. Verify your Medium username
3. Run `npm run dev` or `docker-compose up`
4. Customize styling in `tailwind.config.ts`
5. Add your own components and pages

Happy coding! 🚀
