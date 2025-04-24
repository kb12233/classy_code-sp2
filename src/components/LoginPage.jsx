import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../utils/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';
import logoDark from '../assets/images/logo_dark.png';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");

  const navigate = useNavigate(); 
  const { user, loginUser, requestPasswordReset }  = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
      try {
        await loginUser({ email, password });
        navigate("/");
      } catch (error) {
          setError(error.message);
      }
    setLoading(false);
  };

  const handleRegister = () => {
    navigate('/register');
  }

  const handleForgotPassword = async () => {
    setError("");
    setForgotPasswordSuccess("");

    if (!email) {
      setError("Please enter your email first.");
      return;
    }

    try {
      await requestPasswordReset(email);
      setForgotPasswordSuccess("Password reset email sent! Please check your inbox.");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay message="Loading..." />}
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#1E1E1E] p-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        <img src={logoDark} alt="Logo" className="mb-8 w-32" />
        <h1 className="text-2xl font-bold text-white mb-4">Sign in to ClassyCode</h1>

        {/* ERROR ALERT */}
        {error && (
          <div className="bg-[#1E1E1E] text-red-700 px-4 py-3 rounded relative mb-4 w-full max-w-sm" role="alert">
            <div className="pr-10">
              <span className="block sm:inline">{error}</span>
            </div>
            <button
              onClick={() => setError("")}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg className="fill-current h-6 w-6 text-red-700" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </div>
        )}

        {/* SUCCESS ALERT */}
        {forgotPasswordSuccess && (
          <div className="bg-[#1E1E1E] text-green-400 px-4 py-3 rounded relative mb-4 w-full max-w-sm text-sm" role="alert">
            <span className="block sm:inline">{forgotPasswordSuccess}</span>
            <button
              onClick={() => setForgotPasswordSuccess("")}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg className="fill-current h-6 w-6 text-green-400" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </div>
        )}

        <div className="w-full max-w-sm">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-[#303030] text-white border border-[#303030] mt-4 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-[#303030] text-white border border-[#303030] mb-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="text-[#B4B4B4] cursor-pointer hover:underline mb-8 text-sm" onClick={handleForgotPassword}>
            Forgot your password?
          </button>
          <button
            onClick={handleLogin}
            className="w-full p-3 bg-[#212121] hover:bg-[#B4B4B4] hover:text-[#303030] text-[#B4B4B4] rounded-lg transition border border-[#303030]"
          >
            SIGN IN
          </button>

          {/* Sign up redirect text */}
          <div className="mt-4 text-center text-sm text-[#B4B4B4]">
            Don't have an account?{" "}
            <span
              onClick={handleRegister}
              className="text-white cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </div>
        </div>
      </div>
    </>
  );
}