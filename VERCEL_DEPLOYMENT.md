# 🚀 Deploying to Vercel

I have configured your project to be deployed as a **single unified project** on Vercel. This means both your React frontend and Express backend will run under the same domain.

## 📋 Prerequisites
1. A **MongoDB Atlas** database (see `DEPLOYMENT.md` for setup instructions).
2. A **GitHub** repository with your code pushed to it.

## 🛠️ Deployment Steps

### 1. Push Changes to GitHub
Make sure all the new configuration files are pushed to your repository:
```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin develop
```

### 2. Connect to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** → **"Project"**.
3. Import your `family-todo-web-panel` repository.

### 3. Configure Project Settings
Vercel should automatically detect the settings from `vercel.json`, but ensure the following:
- **Framework Preset**: Other (or Create React App)
- **Root Directory**: Leave as `.` (the project root)

### 4. Add Environment Variables
This is the most important step. Add the following variables in the Vercel dashboard:

| Variable Name | Value |
| :--- | :--- |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A random secret string for security |
| `REACT_APP_API_URL` | `/api` |
| `NODE_ENV` | `production` |

### 5. Deploy!
Click **"Deploy"**. Vercel will build your frontend and set up your backend as serverless functions.

---

## 🔍 How it works
- **Frontend**: Built from the `frontend` folder and served as static files.
- **Backend**: The `backend/src/app.js` file is treated as a serverless function.
- **Routing**: 
  - Any request starting with `/api` is routed to your Express backend.
  - All other requests are routed to your React frontend.
  - This avoids CORS issues since they share the same domain!

## ⚠️ Important Note on MongoDB
Since Vercel uses serverless functions, your database **must** be hosted externally (like MongoDB Atlas). The local MongoDB on your machine will not be accessible from Vercel.

---
**Status:** ✅ Configuration files created. Ready for deployment!
