# Deployment Guide

This guide covers deploying the Event Management Application to various platforms.

## 🚀 Quick Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications and is made by the creators of Next.js.

### Prerequisites
- GitHub account
- Vercel account (free tier available at [vercel.com](https://vercel.com))
- MongoDB Atlas account (free tier available at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/event-management.git
   git push -u origin main
   ```

2. **Set up MongoDB Atlas**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (free tier is fine)
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Whitelist all IPs: Go to Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Import your GitHub repository
   - Configure environment variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     NEXTAUTH_URL=https://your-app-name.vercel.app
     NEXTAUTH_SECRET=generate_a_random_secret_here
     NODE_ENV=production
     ```
   - Click "Deploy"

4. **Generate NEXTAUTH_SECRET**
   ```bash
   openssl rand -base64 32
   ```
   Or use an online generator: [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

5. **Verify Deployment**
   - Visit your deployed URL
   - Test sign up and login
   - Create an event
   - Register for an event

### Update Environment Variables Later
- Go to your project in Vercel
- Settings → Environment Variables
- Add/Edit variables
- Redeploy for changes to take effect

---

## 🌐 Deploy to Netlify

### Prerequisites
- GitHub account
- Netlify account
- MongoDB Atlas account

### Steps

1. **Prepare for Netlify**
   
   Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. **Create `netlify.toml`**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

3. **Deploy**
   ```bash
   netlify login
   netlify init
   netlify deploy --prod
   ```

4. **Set Environment Variables**
   - Go to Site Settings → Build & Deploy → Environment
   - Add all required environment variables
   - Redeploy

---

## 🐳 Deploy with Docker

### Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Create `.dockerignore`

```
node_modules
.next
.git
.env
.env.local
```

### Update `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
}

module.exports = nextConfig
```

### Build and Run

```bash
# Build the image
docker build -t event-management .

# Run the container
docker run -p 3000:3000 \
  -e MONGODB_URI="your_mongodb_uri" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -e NEXTAUTH_SECRET="your_secret" \
  event-management
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/event-management
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your_secret_here
    depends_on:
      - mongodb

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

Run with:
```bash
docker-compose up
```

---

## ☁️ Deploy to AWS

### Using AWS Amplify

1. **Prerequisites**
   - AWS account
   - GitHub repository

2. **Steps**
   - Go to AWS Amplify Console
   - Connect your GitHub repository
   - Configure build settings (auto-detected for Next.js)
   - Add environment variables
   - Deploy

### Using AWS EC2

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - t2.micro for testing (free tier eligible)
   - Configure security group (allow ports 22, 80, 443)

2. **SSH into Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod

   # Install PM2
   sudo npm install -g pm2
   ```

4. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/event-management.git
   cd event-management

   # Install dependencies
   npm install

   # Create .env file
   nano .env
   # Add your environment variables

   # Build application
   npm run build

   # Start with PM2
   pm2 start npm --name "event-management" -- start
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx (Optional)**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/event-management
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable and restart:
   ```bash
   sudo ln -s /etc/nginx/sites-available/event-management /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## 🔧 Environment Variables for Production

**Required:**
```env
MONGODB_URI=your_production_mongodb_uri
NEXTAUTH_URL=https://your-production-domain.com
NEXTAUTH_SECRET=your_secure_random_secret
NODE_ENV=production
```

**Optional:**
```env
# Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Error tracking (e.g., Sentry)
SENTRY_DSN=your_sentry_dsn

# Email service (for future notifications)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Use strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Configure MongoDB to accept connections only from your app
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (Let's Encrypt for free SSL)
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Enable MongoDB backups
- [ ] Set up monitoring and alerts
- [ ] Review and test all API endpoints
- [ ] Implement logging
- [ ] Set up error tracking (Sentry, etc.)

---

## 📊 Monitoring

### Vercel Analytics
- Built-in analytics available in Vercel dashboard
- Shows page views, performance metrics

### Custom Monitoring
Consider adding:
- **Sentry** for error tracking
- **Google Analytics** for user analytics
- **Uptime monitoring** (UptimeRobot, Pingdom)
- **MongoDB Atlas monitoring** for database performance

---

## 🔄 CI/CD

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

---

## 🐛 Troubleshooting

### Common Issues

**1. "Module not found" errors**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

**2. Database connection issues**
- Verify MongoDB URI is correct
- Check if IP is whitelisted in MongoDB Atlas
- Ensure MongoDB service is running

**3. NextAuth errors**
- Verify `NEXTAUTH_URL` matches your domain
- Check `NEXTAUTH_SECRET` is set
- Clear cookies and try again

**4. Build failures**
```bash
# Check Node version
node --version  # Should be 18+

# Check for TypeScript errors
npm run lint

# Try local build
npm run build
```

---

## 📞 Support

For deployment issues:
1. Check the [GitHub Issues](https://github.com/yourusername/event-management/issues)
2. Review Vercel/Netlify deployment logs
3. Check MongoDB Atlas logs
4. Review application logs

---

**Good luck with your deployment! 🚀**

