import { useState } from "react";
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
    const [successMessage, setSuccessMessage] = useState(""); 

    const handleRegister = async () => {
        setError("");
        setSuccessMessage(""); 
        setLoading(true);
        try {
            await registerUser({ name, email, password });
            setSuccessMessage("Registration successful!"); 
            setTimeout(() => {
                navigate("/login"); 
            }, 1000);
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
            <div className="flex flex-col items-center justify-center flex-2 bg-[#B4B4B4] p-10">
                <img src="\src\assets\images\logo_light.png" alt="Logo" className="w-32 h-32" />
                <h1 className="text-[#212121] text-2xl font-bold mt-20">Welcome Back!</h1>
                <p className="text-[#212121] text-sm mt-4 text-center w-2/3">
                    Stay in touch! Sign in with your info.
                </p>
                <button onClick={handleLogin} className="mt-6 px-6 py-2 border border-gray-900 
                    text-[#212121] rounded-lg hover:bg-[#303030] hover:text-[#B4B4B4]">
                    SIGN IN
                </button>
            </div>
            {/* Right Section */}
            <div className="flex flex-col items-center justify-center flex-3 bg-[#1E1E1E] text-white p-10">
                <h2 className="text-3xl font-bold">Create Account</h2>

                {error && (
                    <div className="bg-[#1E1E1E] text-red-700 px-4 py-3 rounded relative mt-4 flex items-center justify-between" role="alert">
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

                {successMessage && (
                    <div className="bg-[#1E1E1E] text-green-400 px-4 py-3 rounded relative mb-4 mt-4 flex items-center justify-center" role="alert">
                        <span className="block sm:inline">{successMessage}</span>
                    </div>
                )}

                <div className="mt-5 w-1/2">
                    <div className="mb-4">
                        <label className="block text-sm mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-[#303030] rounded bg-[#303030] text-white"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 border border-[#303030] rounded bg-[#303030] text-white"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-[#303030] rounded bg-[#303030] text-white"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button onClick={handleRegister} className="w-full mt-4 py-2 bg-[#212121] hover:bg-[#B4B4B4] 
                        hover:text-[#303030] text-[#B4B4B4] rounded-lg transition border border-[#303030]">
                        SIGN UP
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};

export default RegistrationPage;