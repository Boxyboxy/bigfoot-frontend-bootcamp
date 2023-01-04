import axios from 'axios';
import { BACKEND_URL } from '../configs';

export const httpClient = axios.create({
  baseURL: BACKEND_URL
});
