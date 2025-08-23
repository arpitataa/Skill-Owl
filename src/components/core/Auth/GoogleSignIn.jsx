import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function GoogleSignIn() {
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:4000/api/v1/auth/google-login", {
        token: credentialResponse.credential,
      });

      console.log("Google login backend response:", res.data);

      // Save token to Redux/localStorage
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Google login failed")}
      />
    </GoogleOAuthProvider>
  );
}

export default GoogleSignIn;
