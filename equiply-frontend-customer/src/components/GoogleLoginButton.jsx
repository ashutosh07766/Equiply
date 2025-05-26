import React, { useState } from 'react';
import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Store current location to return after login
      sessionStorage.setItem('auth_return_to', window.location.pathname);
      
      // Create the OAuth URL with the EXACT redirect URI that is authorized in Google Console
      const clientId = '413786747217-shtsu3g52852filvh897jc6si15grtkg.apps.googleusercontent.com';
      
      // Be very careful with this URI - it must EXACTLY match what is in your Google Console
      // Use http instead of https if that's what you registered
      // DO NOT include a trailing slash unless it's authorized that way
      const redirectUri = encodeURIComponent('http://localhost:5173/oauth-callback');
      
      const scope = encodeURIComponent('email profile');
      const responseType = 'token';
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
                    `client_id=${clientId}&` +
                    `redirect_uri=${redirectUri}&` +
                    `response_type=${responseType}&` +
                    `scope=${scope}&` +
                    `prompt=select_account`;
      
      console.log("Redirecting to Google OAuth with redirect URI:", decodeURIComponent(redirectUri));
      
      // Redirect to Google OAuth - this will later redirect to our callback page
      window.location.href = authUrl;
      
    } catch (err) {
      console.error("Google login error:", err);
      setError("Failed to initiate Google login");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className={`flex items-center justify-center w-1/4 mx-auto border border-gray-300 py-3 rounded-full ${
          isLoading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100 transition"
        }`}
        aria-label="Sign in with Google"
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2"></span>
        ) : (
          <FcGoogle className="text-xl mr-2" />
        )}
        {isLoading ? "Connecting..." : "Google"}
      </button>
      
      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}
    </div>
  );
};

export default GoogleLoginButton;
