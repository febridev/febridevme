# Portfolio Website

A modern portfolio website built with Next.js, React, and Tailwind CSS that showcases your GitHub repositories, LinkedIn posts, and Medium articles in one place.

## Features

- **GitHub Integration**: Display your latest and top starred repositories
- **LinkedIn Integration**: Showcase your professional presence (requires API setup)
- **Medium Integration**: Publish your latest articles and thoughts
- **Responsive Design**: Works seamlessly on all devices
- **Dark Theme**: Modern dark UI with Tailwind CSS
- **Docker Support**: Easy deployment with Docker and Docker Compose

## Tech Stack

- **Frontend**: Next.js 16+, React 19+, TypeScript
- **Styling**: Tailwind CSS
- **API Calls**: Axios
- **Containerization**: Docker, Docker Compose
- **Environment Management**: dotenv

## Getting Started

### Prerequisites

- Node.js 18+ (or Docker)
- Git
- API keys for GitHub, LinkedIn, and Medium (optional)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd portfolio-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API credentials:
```env
NEXT_PUBLIC_GITHUB_USERNAME=your_github_username
GITHUB_ACCESS_TOKEN=your_github_token

LINKEDIN_ACCESS_TOKEN=your_linkedin_token

MEDIUM_API_KEY=your_medium_api_key
NEXT_PUBLIC_MEDIUM_USERNAME=your_medium_username

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Running Locally

**Development Mode:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm start
```

Visit `http://localhost:3000` in your browser.

## Docker Setup

### Using Docker Compose (Recommended)

**Production:**
```bash
docker-compose up --build
```

**Development:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Or simply:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

The application will be available at `http://localhost:3000`

### Building Docker Image Manually

```bash
docker build -t portfolio-website:latest .
docker run -p 3000:3000 --env-file .env.local portfolio-website:latest
```

## API Integration Guide

### GitHub API

1. Generate a personal access token:
   - Go to https://github.com/settings/tokens
   - Create new token with `public_repo` and `read:user` scopes
   - Copy the token to `GITHUB_ACCESS_TOKEN` in `.env.local`

2. Set your GitHub username in `NEXT_PUBLIC_GITHUB_USERNAME`

### Medium API

1. Get your Medium username:
   - Go to https://medium.com/@yourUsername
   - Set `NEXT_PUBLIC_MEDIUM_USERNAME` to your username

2. Medium RSS Feed API Integration:
   - The app uses RSS2JSON service (no API key required)
   - RSS feed URL: `https://medium.com/feed/@{username}`

### LinkedIn API

LinkedIn API requires official application registration and approval. For production:

1. Create a LinkedIn Developer Application:
   - Go to https://www.linkedin.com/developers/apps
   - Create a new app
   - Configure OAuth 2.0 settings
   - Get your access token

2. Add token to `LINKEDIN_ACCESS_TOKEN`

**Note**: LinkedIn's API has strict rate limiting and access requirements. Alternative approach is to use LinkedIn's public profile feeds.

## Project Structure

```
.
├── app/
│   ├── api/                 # Next.js API routes
│   │   ├── github/
│   │   ├── linkedin/
│   │   └── medium/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── GitHubSection.tsx
│   │   ├── LinkedInSection.tsx
│   │   ├── MediumSection.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   └── services/        # API service layers
│   │       ├── github.ts
│   │       ├── linkedin.ts
│   │       └── medium.ts
│   ├── types/               # TypeScript type definitions
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── styles/                  # Global styles
├── public/                  # Static assets
├── Dockerfile               # Docker image definition
├── docker-compose.yml       # Production compose file
├── docker-compose.dev.yml   # Development compose file
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── postcss.config.mjs       # PostCSS configuration
└── package.json             # Project dependencies
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Docker Commands

```bash
# Build and run container
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop container
docker-compose down

# Remove all containers and volumes
docker-compose down -v

# Development with hot reload
docker-compose -f docker-compose.dev.yml up --build
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
# GitHub Configuration
NEXT_PUBLIC_GITHUB_USERNAME=your_username
GITHUB_ACCESS_TOKEN=your_token

# LinkedIn Configuration
LINKEDIN_ACCESS_TOKEN=your_token

# Medium Configuration
MEDIUM_API_KEY=your_api_key (optional)
NEXT_PUBLIC_MEDIUM_USERNAME=your_username

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Features Explained

### GitHub Section
- Display latest or top (by stars) repositories
- Shows repository name, description, language, and star count
- Links directly to GitHub repository

### Medium Section
- Fetches latest Medium articles using RSS feed
- Displays article title, description, and publication date
- Shows thumbnail if available
- Links to full article on Medium

### LinkedIn Section
- Placeholder for LinkedIn integration
- Requires official API setup and approval
- Instructions provided for setup

## Troubleshooting

### Docker Issues

**Container won't start:**
```bash
docker-compose logs portfolio-web
```

**Port already in use:**
Change port mapping in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change to different port
```

### API Issues

**GitHub API rate limiting:**
- Use a personal access token for higher rate limits
- Check `GITHUB_ACCESS_TOKEN` is properly set

**Medium articles not loading:**
- Verify `NEXT_PUBLIC_MEDIUM_USERNAME` is correct
- Check if Medium account is public

**LinkedIn connection failing:**
- Verify `LINKEDIN_ACCESS_TOKEN` is valid
- Check token has not expired

## Performance Optimization

- Images optimized with Next.js Image component
- CSS minified with Tailwind
- API responses cached where possible
- Docker multi-stage build for smaller image size

## Security Considerations

- Environment variables stored in `.env.local` (not committed)
- Non-root user in Docker container
- API tokens never exposed in client-side code
- CORS headers configured properly

## Deployment

### Vercel (Recommended for Next.js)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Docker Hub

```bash
docker build -t yourusername/portfolio-website:latest .
docker push yourusername/portfolio-website:latest
```

### Self-hosted

```bash
docker-compose up -d --build
```

## Contributing

Feel free to fork, modify, and improve this project!

## License

ISC

## Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation for each service
- Create an issue in the repository

---

Built with ❤️ using Next.js and Tailwind CSS
