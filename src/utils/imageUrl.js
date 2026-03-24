import { API_URL } from '../api/axios';

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dxweglo9y/image/upload/';

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${CLOUDINARY_BASE_URL}${path}`;
};

export const getPdfUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_URL}/pdfs/${encodeURIComponent(path)}`;
};
