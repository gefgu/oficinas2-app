import { Trajectory } from "@/components/MapComponent";

const API_BASE_URL = "http://192.168.1.83:8000";
const TIMEOUT_MS = 5000; // 10 seconds timeout

export interface ApiTrajectoryResponse {
  // Define the structure based on what your API returns from get_sample_trajectories()
  // You might need to adjust this based on the actual response structure
  trajectories?: Trajectory[];
  [key: string]: any;
}

// Helper function to create a fetch with timeout
const fetchWithTimeout = (url: string, options: RequestInit = {}, timeout = TIMEOUT_MS): Promise<Response> => {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error(`Request timeout after ${timeout}ms`)), timeout)
    )
  ]);
};

export class ApiService {
  static async fetchTrajectories(): Promise<Trajectory[]> {
    try {
      console.log('Fetching trajectories from API...');
      console.log('API URL:', `${API_BASE_URL}/trajectories/`);

      const startTime = Date.now();
      
      // Use the correct endpoint from your FastAPI server
      const response = await fetchWithTimeout(`${API_BASE_URL}/trajectories/`, { 
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const endTime = Date.now();
      console.log(`Request completed in ${endTime - startTime}ms`);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      // Since your API returns the data directly from get_sample_trajectories()
      // you might need to adjust this based on the actual structure
      if (Array.isArray(data)) {
        return data as Trajectory[];
      } else if (data.trajectories) {
        return data.trajectories;
      } else {
        console.warn('Unexpected API response structure:', data);
        return [];
      }
      
    } catch (error) {
      console.error('Failed to fetch trajectories:', error);
      
      // More detailed error logging
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
      }
      
      // Re-throw the error so the UI can handle it properly
      throw error;
    }
  }

  // Add a simple health check method
  static async healthCheck(): Promise<boolean> {
    try {
      console.log('Performing health check...');
      const response = await fetchWithTimeout(`${API_BASE_URL}/`, { method: "GET" }, 5000);
      const isHealthy = response.ok;
      console.log('Health check result:', isHealthy);
      return isHealthy;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}