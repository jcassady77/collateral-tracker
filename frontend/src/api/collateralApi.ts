import axios from 'axios';

const API_URL = 'http://localhost:8080/api/collateral';

export interface CollateralItem {
  id?: string;
  name: string;
  value: number;
  appraisalDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollateralHistory {
  id: string;
  collateralItemId: string;
  fieldName: string;
  oldValue: any;
  newValue: any;
  changedAt: string;
}

export const getAllCollateralItems = async (): Promise<CollateralItem[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getCollateralItemById = async (id: string): Promise<CollateralItem> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const getCollateralItemByName = async (name: string): Promise<CollateralItem> => {
  const response = await axios.get(`${API_URL}/search?name=${encodeURIComponent(name)}`);
  return response.data;
};

export const createCollateralItem = async (item: CollateralItem): Promise<CollateralItem> => {
  const response = await axios.post(API_URL, item);
  return response.data;
};

export const updateCollateralItem = async (id: string, item: CollateralItem): Promise<CollateralItem> => {
  const response = await axios.put(`${API_URL}/${id}`, item);
  return response.data;
};

export const getCollateralHistory = async (id: string): Promise<CollateralHistory[]> => {
  const response = await axios.get(`${API_URL}/${id}/history`);
  return response.data;
};
