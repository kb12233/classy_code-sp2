import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { account } from "../appwrite/config";
import logoDark from '../assets/images/logo_dark.png';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState(null);

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await account.updateRecovery(userId, secret, newPassword, confirmPassword);
      setConfirmed(true);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  if (confirmed)
    return (
      <div className="min-h-screen bg-[#1E1E1E] text-white flex items-center justify-center">
        <p className="text-white font-mono">Password updated successfully. You can now log in.</p>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-[#1E1E1E] text-white flex flex-col items-center justify-center"
      style={{ fontFamily: "Jetbrains Mono" }}
    >
      <img src={logoDark} alt="Logo" className="mb-16 w-32" />
      <div className="flex flex-col gap-4 max-w-sm w-full p-6 rounded-md shadow-md bg-[#2A2A2A]">
        <h2 className="text-xl font-semibold">Reset Your Password</h2>

        <input
          type="password"
          placeholder="New password"
          className="border border-[#303030] p-2 rounded-lg bg-[#1E1E1E] text-white"
          onChange={(e) => setNewPassword(e.target.value)}
          value={newPassword}
        />

        <input
          type="password"
          placeholder="Confirm new password"
          className="border border-[#303030] p-2 rounded-lg bg-[#1E1E1E] text-white"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />

        <button
          onClick={handleReset}
          className="bg-[#212121] hover:bg-[#B4B4B4] p-2 hover:text-[#303030] text-[#B4B4B4] 
          rounded-lg transition border border-[#303030]"
        >
          Update Password
        </button>

        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
