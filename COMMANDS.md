# Quick Commands Reference

## Development Commands

### Local Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

Visit: http://localhost:3000

## Docker Commands

### Quick Start with Docker Compose

#### Development (with hot reload)
```bash
docker-compose -f docker-compose.dev.yml up --build
```

#### Production
```bash
docker-compose up --build
```

#### Background mode
```bash
docker-compose up -d --build
```

### Container Management

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f portfolio-web

# Stop containers
docker-compose stop

# Start containers
docker-compose start

# Stop and remove containers
docker-compose down

# Remove containers, images, and volumes
docker-compose down -v

# Rebuild without cache
docker-compose build --no-cache

# Execute command in running container
docker-compose exec portfolio-web npm run lint
```

## Manual Docker Commands

### Build Image
```bash
docker build -t portfolio-website:latest .
```

### Run Container
```bash
# Basic run
docker run -p 3000:3000 --env-file .env.local portfolio-website:latest

# With environment variables
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_GITHUB_USERNAME=your_username \
  -e GITHUB_ACCESS_TOKEN=your_token \
  portfolio-website:latest

# Interactive with terminal
docker run -it -p 3000:3000 --env-file .env.local portfolio-website:latest
```

### Inspect Image/Container
```bash
# List images
docker images

# List containers
docker ps -a

# View image details
docker inspect portfolio-website:latest

# View container logs
docker logs <container_id>
```

## Environment & Configuration

### Setup Environment
```bash
# Copy template
cp .env.example .env.local

# Edit environment variables
nano .env.local
# or
vim .env.local
# or
code .env.local
```

### Environment Variables Needed
```
NEXT_PUBLIC_GITHUB_USERNAME=your_github_username
GITHUB_ACCESS_TOKEN=your_github_token
LINKEDIN_ACCESS_TOKEN=your_linkedin_token (optional)
MEDIUM_API_KEY=your_medium_api_key (optional)
NEXT_PUBLIC_MEDIUM_USERNAME=your_medium_username
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Git Commands

### Initial Setup
```bash
git clone <repository-url>
cd portfolio-website
git config user.email "your@email.com"
git config user.name "Your Name"
```

### Common Workflow
```bash
# Check status
git status

# Add files
git add .
git add <filename>

# Commit
git commit -m "Your commit message"

# Push
git push origin main

# Pull latest
git pull origin main

# Create branch
git checkout -b feature/feature-name

# Switch branch
git checkout main

# Merge branch
git merge feature/feature-name
```

## API Testing

### Test GitHub API
```bash
# Get user info
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/users/your_username

# Get repos
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/users/your_username/repos

# Check rate limit
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/rate_limit
```

### Test Local API Endpoints
```bash
# GitHub endpoint
curl http://localhost:3000/api/github?type=latest&limit=10

# Medium endpoint
curl http://localhost:3000/api/medium?type=latest&limit=10

# LinkedIn endpoint
curl http://localhost:3000/api/linkedin?limit=10
```

### Test Medium RSS Feed
```bash
curl "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@your_username"
```

## Performance & Debugging

### Build Analysis
```bash
# Check build output
npm run build -- --debug

# View bundle size
npm run build
```

### Performance Monitoring
```bash
# Start dev server with profiling
npm run dev -- --profile

# Run Next.js built-in analyzer
npm run build -- --analyze
```

### Docker Performance
```bash
# View container resource usage
docker stats

# View container resource history
docker stats --no-stream

# Monitor logs in real-time
docker-compose logs -f --tail=100
```

## Cleanup Commands

### Remove Build Files
```bash
# Clean local build
rm -rf .next

# Clean Docker images
docker image prune

# Clean Docker containers
docker container prune

# Clean everything (careful!)
docker system prune -a
```

### Cache Management
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Useful Development Tips

### Check Port Usage
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### View File Structure
```bash
# Show directory tree
tree -L 2 -I 'node_modules'

# Or with ls
ls -la
ls -R
```

### Search Files
```bash
# Search for text in files
grep -r "search_term" .

# Search with line numbers
grep -rn "search_term" .

# Search in specific file type
grep -r "search_term" --include="*.ts" --include="*.tsx"
```

## Docker Troubleshooting

### Common Issues & Solutions

```bash
# Remove all stopped containers
docker-compose down

# Rebuild if you change Dockerfile
docker-compose build --no-cache

# Check if container is healthy
docker-compose ps

# View environment variables in container
docker-compose exec portfolio-web env

# Run shell in container
docker-compose exec portfolio-web /bin/sh

# Restart service
docker-compose restart portfolio-web
```

## Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Docker Production Build
```bash
# Build image
docker build -t portfolio-website:v1.0.0 .

# Tag for registry
docker tag portfolio-website:v1.0.0 registry.example.com/portfolio-website:v1.0.0

# Push to registry
docker push registry.example.com/portfolio-website:v1.0.0

# Run production container
docker run -d \
  -p 80:3000 \
  --name portfolio-prod \
  --restart unless-stopped \
  --env-file .env.production \
  registry.example.com/portfolio-website:v1.0.0
```

## Useful Links

- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Docker Docs: https://docs.docker.com/
- GitHub API: https://docs.github.com/en/rest
- Medium: https://medium.com/@your_username

---

For more details, see README.md and SETUP.md
