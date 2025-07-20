# Custom Car Collections - Landing Page

A Next.js landing page for collecting customer information for custom car models with database storage and admin dashboard.

## ⚠️ PROPRIETARY SOFTWARE NOTICE

This software is proprietary and confidential information of Trifecta Collections. 
All rights reserved. Unauthorized copying, distribution, or use is strictly prohibited.

**For authorized personnel only.**

## Features

- **Multi-step form** with car details and contact information
- **Database storage** with SQLite + Prisma for production-ready data management
- **Admin dashboard** with authentication for viewing submissions
- **International phone input** with country selector
- **Real-time validation** with visual feedback (green/red borders, success/error messages)
- **Zod validation** for robust form validation on both client and server
- **Email notifications** when forms are submitted
- **File upload support** for car photos with automatic image storage
- **Black and white themed design** with smooth animations

## Recent Updates

### 🎉 **Major Improvements:**
- **✅ Database Migration:** Moved from JSON files to SQLite + Prisma for production-ready storage
- **✅ Admin Authentication:** Secure login system for admin dashboard access
- **✅ International Phone Input:** Country selector with proper validation
- **✅ Enhanced Validation:** Real-time feedback with success/error visual indicators
- **✅ Image Management:** Proper file storage with admin panel image display
- **✅ Environment Cleanup:** Streamlined configuration with consistent variable naming
- **✅ Production Ready:** Database schema, authentication, and deployment guide

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in your configuration (see `.env.example` for required variables)
   - Update email credentials for notifications
   - Set secure admin credentials

4. **For Gmail setup:**
   - Enable 2-factor authentication on your Google account
   - Generate an "App Password" (not your regular password)
   - Add credentials to your `.env.local` file

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   - Main form: [http://localhost:3000](http://localhost:3000)
   - Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

## Form Flow

1. **Step 1 - Car Details:**
   - Choose between entering car name/color OR uploading a photo
   - Select custom base option (Yes/No)
   - Select acrylic display case option (Yes/No)

2. **Step 2 - Contact Information:**
   - Enter name with international phone number (country selector included)
   - Enter email address
   - Real-time validation with success/error feedback

3. **Step 3 - Thank You:**
   - Confirmation page with option to submit another request

## Data Storage & Admin Management

### **Database:**
- **Technology:** SQLite with Prisma ORM for production-ready storage
- **Location:** `dev.db` file (excluded from Git for privacy)
- **Schema:** Structured data with proper relationships and constraints

### **Admin Dashboard:**
- **URL:** `/admin` - Protected admin panel
- **Authentication:** Username/password login (configured in `.env.local`)
- **Features:** 
  - View all customer submissions with images
  - Sort by submission date (newest first)
  - Click images to view full size
  - Secure session management
  - Logout functionality

### **Image Storage:**
- **Location:** `/public/uploads/` directory
- **Format:** Automatic filename generation with timestamps
- **Display:** Images shown in admin panel with click-to-expand
- **Privacy:** Upload directory excluded from Git

### **Data Security:**
- Database and uploads excluded from version control
- Admin authentication required for data access
- Secure password storage in environment variables

## Form Validation

### **Client-Side Validation:**
- **Real-time validation** as user types
- **Visual feedback** with red borders and error messages
- **Smart validation** - either car name/color OR photo required

### **Server-Side Validation:**
- **Zod schemas** for robust data validation
- **API-level validation** prevents invalid data storage
- **Detailed error responses** for debugging

### **Validation Rules:**
- **Name:** 2-50 characters, letters and spaces only
- **Phone:** International format with country selector (validates based on country)
- **Email:** Valid email format required
- **Car Details:** Either name+color OR photo required (either/or validation)
## Customization

### Logo
- Replace the placeholder in `app/components/Logo.tsx`
- Add your logo image to the `public` folder
- Update the component to use your actual logo

### Email Template
- Modify the email content in `app/api/submit-form/route.ts`
- Customize the subject line and email format

### Admin Credentials
- Update admin credentials in environment variables
- Use strong, unique passwords for production

### Database (Production)
- For production, replace SQLite with PostgreSQL or MySQL
- Update database connection string in environment variables
- Run `npx prisma db push` after changing database

## File Structure

```
app/
├── components/
│   ├── LandingPage.tsx      # Main landing page component
│   ├── CarDetailsForm.tsx   # Step 1 form with accordion UI
│   ├── ContactForm.tsx      # Step 2 form with phone input
│   ├── ThankYouPage.tsx     # Step 3 confirmation
│   ├── Logo.tsx             # Logo component
│   └── PhoneInput.css       # Custom styles for phone input
├── admin/
│   ├── page.tsx             # Admin dashboard
│   └── login/
│       └── page.tsx         # Admin login page
├── api/
│   ├── submit-form/
│   │   └── route.ts         # Form submission endpoint
│   ├── get-submissions/
│   │   └── route.ts         # Admin data retrieval
│   └── admin/
│       ├── login/
│       │   └── route.ts     # Admin authentication
│       └── auth/
│           └── route.ts     # Session management
├── lib/
│   └── validation.ts        # Zod validation schemas
├── globals.css              # Global styles
├── layout.tsx               # Root layout
└── page.tsx                 # Main page
prisma/
└── schema.prisma            # Database schema
public/
└── uploads/                 # User uploaded images
```

## Email Configuration Options

### Gmail
- Use Gmail SMTP settings
- Requires App Password setup

### Outlook  
- Use Outlook SMTP settings
- Standard authentication

### Custom SMTP
Contact your email provider for specific SMTP settings.

## Deployment

The app is production-ready and can be deployed to platforms like Vercel, Railway, or any Node.js hosting:

### Environment Variables Setup
Set these environment variables on your hosting platform:
- Database connection string
- Email SMTP configuration  
- Admin authentication credentials

*See `.env.example` for complete list of required variables*

### Database Setup for Production
1. **PostgreSQL (Recommended):**
   - Set up PostgreSQL database
   - Update DATABASE_URL in environment variables

2. **MySQL:**
   - Set up MySQL database  
   - Update DATABASE_URL in environment variables

3. **Deploy steps:**
   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npm run build
   ```

### File Storage
- For production, consider using cloud storage (AWS S3, Cloudinary) for images
- Current local file storage works for smaller deployments

## Troubleshooting

### Email Issues
- If emails aren't sending, check your SMTP credentials
- For Gmail, make sure you're using an App Password, not your regular password
- Verify all SMTP environment variables are correctly set

### Database Issues
- Run `npx prisma generate` if you get Prisma client errors
- Run `npx prisma db push` to sync schema changes
- Check that `DATABASE_URL` is correctly formatted

### Admin Login Issues
- Verify admin credentials in environment variables
- Clear browser cookies if login isn't working
- Check browser console for authentication errors

### General Debugging
- Check the browser console and terminal for error messages
- Ensure all environment variables are properly set
- Verify file permissions for uploads directory

### Phone Input Issues
- If country selector isn't working, check that `react-phone-number-input` styles are loading
- Custom styles are in `app/components/PhoneInput.css`

---

## Legal Information

### Copyright Notice
Copyright (c) 2025 Trifecta Collections. All rights reserved.

### License
This software is proprietary and licensed for use by Trifecta Collections only. 
See the [LICENSE](LICENSE) file for full terms.

### Security
For security vulnerabilities, see [SECURITY.md](SECURITY.md).

### Contributing
Internal development guidelines are available in [CONTRIBUTING.md](CONTRIBUTING.md).

**CONFIDENTIAL:** This software contains proprietary information. Unauthorized 
access, use, or distribution is prohibited and may result in legal action.
