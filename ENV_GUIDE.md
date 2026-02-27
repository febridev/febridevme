# Environment Variables Guide

Panduan lengkap untuk setup environment variables yang diperlukan oleh aplikasi portfolio website.

## Overview

Environment variables digunakan untuk menyimpan credentials dan konfigurasi sensitif yang tidak boleh di-commit ke git. Semua environment variables tersimpan di file `.env.local` yang sudah di-ignore di `.gitignore`.

## Environment Variables

### GitHub Configuration

#### NEXT_PUBLIC_GITHUB_USERNAME
- **Type**: String
- **Required**: Yes
- **Example**: `febridev`
- **Description**: Username GitHub Anda
- **Visible**: Client-side (prefix `NEXT_PUBLIC_`)

#### GITHUB_ACCESS_TOKEN
- **Type**: String
- **Required**: Recommended (untuk rate limit yang lebih tinggi)
- **Example**: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Description**: Personal access token dari GitHub untuk autentikasi API
- **Visible**: Server-side only
- **How to get**:
  1. Go to https://github.com/settings/tokens/new
  2. Scroll down dan klik "Generate new token (classic)"
  3. Give it a name (e.g., "Portfolio Website")
  4. Select scopes:
     - ✓ `public_repo` - Access public repositories
     - ✓ `read:user` - Read public user data
  5. Click "Generate token"
  6. Copy token langsung (hanya sekali tampil)

### Medium Configuration

#### NEXT_PUBLIC_MEDIUM_USERNAME
- **Type**: String
- **Required**: Yes (untuk Medium integration)
- **Example**: `your_medium_username`
- **Description**: Username Medium Anda (tanpa @)
- **Visible**: Client-side (prefix `NEXT_PUBLIC_`)
- **Note**: Medium harus public profile

#### MEDIUM_API_KEY
- **Type**: String
- **Required**: No (Medium menggunakan RSS feed)
- **Description**: API key Medium (optional, tidak digunakan saat ini)
- **Visible**: Server-side only

### LinkedIn Configuration

#### LINKEDIN_ACCESS_TOKEN
- **Type**: String
- **Required**: No (LinkedIn integration masih placeholder)
- **Description**: Access token dari LinkedIn
- **Visible**: Server-side only
- **How to get**:
  1. Go to https://www.linkedin.com/developers/apps
  2. Create new app
  3. Configure OAuth 2.0 settings
  4. Get access token dari authentication
  5. **Note**: Proses approval bisa memakan waktu

### Application Configuration

#### NEXT_PUBLIC_APP_URL
- **Type**: String
- **Required**: No (default: `http://localhost:3000`)
- **Example**: `http://localhost:3000`
- **Description**: URL aplikasi untuk development/production
- **Visible**: Client-side (prefix `NEXT_PUBLIC_`)
- **Usage**: Untuk base URL API calls jika diperlukan

## Setup Instructions

### 1. Copy Template File

```bash
cp .env.example .env.local
```

### 2. Edit Environment Variables

Buka `.env.local` di editor favorit Anda:

```bash
# macOS/Linux
nano .env.local
# atau
vim .env.local
# atau
code .env.local

# Windows
notepad .env.local
```

### 3. Fill in Your Credentials

```env
# GitHub API - WAJIB
NEXT_PUBLIC_GITHUB_USERNAME=your_actual_github_username
GITHUB_ACCESS_TOKEN=your_actual_github_token

# Medium API - WAJIB (untuk Medium integration)
NEXT_PUBLIC_MEDIUM_USERNAME=your_actual_medium_username
MEDIUM_API_KEY=optional_not_needed

# LinkedIn API - OPTIONAL
LINKEDIN_ACCESS_TOKEN=your_linkedin_token_if_setup

# App Config - OPTIONAL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Verify Setup

```bash
# Check that file exists
ls -la .env.local

