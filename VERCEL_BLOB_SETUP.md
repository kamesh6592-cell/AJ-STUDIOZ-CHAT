# 🗂️ Vercel Blob Storage Setup Guide

This guide explains how to set up Vercel Blob storage for file uploads (images, PDFs) in your AJ STUDIOZ project.

---

## ❌ Current Issue

**Error:** `Failed to upload file: 500 {"error":"Failed to upload file"}`

**Cause:** Missing `BLOB_READ_WRITE_TOKEN` environment variable

**Solution:** Follow the setup steps below

---

## 🔑 What is Vercel Blob?

Vercel Blob is a simple object storage solution that allows you to:
- Upload images (JPEG, PNG, GIF)
- Upload PDF files
- Store files with automatic CDN distribution
- Access files via fast global URLs

**Features:**
- ✅ Fast global CDN
- ✅ Simple API
- ✅ Automatic compression
- ✅ Secure access control
- ✅ Built-in for Vercel projects

---

## 📦 Pricing

### Free Tier (Hobby Plan)
- **Storage:** 1 GB
- **Bandwidth:** 100 GB/month
- **Uploads:** Unlimited requests

### Pro Plan ($20/month)
- **Storage:** 100 GB
- **Bandwidth:** 1 TB/month
- **Uploads:** Unlimited requests

**For most projects, the FREE tier is sufficient!**

---

## 🚀 Setup Instructions

### Step 1: Create Blob Store in Vercel

