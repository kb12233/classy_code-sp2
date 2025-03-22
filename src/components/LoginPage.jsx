import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../utils/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 
  const { user, loginUser }  = useAuth();

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

  return (
    <>
     {loading && <LoadingOverlay message="Loading..." />}
    <div className="flex h-screen" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
      {/* Left Panel */}
      <div className="flex flex-col justify-center items-center w-3/5 bg-gray-900 text-white p-10">
        <img src="\src\assets\images\logo_dark.png" alt="Logo" className="mb-16 w-32" />
        <h1 className="text-2xl font-bold">Sign in to ClassyCode</h1>
        {/* ERROR ALERT */}
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mt-4 flex items-center justify-between" role="alert">
            <div className="pr-10">
              <span className="block sm:inline">{error}</span>
            </div>
            <button
              onClick={() => setError("")}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </div>          
          )}
        <div className="mt-10 w-1/2">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* {error && <p className="text-red-500">{error}</p>} */}
          <p className="text-sm text-teal-400 cursor-pointer mb-4">Forgot your password?</p>
          <button onClick={handleLogin} className="w-full p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition">
            SIGN IN
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col justify-center items-center w-2/5 bg-[#b8dbd9] p-10">
        <h2 className="text-2xl font-bold text-gray-900">Hello Friend!</h2>
        <p className="text-center text-gray-800 mt-4 px-10">
          Create an account and get started!
        </p>
        <button onClick={handleRegister} className="mt-6 px-6 py-2 border border-gray-900 text-gray-900 rounded hover:bg-gray-900 hover:text-white">
          SIGN UP
        </button>
      </div>
    </div>
    </>
  );
}