# Verify content (jangan commit!)
cat .env.local
```

## Getting API Credentials

### GitHub Token

#### Step-by-step:

1. **Open Token Settings**
   - Go to: https://github.com/settings/tokens/new
   - Or: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Create New Token**
   - Click "Generate new token (classic)"

3. **Configure Token**
   - Token name: `Portfolio Website`
   - Expiration: Choose (e.g., No expiration)
   - Scopes: Select:
     - ✓ `public_repo` - Allows access to public repositories
     - ✓ `read:user` - Read public user profile data

4. **Generate & Copy**
   - Click "Generate token"
   - Copy token immediately (akan hilang jika halaman ditutup)

5. **Add to .env.local**
   ```env
   GITHUB_ACCESS_TOKEN=ghp_your_token_here
   ```

#### Rate Limits:
- Without token: 60 requests/hour
- With token: 5,000 requests/hour
- Per repository route: 5,000/hour per token

### Medium Username

#### Step-by-step:

1. **Go to Your Medium Profile**
   - Visit: https://medium.com/@your_username

2. **Copy Username**
   - Your Medium username dari URL (tanpa @)
   - Example: URL `https://medium.com/@febridev` → username `febridev`

3. **Add to .env.local**
   ```env
   NEXT_PUBLIC_MEDIUM_USERNAME=febridev
   ```

#### Important:
- ✓ Profile harus **public** (bukan private)
- ✓ Artikel akan di-fetch dari RSS feed
- ✓ Tidak perlu API key untuk Medium

### LinkedIn Token (Optional)

#### Step-by-step:

1. **Register Developer App**
   - Go to: https://www.linkedin.com/developers/apps
   - Click "Create app"

2. **Fill App Details**
   - App name: `Portfolio Website`
   - LinkedIn Page: Select existing atau create new
   - App logo: Upload atau skip
   - Legal agreement: Accept

3. **Configure OAuth**
   - Authorized redirect URLs: `http://localhost:3000/api/auth/callback`
   - Sign in email address: Your email

4. **Get Credentials**
   - Go to "Auth" tab
   - Copy "Access Token"
   - Or request from LinkedIn

5. **Add to .env.local**
   ```env
   LINKEDIN_ACCESS_TOKEN=your_token_here
   ```

#### Important:
- ⚠️ LinkedIn API requires official approval
- ⚠️ Setup process bisa memakan waktu (days/weeks)
- ✓ Currently adalah placeholder di aplikasi

## Environment Variables by Environment

### Development (.env.local)

```env
# GitHub
NEXT_PUBLIC_GITHUB_USERNAME=your_dev_username
GITHUB_ACCESS_TOKEN=your_dev_token

# Medium
NEXT_PUBLIC_MEDIUM_USERNAME=your_dev_medium

# LinkedIn
LINKEDIN_ACCESS_TOKEN=your_dev_linkedin

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production (.env.production)

```env
# GitHub
NEXT_PUBLIC_GITHUB_USERNAME=your_prod_username
GITHUB_ACCESS_TOKEN=your_prod_token_with_high_limit

# Medium
NEXT_PUBLIC_MEDIUM_USERNAME=your_prod_medium

# LinkedIn
LINKEDIN_ACCESS_TOKEN=your_prod_linkedin

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Docker Environment

### docker-compose.yml

Environment variables dipass ke container via file atau inline:

```yaml
environment:
  - NEXT_PUBLIC_GITHUB_USERNAME=${NEXT_PUBLIC_GITHUB_USERNAME}
  - GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN}
  - NEXT_PUBLIC_MEDIUM_USERNAME=${NEXT_PUBLIC_MEDIUM_USERNAME}
  - NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Running Docker with .env.local

```bash
# Automatically loads from .env.local
docker-compose up --build

