import { useContext, useState, useEffect, createContext } from "react";
import { account } from "../appwrite/config";   
import LoadingOverlay from "../components/LoadingOverlay";
import { ID } from "appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);


    useEffect(() => {
        checkUserStatus(); 
    }, []);

    const loginUser = async (userInfo) => {
        try {
            await account.createEmailPasswordSession(userInfo.email, userInfo.password);
            let userData = await account.get();
            setUser(userData)
        } catch(error) {
            let errorMessage = "Login failed. Please try again.";

            console.error("Login error:", error); 

            if(error.code === 401) {
                errorMessage = "Invalid email or password. Please try again.";
            } else if(error.code === 400) {
                errorMessage = "Invalid input. Please check your credentials.";
            }
            throw new Error(errorMessage);
        }
    };

    const logoutUser = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
        } catch(error) {
            console.error("Logout failed:", error.message);
        }
    };

    const registerUser = async (userInfo) => {
        try {
            const newUser = await account.create(
                ID.unique(),
                userInfo.email,
                userInfo.password,
                userInfo.name,
            );
            await account.createEmailPasswordSession(userInfo.email, userInfo.password);

            const userData = await account.get();
            setUser(userData);
            return newUser;
        } catch(error) {
            let errorMessage = "";

            if (error.code === 400 && error.message.includes("password")) {
                errorMessage = "Password must be at least 8 characters long.";
            } else if (error.code === 400 && error.message.includes("email")) {
                errorMessage = "Please enter a valid email address.";
            } else if (error.code === 409) {
                errorMessage = "This email is already in use.";
            }
            throw new Error(errorMessage);
        }
    };

    const checkUserStatus = async () => {
        try {
            let userData = await account.get();
            setUser(userData);
        } catch(error) {
            console.error(error);
        }
        setLoading(false);
    };
    
    const contextData = {
        user,
        loginUser,
        logoutUser,
        registerUser,
    }

    return(
        <AuthContext.Provider value={contextData}> 
            {loading && <LoadingOverlay message="Loading..." />}
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {return useContext(AuthContext)}

export default AuthContext;