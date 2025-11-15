import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import cookieParser from 'cookie-parser';

// --- Sanity Check Log ---
console.log("---");
console.log("Starting AURA Backend Server - Version 9.1 (Resilient Admin Panel)");
console.log("This version includes a full administrative panel at the root URL.");
console.log("---");

const app = express();
const port = process.env.PORT || 10000;

// --- CONFIGURATION ---
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const DB_PATH = path.join(__dirname, 'db.json');
let ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Gracefully handle missing admin password to prevent server crash
if (!ADMIN_PASSWORD) {
  ADMIN_PASSWORD = 'admin123'; // Set a default password
  console.warn("---");
  console.warn("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! SECURITY WARNING !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.warn("ADMIN_PASSWORD environment variable is not set.");
  console.warn(`Using an insecure default password: "${ADMIN_PASSWORD}"`);
  console.warn("Please set the ADMIN_PASSWORD environment variable in your hosting settings");
  console.warn("for production environments to secure your admin panel.");
  console.warn("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.warn("---");
}

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- IN-MEMORY DATABASE CACHE ---
let MODELS_DATA = [];

// --- DATABASE FUNCTIONS ---
const readDB = async () => {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    MODELS_DATA = JSON.parse(data);
    console.log("Database loaded into memory.");
  } catch (error) {
    console.error("Could not read database file. Initializing with empty array.", error);
    MODELS_DATA = [];
  }
};

const writeDB = async () => {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(MODELS_DATA, null, 2));
  } catch (error) {
    console.error("Error writing to database file:", error);
  }
};

// --- AUTHENTICATION MIDDLEWARE ---
const requireAuth = (req, res, next) => {
  if (req.cookies.token === 'admin_logged_in') {
    next();
  } else {
    // If it's an API request, send 401 Unauthorized. Otherwise, redirect to login.
    if (req.path.startsWith('/api/')) {
       return res.status(401).json({ error: 'Unauthorized' });
    }
    res.redirect('/');
  }
};

// ===================================================================================
// ADMIN PANEL ROUTES
// ===================================================================================

// --- Login Page ---
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Login</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 flex items-center justify-center h-screen">
        <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">AURA Admin Panel</h1>
            <form action="/login" method="POST">
                <div class="mb-4">
                    <label for="password" class="block text-gray-700">Password</label>
                    <input type="password" name="password" id="password" class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500" required>
                </div>
                <button type="submit" class="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">Login</button>
            </form>
        </div>
    </body>
    </html>
  `);
});

// --- Login Handler ---
app.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    // Set a simple cookie for authentication
    res.cookie('token', 'admin_logged_in', { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000 }); // 1 hour
    res.redirect('/admin');
  } else {
    res.status(401).send('Invalid password. <a href="/">Try again</a>.');
  }
});

// --- Logout Handler ---
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});


// --- Admin Dashboard ---
app.get('/admin', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});


// ===================================================================================
// PUBLIC AND PROTECTED API ROUTES
// ===================================================================================

// --- GET ALL MODELS (Public) ---
app.get('/api/models', (req, res) => {
  res.json(MODELS_DATA);
});

// --- ADD NEW MODEL (Protected) ---
app.post('/api/models', requireAuth, async (req, res) => {
    const newModel = req.body;
    // Assign a new unique ID
    newModel.id = `model_${Date.now()}`;
    MODELS_DATA.push(newModel);
    await writeDB();
    res.status(201).json(newModel);
});

// --- UPDATE MODEL (Protected) ---
app.put('/api/models/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const updatedModelData = req.body;
    const modelIndex = MODELS_DATA.findIndex(m => m.id === id);

    if (modelIndex === -1) {
        return res.status(404).json({ error: 'Model not found' });
    }
    
    // Ensure ID is not changed
    updatedModelData.id = id;
    MODELS_DATA[modelIndex] = updatedModelData;
    await writeDB();
    res.json(updatedModelData);
});

// --- DELETE MODEL (Protected) ---
app.delete('/api/models/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const initialLength = MODELS_DATA.length;
    MODELS_DATA = MODELS_DATA.filter(m => m.id !== id);

    if (MODELS_DATA.length === initialLength) {
        return res.status(404).json({ error: 'Model not found' });
    }

    await writeDB();
    res.status(204).send(); // No content
});

// ===================================================================================
// SOCIAL LOGIN ROUTES (Unchanged)
// ===================================================================================
app.get('/api/auth/facebook/callback', async (req, res) => {
  // --- Runtime Environment Variable Check ---
  const FACEBOOK_APP_ID     = process.env.FACEBOOK_APP_ID     || process.env.ID_DO_APLICATIVO_DO_FACEBOOK;
  const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || process.env.SEGREDO_DO_APLICATIVO_FACEBOOK;
  const FRONTEND_URL        = process.env.FRONTEND_URL        || process.env.URL_FRONTEND;
  const BACKEND_URL         = process.env.BACKEND_URL         || process.env.URL_DE_BACKEND;

  const requiredVars = { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FRONTEND_URL, BACKEND_URL };
  const missingVars = Object.keys(requiredVars).filter(key => !requiredVars[key]);

  if (missingVars.length > 0) {
    console.error("--- LOGIN FAILED: SERVER MISCONFIGURATION ---");
    console.error("Missing variables:", missingVars.join(', '));
    return res.redirect(`${FRONTEND_URL || '#'}/#auth_failure?error=server_misconfigured`);
  }

  const { code } = req.query;

  if (req.query.error) {
    console.error('Facebook login denied by user:', req.query.error_description);
    return res.redirect(`${FRONTEND_URL}/#auth_failure`);
  }
  
  if (!code) {
    console.error('Error: No authorization code provided in callback.');
    return res.redirect(`${FRONTEND_URL}/#auth_failure`);
  }
  
  const redirectUri = `${BACKEND_URL}/api/auth/facebook/callback`;
  const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&redirect_uri=${redirectUri}&client_secret=${FACEBOOK_APP_SECRET}&code=${code}`;

  try {
    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();

    if (tokenData.error) throw new Error(tokenData.error.message || 'Failed to get access token.');
    const accessToken = tokenData.access_token;

    const profileUrl = `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`;
    
    const profileResponse = await fetch(profileUrl);
    const profileData = await profileResponse.json();

    if (profileData.error) throw new Error(profileData.error.message || 'Failed to get user profile.');

    const name = encodeURIComponent(profileData.name);
    const email = encodeURIComponent(profileData.email);
    const pic = encodeURIComponent(profileData.picture.data.url);
    
    const successUrl = `${FRONTEND_URL}/#auth_success?name=${name}&email=${email}&pic=${pic}`;
    res.redirect(successUrl);

  } catch (error) {
    console.error('An error occurred during Facebook authentication:', error);
    res.redirect(`${FRONTEND_URL}/#auth_failure`);
  }
});


// ===================================================================================
// START SERVER
// ===================================================================================
app.listen(port, async () => {
  await readDB();
  console.log(`AURA backend server is live and listening on port ${port}`);
  console.log(`Admin panel login available at the root URL.`);
});