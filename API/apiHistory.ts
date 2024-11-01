import axiosClient from './axiosConfig';
export interface History {
    _id?: string;
    accelX: number;
    accelY: number;
    accelZ: number;
    gyroX: number;
    gyroY: number;
    gyroZ: number;
    timestamp: string;
    status: string;
    latitude: number;
    longitude: number;
    address: string;
  }
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    perPage: number;
  }

const apiHistory = {
    createHistory: async (historyData: History): Promise<{ message: string; id: string }> => {
        try {
          const response = await axiosClient.post('/history', historyData);
          return response.data;
        } catch (error) {
          console.error('Error creating history:', error);
          throw error;
        }
      },

    getAllHistory: async (
        page = 1,
        perPage = 10,
        status?: string
      ): Promise<History[]> => {
        try {
          const params = { page, per_page: perPage };
          if (status) params.status = status;
          const response = await axiosClient.get<History[]>('/history', { params });
          return response.data;
        } catch (error) {
          console.error('Error fetching history:', error);
          throw error;
        }
      },

    getHistoryById: async (historyId: string): Promise<History> => {
        try {
          const response = await axiosClient.get<History>(`/history/${historyId}`);
          return response.data;
        } catch (error) {
          console.error('Error fetching history by ID:', error);
          throw error;
        }
      },
};
export default apiHistory;