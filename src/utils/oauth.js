// OAuth utility functions

export const handleOAuthSignup = async (provider, tokenResponse) => {
  try {
    if (provider === 'google') {
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      
      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch user info');
      }
      
      const userInfo = await userInfoResponse.json();
      
      // In production, this would call your backend API
      // For now, we'll store in localStorage
      const userData = {
        id: userInfo.sub || Date.now().toString(),
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        provider: 'google',
        createdAt: new Date().toISOString(),
      };
      
      // Store user in "database" (localStorage for demo)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((u) => u.email === userData.email);
      if (!existingUser) {
        users.push(userData);
      } else {
        // Update existing user
        Object.assign(existingUser, userData);
      }
      localStorage.setItem('users', JSON.stringify(users));
      
      return userData;
    } else if (provider === 'apple') {
      // Apple Sign In requires server-side implementation
      // This is a placeholder that would need to be implemented with Apple's OAuth flow
      throw new Error('Apple Sign In requires server-side setup');
    }
  } catch (error) {
    console.error(`OAuth ${provider} error:`, error);
    throw error;
  }
};

// Server endpoint simulation (for production, replace with actual API calls)
export const createOAuthSession = async (userData) => {
  // In production: POST to /api/auth/session
  // Returns JWT or session cookie
  const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('sessionToken', sessionToken);
  return sessionToken;
};

