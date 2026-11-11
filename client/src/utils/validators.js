export const emailRegex = /^\S+@\S+\.\S+$/;
export const mobileRegex = /^[6-9]\d{9}$/;
export const nameRegex = /^[a-zA-Z\s]+$/;

export const isValidHttpUrl = (value) => {
  if (typeof value !== 'string' || value.length > 2048) return false;
  try {
    const url = new URL(value.trim());
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      url.hostname.includes('.')
    );
  } catch {
    return false;
  }
};

