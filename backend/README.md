# AURA Backend Deployment Guide

This folder contains the secure backend server for your AURA application. It has two primary jobs:
1.  **Serve Application Data**: It provides all model information to the frontend via a public API.
2.  **Provide an Admin Panel**: It hosts a password-protected administrative dashboard for you to manage your content.
3.  **Handle Social Login**: It manages the secure authentication flow with services like Facebook.

---

### ⭐ How to Manage Your Content (Admin Panel)

Your website's content (models, products, reviews, etc.) is now managed through a visual, password-protected admin panel.

1.  **Go to your backend's public URL** (e.g., `https://your-backend.onrender.com`). You will see a login page.
2.  **Enter the password**. If you have not set your own password, the default is `admin123`.
3.  Once logged in, you can **add, edit, and delete models** using a simple web interface.
4.  Changes you make are saved automatically and will appear on your live frontend website after a minute or two.

> [!IMPORTANT]
> For security, it is **highly recommended** that you set your own secret password by adding an `ADMIN_PASSWORD` environment variable in your backend service settings on Render (see "Final Deployment" section below).

---

### 🚀 Final Deployment & Configuration

Follow these steps to deploy and configure your backend.

#### Step 1: Deploy the Backend on Render

1.  Go to your [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect the repository where you have stored your project.
4.  On the configuration screen, fill in the details **exactly** as follows:
    -   **Name**: `aura-backend` (or a name of your choice)
    -   **Root Directory**: `backend`
    -   **Build Command**: `npm install`
    -   **Start Command**: `node index.js`
5.  Click **Create Web Service**.
6.  Once deployed, **copy the public URL** for your backend (e.g., `https://aura-backend-xyz.onrender.com`).

#### Step 2: Connect Your Frontend and Backend

This is a critical step. The application will not load data or allow logins until you do this.

1.  In your code editor, open the file `src/config.ts`.
2.  Find the `BACKEND_URL` constant and **paste your live backend URL** from Step 1.
    ```typescript
    // src/config.ts
    export const BACKEND_URL = 'https://aura-backend-xyz.onrender.com';
    ```
3.  Commit and push this change to your repository. This will start a new deployment for your frontend.

#### Step 3: Set Your Environment Variables on Render

1.  Go back to your `aura-backend` service on Render.
2.  Click the **Environment** tab.
3.  Click **"Add Environment Variable"** and add the following **five** key-value pairs.

| Key (must be exact)   | Value (paste your own values)                              |
| --------------------- | ---------------------------------------------------------- |
| `ADMIN_PASSWORD`      | **(Optional but Recommended)** A strong, secret password for your admin panel. |
| `FACEBOOK_APP_ID`     | `2976258359251264`                                         |
| `FACEBOOK_APP_SECRET` | `56f66675d81262162d6571a0f3301803`                          |
| `FRONTEND_URL`        | The public URL of your **frontend** (e.g., `https://your-project.onrender.com`) |
| `BACKEND_URL`         | The public URL of your **backend** (e.g., `https://aura-backend-xyz.onrender.com`) |

4.  Click **Save Changes**. This will trigger a final redeployment of your backend with the new settings.

Your setup is now complete! You can now log in to your admin panel at your backend URL.