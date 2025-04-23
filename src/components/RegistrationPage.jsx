import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';
import logoDark from '../assets/images/logo_dark.png';

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
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#1E1E1E] text-white px-6" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <img src={logoDark} alt="Logo" className="w-24 h-24 mb-6" />
            <h2 className="text-3xl font-bold mb-6">Create Account</h2>
    
            {error && (
                <div className="bg-[#1E1E1E] text-red-700 px-4 py-3 rounded relative mb-4 w-full max-w-md text-center" role="alert">
                    <span className="block sm:inline">{error}</span>
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
                <div className="bg-[#1E1E1E] text-green-400 px-4 py-3 rounded relative mb-4 w-full max-w-md text-center" role="alert">
                    <span className="block sm:inline">{successMessage}</span>
                </div>
            )}

            <div className="w-full max-w-sm">
                <div className="mb-4">
                    <label className="block text-sm mb-1 text-[#B4B4B4]">Name</label>
                    <input
                        type="text"
                        className="w-full p-3 border border-[#303030] rounded bg-[#303030] text-white"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm mb-1 text-[#B4B4B4]">Email</label>
                    <input
                        type="email"
                        className="w-full p-3 border border-[#303030] rounded bg-[#303030] text-white"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-sm mb-1 text-[#B4B4B4]">Password</label>
                    <input
                        type="password"
                        className="w-full p-3 border border-[#303030] rounded bg-[#303030] text-white"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button 
                    onClick={handleRegister} 
                    className="w-full p-3 bg-[#212121] hover:bg-[#B4B4B4] hover:text-[#303030] text-[#B4B4B4] rounded-lg transition border border-[#303030]">
                    SIGN UP
                </button>
                <div className="mt-4 text-center text-sm text-[#B4B4B4]">
                    Already have an account?{" "}
                    <span 
                        onClick={handleLogin} 
                        className="text-white cursor-pointer hover:underline"
                    >
                        Sign in
                    </span>
                </div>
            </div>
        </div>
        </>
    );
};

export default RegistrationPage;
