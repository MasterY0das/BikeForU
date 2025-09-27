# BikeForU - Domain Deployment Guide

## 🚀 Connecting Your App to Your Domain

### Option 1: Vercel Deployment (Recommended)

#### Step 1: Deploy to Vercel
1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy your app**:
   ```bash
   vercel --prod
   ```

#### Step 2: Connect Your Custom Domain
1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your BikeForU project
3. Go to **Settings** → **Domains**
4. Add your custom domain (e.g., `yourdomain.com`)
5. Configure DNS records as instructed by Vercel

#### Step 3: DNS Configuration
Add these DNS records to your domain provider:

**For root domain (yourdomain.com):**
- Type: `A`
- Name: `@`
- Value: `76.76.19.61` (Vercel's IP)

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

---

### Option 2: Netlify Deployment

#### Step 1: Build and Deploy
1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build your app**:
   ```bash
   npm run build
   ```

3. **Deploy to Netlify**:
   ```bash
   netlify deploy --prod --dir=build
   ```

#### Step 2: Connect Custom Domain
1. Go to Netlify dashboard
2. Select your site
3. Go to **Domain settings**
4. Add your custom domain
5. Configure DNS as instructed

---

### Option 3: GitHub Pages + Custom Domain

#### Step 1: Setup GitHub Pages
1. Push your code to GitHub repository
2. Go to repository **Settings** → **Pages**
3. Select source branch (usually `main`)
4. Add your custom domain in the "Custom domain" field

#### Step 2: Configure DNS
Add these records to your domain provider:
- Type: `CNAME`
- Name: `www`
- Value: `yourusername.github.io`

---

### Option 4: Traditional Web Hosting

#### Step 1: Build Production Files
```bash
npm run build
```

#### Step 2: Upload to Hosting
1. Upload all files from the `build/` folder to your web hosting root directory
2. Ensure your hosting supports Single Page Applications (SPA)
3. Configure URL rewrites (see `.htaccess` file created below)

---

## 🔧 Environment Configuration

### Supabase Configuration
Make sure to update your Supabase settings for production:

1. **Update Supabase URL and Keys** in your hosting platform's environment variables:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

2. **Configure Authentication URLs** in Supabase dashboard:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/verify`, `https://yourdomain.com/reset-password`

### Email Configuration
Update email links in your app to use your production domain instead of localhost.

---

## 🛠️ Pre-Deployment Checklist

- [ ] Update Supabase configuration for production
- [ ] Test all email verification flows
- [ ] Verify all routes work correctly
- [ ] Test contact form functionality
- [ ] Check mobile responsiveness
- [ ] Verify SSL certificate is working
- [ ] Test performance and loading speeds

---

## 📞 Support

If you encounter issues during deployment:
1. Check the deployment logs in your hosting platform
2. Verify DNS propagation using tools like `dig` or online DNS checkers
3. Ensure all environment variables are properly set
4. Test locally with `npm run build` and `serve -s build`

---

## 🔗 Useful Commands

```bash
# Test production build locally
npm run build
npx serve -s build

# Check if domain is pointing correctly
nslookup yourdomain.com

# Test SSL certificate
curl -I https://yourdomain.com
```