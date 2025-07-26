# Deployment Guide - Personal Finance Tracker

This guide will help you deploy your Personal Finance Tracker to GitHub Pages and set it up for mobile usage.

## 🚀 GitHub Pages Deployment

### Prerequisites

1. **GitHub Account**: Make sure you have a GitHub account
2. **Repository**: Your code should be in a GitHub repository
3. **Node.js**: Version 18 or higher installed locally

### Step 1: Update Configuration

1. **Update package.json homepage**
   ```bash
   # Replace 'yourusername' with your actual GitHub username
   # The repository name should match your actual repository name
   ```
   
   In `package.json`, update the homepage field:
   ```json
   {
     "homepage": "https://yourusername.github.io/lovablenet-worth"
   }
   ```

2. **Update Supabase Configuration**
   - Your Supabase credentials are already configured in `src/integrations/supabase/client.ts`
   - Make sure your Supabase project is active and accessible

### Step 2: Configure GitHub Pages

1. **Go to your repository on GitHub**
2. **Navigate to Settings > Pages**
3. **Configure the source**:
   - Source: "Deploy from a branch"
   - Branch: "gh-pages"
   - Folder: "/ (root)"
4. **Click Save**

### Step 3: Configure Supabase for Production

1. **Go to your Supabase dashboard**
2. **Navigate to Authentication > Settings**
3. **Update Site URL**:
   ```
   https://yourusername.github.io/lovablenet-worth
   ```
4. **Add to Redirect URLs**:
   ```
   https://yourusername.github.io/lovablenet-worth/**
   ```
5. **Save the changes**

### Step 4: Deploy

1. **Run the deployment script**:
   ```bash
   npm run deploy
   ```
   
   Or manually:
   ```bash
   npm run build
   npx gh-pages -d dist
   ```

2. **Wait for deployment**:
   - GitHub Pages typically takes 2-3 minutes to build
   - You can monitor the deployment in the Actions tab

3. **Verify deployment**:
   - Visit your deployed site
   - Test authentication
   - Test all functionality

### Step 5: Troubleshooting

**If deployment fails**:
1. Check the GitHub Actions logs
2. Ensure all dependencies are in `package.json`
3. Verify TypeScript compilation passes locally
4. Check that the build generates a `dist` folder

**If authentication doesn't work**:
1. Verify Supabase redirect URLs are correct
2. Ensure HTTPS is enabled (GitHub Pages uses HTTPS)
3. Check browser console for errors

## 📱 Mobile Usage

### Local Development on Mobile

1. **Find your local IP address**:
   ```bash
   # On Windows
   ipconfig
   
   # On Mac/Linux
   ifconfig
   ```
   
   Look for your local IP (usually starts with 192.168.x.x or 10.0.x.x)

2. **Start development server**:
   ```bash
   npm run dev
   ```
   
   The server will start on `http://0.0.0.0:8080`

3. **Access on mobile**:
   - Ensure your mobile device is on the same WiFi network
   - Open browser and navigate to: `http://YOUR_LOCAL_IP:8080`
   - Example: `http://192.168.1.100:8080`

### PWA Installation

#### Android (Chrome)
1. Visit the deployed site in Chrome
2. Tap the menu (⋮) in the top right
3. Select "Add to Home screen"
4. Follow the prompts to install

#### iOS (Safari)
1. Visit the deployed site in Safari
2. Tap the share button (□↑)
3. Select "Add to Home Screen"
4. Follow the prompts to install

#### Desktop (Chrome)
1. Visit the deployed site in Chrome
2. Look for the install icon in the address bar
3. Click to install the PWA

### Mobile Features

- **Touch-friendly interface**: All buttons and inputs are optimized for touch
- **Responsive design**: Works on all screen sizes
- **Offline support**: Can view cached data without internet
- **App-like experience**: Full-screen when installed
- **Orientation support**: Works in portrait and landscape

## 🔧 Advanced Configuration

### Custom Domain

If you want to use a custom domain:

1. **Add custom domain in GitHub Pages settings**
2. **Update package.json homepage**:
   ```json
   {
     "homepage": "https://yourdomain.com"
   }
   ```
3. **Update Supabase redirect URLs**:
   ```
   https://yourdomain.com/**
   ```
4. **Redeploy**:
   ```bash
   npm run deploy
   ```

### Environment Variables

For production, you might want to use environment variables:

1. **Create a `.env.production` file**:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Update the Supabase client** to use environment variables:
   ```typescript
   const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "your_fallback_url";
   const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "your_fallback_key";
   ```

### Performance Optimization

1. **Enable compression** in your web server
2. **Use a CDN** for static assets
3. **Optimize images** before deployment
4. **Enable caching** headers

## 🚨 Common Issues

### Build Issues

**Error: Module not found**
- Run `npm install` to ensure all dependencies are installed
- Check that all imports are correct

**Error: TypeScript compilation failed**
- Run `npm run lint` to check for TypeScript errors
- Fix any type errors before deploying

### Runtime Issues

**Authentication not working**
- Check Supabase redirect URLs
- Ensure HTTPS is enabled
- Check browser console for errors

**Mobile app not installing**
- Verify PWA manifest is valid
- Check that service worker is registered
- Ensure HTTPS is enabled (required for PWA)

**Local mobile access not working**
- Check firewall settings
- Ensure devices are on same network
- Try using `0.0.0.0` instead of `::` in vite config

### Performance Issues

**Slow loading**
- Check bundle size with `npm run build`
- Optimize images and assets
- Enable compression

**Mobile performance**
- Test on actual devices
- Use Chrome DevTools mobile simulation
- Check for memory leaks

## 📞 Support

If you encounter issues:

1. **Check the logs**: Look at browser console and network tab
2. **Verify configuration**: Ensure all URLs and settings are correct
3. **Test locally**: Make sure everything works locally first
4. **Check documentation**: Refer to this guide and README.md

## 🔄 Updates and Maintenance

### Updating the App

1. **Make your changes locally**
2. **Test thoroughly**
3. **Deploy**:
   ```bash
   npm run deploy
   ```

### Monitoring

- **Check GitHub Pages status** in repository settings
- **Monitor Supabase usage** in your dashboard
- **Test functionality** regularly on different devices

---

Your Personal Finance Tracker is now ready for production use! 🎉 