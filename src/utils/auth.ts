
export const setAccessToken = (token: string) => {
  if (typeof window !== 'undefined') {
    // Set cookie that expires in 1 day (or match token expiry)
    document.cookie = `accessToken=${token}; path=/; max-age=86400; SameSite=Strict`;
    // Also save to localStorage as backup or for easy access if needed
    localStorage.setItem('accessToken', token);
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )accessToken=([^;]+)'));
    if (match) return match[2];
    
    return localStorage.getItem('accessToken');
  }
  return null;
};

export const removeAccessToken = () => {
  if (typeof window !== 'undefined') {
    document.cookie = 'accessToken=; path=/; max-age=0';
    localStorage.removeItem('accessToken');
  }
};
