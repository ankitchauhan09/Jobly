import api from "./api_service.jsx";
import { useUser } from "../contexts/UserContext.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../components/SnackbarComponent.jsx";

const AuthService = () => {
    const { setUser } = useUser();
    const { showSnackbar } = useSnackbar(); // Corrected to invoke useSnackbar hook
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Corrected to invoke useNavigate hook

    const userCredentialLogin = async (email, password) => {
        try {
            const response = await api.post("/api/v1/auth/login", {
                username: email,
                password,
            });

            if (response.status === 200) {
                showSnackbar("Logged in successfully...");
                console.log(response);
                setUser(response.data);
                setError("");
                navigate("/get-jobs");
            }
        } catch (err) {
            setError("Invalid email or password");
            console.error(err);
        }
    };

    const providerLogin = async (provider) => {
        try {
            const response = await api.get(`/auth/login/${provider}`);
            console.log(response);

            // Check if the response is a redirect
            if (response.status === 302 || (response.data && response.data.startsWith('http'))) {
                // Redirect the user to the provided URL
                window.location.href = response.data;
            } else {
                // Handle successful login
                console.log('Login successful', response.data);
            }
        } catch (error) {
            if (error.response && error.response.status === 302) {
                // Handle redirect in case of error
                window.location.href = error.response.data;
            } else {
                console.error('Error during social login:', error);
            }
        }
    };

    return { userCredentialLogin, providerLogin }; // Return the functions to be used elsewhere
};

export default AuthService;
