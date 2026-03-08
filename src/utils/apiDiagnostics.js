// API Diagnostics - Check authentication status
// Run this in browser console: window.checkApiAuth()
import tokenManager from '../services/api/tokenManager.js';

export const checkApiAuth = () => {
  console.log('🔍 API Authentication Diagnostics (In-Memory Token Manager)');
  console.log('===========================================================');
  
  const status = tokenManager.getStatus();
  
  console.log('📋 Token Status (In-Memory):');
  console.log('   - User Token:', status.hasToken ? `✅ Found (${status.token})` : '❌ Not found');
  console.log('   - Public API Key:', status.hasPublicKey ? `✅ Set (${status.publicKey})` : '❌ Not set');
  console.log('   - Active Auth Token:', status.hasAuth ? `✅ ${status.authToken}` : '❌ None');
  
  // Check API base URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://java.api.curebasket.com/backend';
  console.log('');
  console.log('📋 API Configuration:');
  console.log('   - Base URL:', baseUrl);
  console.log('   - Storage: In-Memory (NOT localStorage)');
  
  // Summary
  console.log('');
  console.log('📊 Summary:');
  if (status.hasAuth) {
    if (status.hasToken) {
      console.log('   ✅ User token found (in-memory) - API calls should work!');
    } else if (status.hasPublicKey) {
      console.log('   ✅ Public API key found - API calls should work!');
    }
  } else {
    console.log('   ❌ NO AUTHENTICATION - All API calls will fail with 401!');
    console.log('');
    console.log('💡 Quick Fix:');
    console.log('   1. Set token: window.setApiToken("paste-token-here")');
    console.log('   2. Set public key: window.setPublicApiKey("your-key")');
    console.log('   3. Or create .env file with VITE_PUBLIC_API_KEY');
  }
  
  return status;
};

// Make available globally (no console spam on load)
if (typeof window !== 'undefined') {
  window.checkApiAuth = checkApiAuth;
}

export default checkApiAuth;
