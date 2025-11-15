import { Model } from '../types';
import { BACKEND_URL } from '../config'; // Import the central URL

/**
 * Fetches all models from the live backend server.
 */
export const getModels = async (): Promise<Model[]> => {
  // In a real app, this would be a fetch() call to a backend API.
  // This is now a real fetch call.
  if (BACKEND_URL.includes('YOUR_BACKEND_URL')) {
    console.error('DEVELOPER ERROR: The backend URL has not been set in `src/config.ts`. The app will not be able to load model data.');
    // Return an empty array to prevent a crash, the UI will show a loading state.
    return [];
  }
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/models`);
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }
    const data: Model[] = await response.json();
    return data;
  } catch (error) {
    console.error("Could not fetch models from the backend:", error);
    // Propagate the error or return an empty array so the app can handle it gracefully.
    throw error;
  }
};