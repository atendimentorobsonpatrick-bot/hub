import { User } from '../types';
import { BACKEND_URL } from '../config'; // Import the central URL

type PendingUser = Omit<User, 'verificationStatus' | 'purchaseHistory' | 'verificationDetails' | 'favorites' | 'notifications'>;

// --- FACEBOOK AUTHENTICATION ---
// This is your public App ID. It is safe to have this in the frontend code.
const FACEBOOK_APP_ID = '2976258359251264';

/**
 * Constructs the official Facebook login URL that starts the authentication process.
 * Clicking "Continue with Facebook" redirects the user to our backend, which then
 * securely handles the communication with Facebook.
 */
export const getFacebookLoginUrl = (): string => {
  if (BACKEND_URL.includes('YOUR_BACKEND_URL')) {
    // Provide a helpful error if the developer forgets to change the URL.
    alert('DEVELOPER ERROR: The backend URL has not been set in `src/config.ts`. Facebook login will not work until you deploy the backend and update this URL.');
    // Return a non-functional link to prevent broken redirects.
    return '#'; 
  }
  
  // This is the specific URL on your backend that will handle the response from Facebook.
  // This redirect URI must be added to your Facebook App's settings
  // under "Valid OAuth Redirect URIs".
  const redirectUri = `${BACKEND_URL}/api/auth/facebook/callback`;
  
  const scope = 'email,public_profile';

  return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;
};


// This mock function is kept for the Google login example, which is not fully
// implemented with a backend flow in this version.
export const loginWithFacebookMock = async (): Promise<PendingUser> => {
  console.log("Simulating Facebook login flow...");
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

  const mockUser: PendingUser = {
    name: 'Felicia Booke',
    email: 'felicia.booke@example.com',
    profilePic: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=400&auto.format&fit=crop',
  };
  
  return mockUser;
};


// --- GOOGLE AUTHENTICATION ---

// This function simulates a call to our backend, which would then securely
// interact with the Google API. The real flow is not implemented in this version.
export const loginWithGoogle = async (): Promise<PendingUser> => {
  console.log("Simulating Google login flow...");
  // The real flow is similar to Facebook: redirect to a Google URL with a Client ID,
  // get a temporary code back, and send that code to your backend.
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

  const mockUser: PendingUser = {
    name: 'Gia Starr',
    email: 'gia.starr@example.com',
    profilePic: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=400&auto.format&fit=crop',
  };

  return mockUser;
};