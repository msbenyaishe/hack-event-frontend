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
  // Use encodeURIComponent bit by bit if it's just the filename, or replace spaces manually if it's a full path
  // Since we use it as /pdfs/${path}, encoding path is best.
  return `${baseUrl}/pdfs/${encodeURIComponent(path)}`;
};
