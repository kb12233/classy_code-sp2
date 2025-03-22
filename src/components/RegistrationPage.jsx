import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../utils/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';

const RegistrationPage = () => {
    const navigate = useNavigate(); 
    const { registerUser } = useAuth(); 
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
      setError(""); 
      setLoading(true); 
      try {
          await registerUser({ name, email, password });
          navigate("/login"); 
      } catch (error) {
          setError(error.message);
      } finally {
          setLoading(false);
      }
  };

    const handleLogin = () => {
        navigate('/login');
    }
    
  return (
    <>
    {loading && <LoadingOverlay message="Loading..." />}
    <div className="flex h-screen w-screen" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
      {/* Left Section */}
      <div className="flex flex-col items-center justify-center flex-2 bg-[#b8dbd9] p-10">
        <img src="\src\assets\images\logo_light.png" alt="Logo" className="w-32 h-32" />
        <h1 className="text-gray-800 text-2xl font-bold mt-20">Welcome Back!</h1>
        <p className="text-gray-700 text-sm mt-4 text-center w-2/3">
          Stay in touch! Sign in with your info.
        </p>
        <button onClick={handleLogin} className="mt-6 px-6 py-2 border border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition">
          SIGN IN
        </button>
      </div>
      {/* Right Section */}
      <div className="flex flex-col items-center justify-center flex-3 bg-gray-900 text-white p-10">
        <h2 className="text-3xl font-bold">Create Account</h2>
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

        <div className="mt-10 w-1/3">
          <div className="mb-4">
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button onClick={handleRegister} className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg transition">
            SIGN UP
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default RegistrationPage;
