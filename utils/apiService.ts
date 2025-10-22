import { Trajectory } from "@/components/BaseMap";

// Get API URL from environment variable with fallback
let API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.1.83:8000";
const TIMEOUT_MS = 5000;

// Log the API URL being used (helpful for debugging)
console.log('API Base URL:', API_BASE_URL);

export interface ApiTrajectoryResponse {
  visits: VisitData[];
  trajectory: TrajectoryData[];
}

export interface VisitData {
  uid: number;
  visit_number: number;
  arrive_time: string;
  depart_time: string;
  latitude: number;
  longitude: number;
  purpose: string | null;
  mode_of_transport: string | null;
  validated: boolean;
  created_at?: string;
}

export interface TrajectoryData {
  uid: number;
  trip_number: number;
  trajectory_points: TrajectoryPoint[];
  point_count: number;
  start_time: string;
  end_time: string;
}

export interface TrajectoryPoint {
  uid: number;
  latitude: number;
  longitude: number;
  timestamp: string;
  visit_number: number;
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
  static getBaseUrl(): string {
    return API_BASE_URL;
  }

  static setBaseUrl(url: string): void {
    // Remove trailing slash if present
    API_BASE_URL = url.endsWith('/') ? url.slice(0, -1) : url;
    console.log('API Base URL updated to:', API_BASE_URL);
  }

  static async fetchTrajectories(): Promise<{ visits: VisitData[], trajectories: Trajectory[] }> {
    try {
      console.log('Fetching trajectories from API...');
      console.log('API URL:', `${API_BASE_URL}/trajectories/`);

      const startTime = Date.now();
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/trajectories/`, { 
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const endTime = Date.now();
      console.log(`Request completed in ${endTime - startTime}ms`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      
      const data: ApiTrajectoryResponse = await response.json();
      console.log('API Response:', data);
      
      // Convert server data to app format
      // Note: API uses trip_number in trajectory but visit_number in visits
      // trip_number corresponds to the destination visit (trip_number N = trajectory TO visit N)
      const trajectories: Trajectory[] = data.trajectory.map((traj, index) => ({
        id: `${traj.uid}-${traj.trip_number}`,
        uid: traj.uid,
        trip_number: traj.trip_number,
        coordinates: traj.trajectory_points.map(point => ({
          latitude: point.latitude,
          longitude: point.longitude,
        })),
        color: this.getTrajectoryColor(index),
        mode: data.visits.find(v => v.uid === traj.uid && v.visit_number === traj.trip_number)?.mode_of_transport || 'UNKNOWN',
        startTime: traj.start_time,
        endTime: traj.end_time,
      }));

      return {
        visits: data.visits,
        trajectories: trajectories
      };
      
    } catch (error) {
      console.log('Failed to fetch trajectories:', error);
      throw error;
    }
  }

  static async updateVisits(visits: VisitData[]): Promise<void> {
    try {
      console.log('Updating visits:', visits);
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/trajectories/`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visits })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Update response:', result);
      
    } catch (error) {
      console.log('Failed to update visits:', error);
      throw error;
    }
  }

  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/`, { 
        method: "GET" 
      }, 3000);
      return response.ok;
    } catch (error) {
      console.log('Health check failed:', error);
      return false;
    }
  }

  private static getTrajectoryColor(index: number): string {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    return colors[index % colors.length];
  }
}