1. **Go to Vercel Dashboard:**
   - Navigate to [vercel.com/dashboard](https://vercel.com/dashboard)

2. **Open Storage Tab:**
   - Click on **Storage** in the top navigation
   - Or go to: https://vercel.com/dashboard/stores

3. **Create New Blob Store:**
   - Click **Create Database** or **Create Store**
   - Select **Blob** from the options
   - Click **Continue**

4. **Configure Store:**
   - **Name:** `ajstudioz-blob` (or any name you prefer)
   - **Region:** Choose closest to your users (e.g., `iad1` for US East)
   - Click **Create**

5. **Connect to Project:**
   - After creation, click **Connect Project**
   - Select your project: **meowihh**
   - Choose environment: **Production, Preview, Development** (select all)
   - Click **Connect**

### Step 2: Get Token

After connecting, Vercel automatically adds the `BLOB_READ_WRITE_TOKEN` to your project's environment variables.

**To verify:**
1. Go to your project: **meowihh**
2. Click **Settings** → **Environment Variables**
3. Look for: `BLOB_READ_WRITE_TOKEN`

**Token format:** `vercel_blob_rw_XXXXXXXXXX`

### Step 3: Redeploy

After connecting Blob storage:
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger deployment

---

## 🔧 Manual Setup (Alternative)

If you prefer to set up manually:

### 1. Get Token from Vercel Dashboard

1. Go to Storage → Your Blob Store
2. Click on the store name
3. Go to **Settings** tab
4. Copy the **Read-Write Token**

### 2. Add to Environment Variables

**In Vercel Dashboard:**
```
Key: BLOB_READ_WRITE_TOKEN
Value: vercel_blob_rw_XXXXXXXXXXXXXXXXXXXXXXXXXX
Environments: Production, Preview, Development
```

**For Local Development (.env.local):**
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## ✅ Testing File Upload

After setup, test the upload feature:

### 1. **Visit Your Site:**
   - Go to https://www.meow.ajstudioz.co.in or https://meowihh.vercel.app

### 2. **Start a Conversation:**
   - Click the **image upload** button (📎 icon)
   - Select an image file (JPEG, PNG, GIF, or PDF)

### 3. **Check Upload:**
   - ✅ File should upload successfully
   - ✅ You should see a preview
   - ✅ AI should analyze the image

### 4. **Supported Files:**
   - **Images:** JPEG, PNG, GIF
   - **Documents:** PDF
   - **Max size:** 5 MB per file

---

## 🎯 Current Configuration

Your project is already configured to use Vercel Blob:

### Upload Endpoint
**File:** `app/api/upload/route.ts`

**Features:**
- File validation (type and size)
- Public/authenticated upload separation
- Automatic random suffix
- Error handling with detailed messages

### Validation Rules
```typescript
- Max file size: 5 MB
- Allowed types: JPEG, PNG, GIF, PDF
- Authenticated users: prefix 'auth'
- Public users: prefix 'public'
```

### File Naming
```
Format: mplx/{prefix}.{extension}-{random}
Example: mplx/auth.jpg-abc123xyz
```

---

## 🔍 Verifying Setup

### Check Environment Variables

**In Vercel Dashboard:**
```bash
Settings → Environment Variables → Search for "BLOB"
```

**Should see:**
```
BLOB_READ_WRITE_TOKEN = vercel_blob_rw_****** (Hidden)
```

### Check Blob Store

**In Vercel Dashboard:**
```bash
Storage → Your Blob Store → Files
```

After uploads, you'll see files listed here.

### Check Deployment Logs

**In Vercel Dashboard:**
```bash
Deployments → Latest → Function Logs
```

Look for upload logs when testing.

---

## 🐛 Troubleshooting

### Error: "File upload service not configured"
**Solution:** 
- Add `BLOB_READ_WRITE_TOKEN` to environment variables
- Redeploy the project

### Error: "Failed to upload file: 500"
**Solution:**
- Check if token is valid
- Verify token has read-write permissions
- Check Vercel Blob store status

### Error: "File size should be less than 5MB"
**Solution:**
- Compress the image before uploading
- Use online tools like TinyPNG or ImageOptim

### Error: "File type should be JPEG, PNG, GIF or PDF"
**Solution:**
- Convert file to supported format
- Currently supports: .jpg, .jpeg, .png, .gif, .pdf

### Files not appearing in Blob store
**Solution:**
- Check deployment logs for errors
- Verify token permissions
- Ensure token is in correct environment

---

## 📊 Monitoring Usage

### View Storage Usage

**In Vercel Dashboard:**
```bash
Storage → Your Blob Store → Overview
```

**Metrics shown:**
- Total storage used
- Bandwidth consumed
- Number of files
- Request count

### Set Usage Alerts

1. Go to Storage → Settings
2. Enable usage alerts
3. Set threshold (e.g., 80% of quota)
4. Add email for notifications

---

## 🗑️ Managing Files

### View Files

**In Vercel Dashboard:**
```bash
Storage → Your Blob Store → Files
```

### Delete Files

1. Go to Storage → Files
2. Click on file
3. Click **Delete**
4. Confirm deletion

### Bulk Operations

Use Vercel CLI for bulk operations:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# List files
vercel blob list

# Delete file
vercel blob rm <file-url>
```

---

## 💡 Best Practices

### 1. File Size Optimization
- Compress images before upload
- Use appropriate formats (JPEG for photos, PNG for graphics)
- Consider WebP format for better compression

### 2. Access Control
- Authenticated uploads get `auth` prefix
- Public uploads get `public` prefix
- All files are publicly accessible via URL

### 3. Naming Convention
- Random suffix prevents collisions
- Prefix separates user types
- Extension preserved for compatibility

### 4. Error Handling
- Always check upload response
- Handle network errors gracefully
- Show user-friendly error messages

---

## 📝 Environment Variables Summary

Add these to Vercel:

```bash
# Required for file uploads
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXX

# Optional: Configure in Blob store settings
# BLOB_READ_ONLY_TOKEN=vercel_blob_ro_XXXXXXXXXX
```

---

## 🔗 Useful Links

- **Vercel Blob Docs:** https://vercel.com/docs/storage/vercel-blob
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Storage Dashboard:** https://vercel.com/dashboard/stores
- **Pricing:** https://vercel.com/docs/storage/vercel-blob#pricing

---

## 🎯 Quick Start Checklist

- [ ] Go to Vercel Dashboard → Storage
- [ ] Create new Blob store
- [ ] Connect to **meowihh** project
- [ ] Verify `BLOB_READ_WRITE_TOKEN` in environment variables
- [ ] Redeploy the project
- [ ] Test image upload on website
- [ ] Check uploaded files in Blob store
- [ ] Monitor storage usage

---

## 🆘 Need Help?

**Error still persists after setup?**

1. **Check Vercel Status:** https://vercel-status.com
2. **View Deployment Logs:** Vercel Dashboard → Deployments → Function Logs
3. **Contact Support:** support@ajstudioz.co.in
4. **Vercel Support:** https://vercel.com/support

---

**Last Updated:** November 5, 2025  
**Project:** AJ STUDIOZ  
**File Upload Supported:** Images (JPEG, PNG, GIF) + PDF  
**Max Size:** 5 MB per file
