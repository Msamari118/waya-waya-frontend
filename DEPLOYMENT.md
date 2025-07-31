# WAYA WAYA - Production Deployment Guide

## 🚀 **Deployment URLs**

### **Frontend (Vercel)**
- **Production URL**: https://waya-waya-frontend.vercel.app
- **Repository**: Your Vercel-connected repository

### **Backend (Railway)**
- **Production URL**: https://waya-waya-backend-production.up.railway.app
- **API Base URL**: https://waya-waya-backend-production.up.railway.app/api

## 📋 **Pre-Deployment Checklist**

### ✅ **Environment Variables Setup**

#### **Vercel Frontend Environment Variables**
Set these in your Vercel dashboard under Project Settings > Environment Variables:

```bash
# Core Configuration
VITE_API_BASE_URL=https://waya-waya-backend-production.up.railway.app/api
VITE_ENVIRONMENT=production
VITE_FRONTEND_URL=https://waya-waya-frontend.vercel.app

# Admin Security (Required)
VITE_ADMIN_PASSWORD_HASH=your_hashed_admin_password_here

# Feature Flags
VITE_ENABLE_DEMO_MODE=false
VITE_ENABLE_DEBUG_MODE=false
VITE_ENABLE_ANALYTICS=true

# Payment Gateway (Set when ready)
VITE_PAYMENT_GATEWAY_URL=https://your-payment-gateway.vercel.app
VITE_PAYMENT_PUBLIC_KEY=your_payment_public_key_here

# Chat Service (Set when ready)
VITE_CHAT_SERVICE_URL=https://your-chat-service.vercel.app
VITE_CHAT_API_KEY=your_chat_api_key_here

# File Upload (Set when ready)
VITE_FILE_UPLOAD_URL=https://your-file-upload.vercel.app
VITE_FILE_UPLOAD_API_KEY=your_file_upload_api_key_here

# Email Service (Set when ready)
VITE_EMAIL_SERVICE_URL=https://your-email-service.vercel.app
VITE_EMAIL_API_KEY=your_email_api_key_here

# SMS Service (Set when ready)
VITE_SMS_SERVICE_URL=https://your-sms-service.vercel.app
VITE_SMS_API_KEY=your_sms_api_key_here
```

#### **Railway Backend Environment Variables**
Set these in your Railway dashboard:

```bash
# Database
DATABASE_URL=your_database_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
ADMIN_PASSWORD_HASH=your_hashed_admin_password

# CORS
FRONTEND_URL=https://waya-waya-frontend.vercel.app

# Email Service
EMAIL_SERVICE_API_KEY=your_email_service_key

# SMS Service
SMS_SERVICE_API_KEY=your_sms_service_key

# Payment Gateway
PAYMENT_GATEWAY_SECRET=your_payment_gateway_secret
```

## 🔧 **Deployment Steps**

### **Step 1: Frontend Deployment (Vercel)**

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   ```bash
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Set Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add all variables from the checklist above

4. **Deploy**
   - Vercel will automatically deploy on push to main branch
   - Or manually trigger deployment from dashboard

### **Step 2: Backend Deployment (Railway)**

1. **Connect Repository**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project"
   - Import your backend repository

2. **Configure Environment Variables**
   - Add all backend environment variables from checklist

3. **Set Domain**
   - Railway will provide a default domain
   - Update frontend `VITE_API_BASE_URL` to match

4. **Deploy**
   - Railway will automatically deploy on push to main branch

## 🔒 **Security Configuration**

### **Admin Access Security**
- ✅ Frontend admin button removed
- ✅ Backend authentication required
- ✅ Session-based admin access
- ✅ Two-factor authentication support

### **CORS Configuration**
Ensure your backend allows requests from:
```
https://waya-waya-frontend.vercel.app
```

### **Environment-Specific Features**

#### **Production Features Enabled**
- ✅ Real API calls to Railway backend
- ✅ Admin authentication via backend
- ✅ Payment gateway integration (when configured)
- ✅ File upload services (when configured)
- ✅ Email/SMS notifications (when configured)
- ✅ Analytics tracking
- ✅ Audit logging

#### **Demo Mode Disabled**
- ❌ Mock responses disabled
- ❌ Frontend admin bypass disabled
- ❌ Debug mode disabled

## 📊 **Monitoring & Analytics**

### **Vercel Analytics**
- Enable in Vercel dashboard
- Track user interactions
- Monitor performance

### **Railway Monitoring**
- Monitor backend performance
- Track API response times
- Monitor error rates

## 🚨 **Troubleshooting**

### **Common Issues**

1. **CORS Errors**
   - Ensure backend CORS allows frontend domain
   - Check Railway environment variables

2. **API Connection Issues**
   - Verify `VITE_API_BASE_URL` is correct
   - Check Railway deployment status
   - Test backend health endpoint

3. **Admin Access Issues**
   - Verify admin password hash in environment variables
   - Check backend authentication endpoints
   - Ensure admin routes are protected

4. **Build Failures**
   - Check TypeScript errors locally first
   - Verify all dependencies are installed
   - Check Vercel build logs

### **Debug Commands**

```bash
# Test local build
npm run build

# Check TypeScript errors
npx tsc --noEmit

# Test production build locally
npm run preview

# Check environment variables
echo $VITE_API_BASE_URL
```

## 📈 **Post-Deployment Checklist**

### ✅ **Frontend Verification**
- [ ] Application loads without errors
- [ ] API calls work correctly
- [ ] Admin login functions properly
- [ ] All features work as expected
- [ ] Mobile responsiveness tested
- [ ] Performance optimized

### ✅ **Backend Verification**
- [ ] All API endpoints respond correctly
- [ ] Database connections work
- [ ] Authentication flows work
- [ ] Admin endpoints secured
- [ ] Error handling implemented
- [ ] Logging configured

### ✅ **Integration Testing**
- [ ] User registration/login works
- [ ] Provider registration works
- [ ] Service requests work
- [ ] Booking system works
- [ ] Chat system works
- [ ] Payment system works (when configured)

## 🔄 **Continuous Deployment**

### **Automatic Deployments**
- Frontend: Deploys on push to main branch
- Backend: Deploys on push to main branch
- Environment variables persist across deployments

### **Manual Deployments**
- Frontend: Trigger from Vercel dashboard
- Backend: Trigger from Railway dashboard

## 📞 **Support**

### **Development Team**
- Monitor application performance
- Respond to user feedback
- Implement feature updates
- Maintain security patches

### **Emergency Contacts**
- Backend issues: Check Railway logs
- Frontend issues: Check Vercel logs
- Database issues: Check Railway database logs

---

## 🎉 **Deployment Complete!**

Your WAYA WAYA application is now live at:
- **Frontend**: https://waya-waya-frontend.vercel.app
- **Backend**: https://waya-waya-backend-production.up.railway.app

The application is production-ready with:
- ✅ Secure admin access
- ✅ Real backend integration
- ✅ Environment-specific features
- ✅ Monitoring and analytics
- ✅ Error handling and logging

**Next Steps:**
1. Configure payment gateway
2. Set up email/SMS services
3. Configure file upload services
4. Set up monitoring alerts
5. Plan feature updates 