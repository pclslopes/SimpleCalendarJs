# Deployment Guide

This document explains how to set up automatic NPM publishing for SimpleCalendarJs.

## Setup Requirements

### 1. GitHub Repository Setup
1. Create a GitHub repository for your project
2. Push your code to the repository
3. Update the repository URLs in `package.json`

### 2. NPM Account Setup
1. Create an account at [npmjs.com](https://npmjs.com)
2. Verify your email address
3. Generate an Access Token:
   - Go to npmjs.com → Profile → Access Tokens
   - Click "Generate New Token"
   - Choose "Automation" type
   - Copy the token (you'll need it for GitHub)

### 3. GitHub Secrets Configuration
1. Go to your GitHub repository
2. Navigate to: Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add these secrets:
   - **Name**: `NPM_TOKEN`
   - **Value**: Your NPM access token from step 2

## Deployment Methods

### Method 1: Tag-Based Publishing (Recommended)
The main workflow (`npm-publish.yml`) publishes when you create version tags:

```bash
# Update version in package.json first
npm version patch  # or minor/major
git push origin main
git push origin --tags
```

This will:
- Trigger the GitHub Action
- Publish to NPM automatically
- Create a GitHub release

### Method 2: Auto-Publishing on Main Branch
If you prefer to publish on every commit to main:

1. Rename `.github/workflows/npm-publish-main.yml.example` to `.github/workflows/npm-publish-main.yml`
2. Delete or disable `npm-publish.yml`
3. Update version in `package.json` before each commit you want to publish

## Version Management

### Semantic Versioning
Follow [semver.org](https://semver.org) guidelines:
- **PATCH** (1.0.1): Bug fixes
- **MINOR** (1.1.0): New features (backward compatible)
- **MAJOR** (2.0.0): Breaking changes

### NPM Version Commands
```bash
npm version patch   # 1.0.0 → 1.0.1
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0
```

## Workflow Details

### What happens during deployment:
1. **Checkout**: Downloads your repository code
2. **Setup Node.js**: Installs Node.js 18
3. **Verify Files**: Checks that required files exist
4. **Publish**: Uploads package to NPM
5. **Create Release**: Makes a GitHub release (tag method only)

### Files included in NPM package:
- `js/SimpleCalendarJs.js`
- `css/SimpleCalendarJs.css`
- `LICENSE`
- `README.md`

## Troubleshooting

### Common Issues:
1. **NPM_TOKEN not working**: Make sure it's an "Automation" token
2. **Version already exists**: Update version in package.json
3. **Package name taken**: Change name in package.json
4. **Tests failing**: Add `continue-on-error: true` or fix tests

### Testing Before Publishing:
```bash
# Test package creation locally
npm pack

# This creates a .tgz file you can inspect
```

## Manual Publishing (Backup)
If automation fails, you can publish manually:

```bash
npm login
npm publish
```

## Security Notes
- Never commit NPM tokens to your repository
- Use GitHub Secrets for all sensitive tokens
- Regularly rotate your NPM access tokens
- Consider using 2FA on your NPM account