# Or manually pass env file
docker-compose --env-file .env.local up --build
```

## Security Best Practices

### DO ✓
- ✓ Keep `.env.local` in `.gitignore` (already done)
- ✓ Use different tokens for dev/prod
- ✓ Rotate tokens regularly
- ✓ Use minimal required scopes
- ✓ Store backup of tokens securely
- ✓ Use environment-specific configs

### DON'T ✗
- ✗ Never commit `.env.local` to git
- ✗ Never share tokens in chat/email/public
- ✗ Never use personal tokens in production
- ✗ Never log sensitive values
- ✗ Never hardcode credentials
- ✗ Don't expose server-side vars to client

## Client-side vs Server-side Variables

### Client-side (Visible in Browser)
- Variables with `NEXT_PUBLIC_` prefix
- Examples:
  - `NEXT_PUBLIC_GITHUB_USERNAME`
  - `NEXT_PUBLIC_MEDIUM_USERNAME`
  - `NEXT_PUBLIC_APP_URL`

### Server-side (Hidden from Browser)
- Variables without `NEXT_PUBLIC_` prefix
- Only available in:
  - API routes (`/api/*`)
  - Server components
  - build-time scripts
- Examples:
  - `GITHUB_ACCESS_TOKEN`
  - `LINKEDIN_ACCESS_TOKEN`
  - `MEDIUM_API_KEY`

## Troubleshooting

### Variable is undefined

**Problem**: Getting `undefined` when accessing variable

**Solutions**:
```bash
# 1. Check .env.local exists
ls -la .env.local

# 2. Verify format (no spaces around =)
CORRECT: GITHUB_ACCESS_TOKEN=value
WRONG:   GITHUB_ACCESS_TOKEN = value

# 3. Restart dev server
# Kill npm run dev and run again

# 4. For Docker, check env passed correctly
docker-compose config | grep GITHUB_ACCESS_TOKEN
```

### Token not working

**Problem**: Token invalid or expired

**Solutions**:
```bash
# 1. Verify token is correct
cat .env.local | grep TOKEN

# 2. Check token hasn't expired
# GitHub tokens: Settings → Developer settings → Personal access tokens

# 3. Verify token has correct scopes
# GitHub: https://github.com/settings/tokens/<token-id>

# 4. Test API manually
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/user
```

### Port issues in Docker

**Problem**: Can't connect to localhost:3000

**Solution**: Edit `NEXT_PUBLIC_APP_URL` in docker-compose:
```yaml
environment:
  - NEXT_PUBLIC_APP_URL=http://localhost:3001
ports:
  - "3001:3000"
```

## Variable Reference

| Variable | Type | Required | Server-side | Purpose |
|----------|------|----------|-------------|---------|
| `NEXT_PUBLIC_GITHUB_USERNAME` | String | Yes | Client | GitHub username |
| `GITHUB_ACCESS_TOKEN` | String | Recommended | Server | GitHub API auth |
| `NEXT_PUBLIC_MEDIUM_USERNAME` | String | Yes* | Client | Medium username |
| `MEDIUM_API_KEY` | String | No | Server | Medium API (unused) |
| `LINKEDIN_ACCESS_TOKEN` | String | No | Server | LinkedIn API auth |
| `NEXT_PUBLIC_APP_URL` | String | No | Client | App base URL |

\* Required if using Medium integration

## Next Steps

1. **Setup GitHub Token**
   - Go to https://github.com/settings/tokens/new
   - Create token with required scopes
   - Copy and paste to `.env.local`

2. **Add Your Medium Username**
   - Your Medium @username (without @)
   - Ensure profile is public

3. **Test Configuration**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   # Check if repos and articles load
   ```

4. **Verify Security**
   ```bash
   # Ensure .env.local is in .gitignore
   cat .gitignore | grep env.local
   
   # Never commit secrets
   git status
   ```

5. **For Production**
   - Create `.env.production`
   - Use production tokens/credentials
   - Update `NEXT_PUBLIC_APP_URL` to your domain

## Support

- Environment variables not loading? Check `.env.local` format
- Token errors? Verify token scopes and expiration
- Need help? See SETUP.md or README.md

---

Sekarang `.env.local` siap diisi dengan credentials Anda yang sebenarnya!
