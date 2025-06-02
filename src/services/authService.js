// Mock API calls - replace with actual fetch/axios calls to your backend
export const loginUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'admin@example.com' && password === 'password') {
        resolve({
          token: 'fake-jwt-token',
          user: { firstname: 'Admin', lastname: 'User', email: 'admin@example.com' }
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
};

export const registerUser = async (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Registered user (mock):', userData);
      resolve({ message: 'Registration successful' });
    }, 500);
  });
};
