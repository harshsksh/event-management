# Troubleshooting: Data Not Showing in MongoDB Atlas

## Common Issues and Solutions

### 1. 🔍 Check the Correct Cluster and Database

**Problem**: You might be looking at the wrong cluster or database.

**Solution**:
- Log into [MongoDB Atlas](https://cloud.mongodb.com)
- Click on **"Browse Collections"** in the left sidebar
- Verify you're viewing the correct cluster
- Check the **database name** (should be `event-management`)
- Verify the **collection names** (users, events, rsvps)

### 2. 🎯 Verify Database Name in Connection String

**Problem**: The connection string might be connecting to a different database.

**Check your `.env.local` file**:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-management?retryWrites=true&w=majority
                                                                    ^^^^^^^^^^^^^^^^
                                                                    This is your database name
```

**Solution**:
- Verify the database name in your connection string matches what you're viewing in Atlas
- Default is `event-management` but you can use any name

### 3. 🔄 Refresh the Browser

**Problem**: Sometimes MongoDB Atlas UI doesn't auto-refresh.

**Solution**:
- Click the refresh button in MongoDB Atlas
- Or reopen the "Browse Collections" view

### 4. 🐛 Check if Data is Actually Being Saved

**Test if your connection is working**:

Create a simple test endpoint to verify connection and save test data.

### 5. 📊 Expected Collections

Your application should create these collections:
- **users** - User accounts
- **events** - Events created by organizers
- **rsvps** - Event registrations

### 6. 🚨 Common Connection Issues

#### Issue: Authentication Failed
**Symptoms**: Error messages about authentication

**Solution**:
- Verify username/password in connection string
- Check if your database user has proper permissions
- Re-create database user if needed

#### Issue: Network Access
**Symptoms**: Connection refused or timeout

**Solution**:
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Add `0.0.0.0/0` (Allow access from anywhere)
4. Or add your specific IP

### 7. 🔧 Debug Connection

Add this debug endpoint to check your connection:

```typescript
// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();
    
    const userCount = await User.countDocuments();
    
    return NextResponse.json({
      connected: true,
      database: 'Connected to MongoDB',
      userCount,
      message: 'Database connection successful!'
    });
  } catch (error) {
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
```

Then visit: `http://localhost:3000/api/test-db`

### 8. ✅ Verify Collections Exist

In MongoDB Atlas:
1. Click "Browse Collections"
2. Click "Create Database"
3. Name: `event-management`
4. Or check if collections were created automatically

### 9. 🧪 Test Saving Data

1. **Sign up a new user** via the app
2. **Create an event** (if organizer)
3. **Check MongoDB Atlas** within 30 seconds

### 10. 📝 Check Server Logs

Look at your terminal where `npm run dev` is running:
- Any MongoDB connection errors?
- Any data validation errors?
- Check for any error messages

## Quick Checklist

- [ ] `.env.local` file exists and is configured
- [ ] MongoDB Atlas network access is configured
- [ ] Database user exists and has read/write permissions
- [ ] Connection string is correct (copied from Atlas)
- [ ] You're looking at the correct cluster in Atlas
- [ ] Database name in connection string matches what you're viewing
- [ ] No errors in terminal/console
- [ ] Server is running (`npm run dev`)

## Still Not Working?

1. **Double-check your connection string** from MongoDB Atlas
2. **Verify environment variables are loaded** - add a console log temporarily
3. **Check MongoDB Atlas logs** in the Atlas dashboard
4. **Try connecting with MongoDB Compass** to verify external access works
5. **Restart your development server** after changing `.env.local`

## Expected Behavior

After signing up:
1. Go to MongoDB Atlas
2. Browse Collections → Click on `users` collection
3. You should see user documents with: name, email, password (hashed), role

After creating an event:
1. Browse Collections → Click on `events` collection
2. You should see event documents with: title, description, date, location, organizer, etc.

