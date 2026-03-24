const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dxweglo9y/image/upload/';

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${CLOUDINARY_BASE_URL}${path}`;
};

export const getPdfUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
  return `${baseUrl}/pdfs/${path}`;
};
