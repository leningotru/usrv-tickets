import axios from 'axios';
import { dataMock } from '../infraestructure/interface';

export const mockApi = async (id: number): Promise<dataMock> => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/v1/status/${id}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching data for id #${id}`);
  }
};
