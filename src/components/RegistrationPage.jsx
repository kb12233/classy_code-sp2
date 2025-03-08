import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const name = nameRef.current.value;
    const password = passwordRef.current.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;


      await setDoc(doc(db, "users", user.uid), {
        userID: user.uid,  
        name,
        email,
      });

      navigate("/"); 
    } catch (error) {
      console.error("Error during registration: ", error.message);
    }
  };

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen w-screen" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
      {/* Left Section */}
      <div className="flex flex-col items-center justify-center flex-2 bg-[#b8dbd9] p-10">
        <img src="/src/assets/images/logo_light.png" alt="Logo" className="w-32 h-32" />
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
        <div className="mt-10 w-1/3">
          <div className="mb-4">
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
              placeholder="Enter your name"
              ref={nameRef}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
              placeholder="Enter your email"
              ref={emailRef}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
              placeholder="Enter your password"
              ref={passwordRef}
            />
          </div>
          <button onClick={handleSignUp} className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg transition">
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
