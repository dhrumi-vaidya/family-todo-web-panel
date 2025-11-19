# Deployment Guide - Family Todo Web Panel

## 🚀 Free Hosting Setup

### Prerequisites
- GitHub account (you already have this ✓)
- Email for service registrations

---

## Step 1: Deploy Database (MongoDB Atlas)

1. **Sign up for MongoDB Atlas**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up with your email or Google account

2. **Create a Free Cluster**
   - Choose **FREE** tier (M0 Sandbox)
   - Select a region close to you (e.g., Mumbai for India)
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `familytodo`
   - Password: Generate a strong password (save it!)
   - Database User Privileges: Read and write to any database
   - Click "Add User"

4. **Whitelist IP Addresses**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://familytodo:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password
   - Save this for later!

---

## Step 2: Deploy Backend (Render)

1. **Sign up for Render**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select `family-todo-web-panel` repository
   - Click "Connect"

3. **Configure Web Service**
   - **Name**: `family-todo-backend`
   - **Region**: Choose closest to you
   - **Branch**: `develop`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/app.js`
   - **Instance Type**: `Free`

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable"
   
   Add these variables:
   ```
   MONGODB_URI=mongodb+srv://familytodo:<YOUR_PASSWORD>@cluster0.xxxxx.mongodb.net/family-todo?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string
   PORT=5000
   FRONTEND_URL=https://family-todo-web-panel.vercel.app
   NODE_ENV=production
   ```

5. **Create Web Service**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Your backend URL will be: `https://family-todo-backend.onrender.com`

---

## Step 3: Deploy Frontend (Vercel)

1. **Sign up for Vercel**
   - Go to https://vercel.com/signup
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import `family-todo-web-panel` repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Add Environment Variables**
   Click "Environment Variables"
   
   Add:
   ```
   REACT_APP_API_URL=https://family-todo-backend.onrender.com/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (3-5 minutes)
   - Your frontend URL will be: `https://family-todo-web-panel.vercel.app`

---

## Step 4: Update Backend CORS Settings

After getting your Vercel URL, update the backend:

1. Go to Render dashboard → Your backend service
2. Go to "Environment"
3. Update `FRONTEND_URL` to your actual Vercel URL
4. Click "Save Changes"
5. Service will auto-redeploy

---

## 🎉 Your App is Live!

**Access your application at:** `https://family-todo-web-panel.vercel.app`

### Sharing with Family:
- Share the Vercel URL with family members
- They can register and join your family
- Works on any device with internet!

---

## Alternative: Deploy Everything to Render

If you prefer one platform:

1. **Deploy Backend** (as above)
2. **Deploy Frontend as Static Site**
   - On Render: New → Static Site
   - Repository: `family-todo-web-panel`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

---

## Troubleshooting

### Backend not connecting to MongoDB
- Check MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Verify connection string has correct password
- Check Render logs for errors

### Frontend can't reach Backend
- Verify REACT_APP_API_URL in Vercel environment variables
- Check backend CORS settings allow frontend URL
- Look at browser console for errors

### App shows errors after deployment
- Check Render logs: Dashboard → Service → Logs
- Verify all environment variables are set
- Ensure MongoDB is running and accessible

---

## Maintenance

### Auto-Deploy on Git Push
Both Vercel and Render automatically redeploy when you push to GitHub!

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin develop

# Vercel and Render will auto-deploy!
```

### Monitoring
- **Render**: Check logs in dashboard
- **Vercel**: Analytics in dashboard
- **MongoDB Atlas**: Monitor in Atlas dashboard

---

## Cost

**All FREE for:**
- MongoDB Atlas: 512 MB storage
- Render: 750 hours/month
- Vercel: Unlimited deployments

Perfect for personal/family use! 🎉
