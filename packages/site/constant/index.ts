export const mockApiBaseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://chan-mock-api.netlify.app'
    : 'http://localhost:8888';
