import {useState} from "react";
import {useSnackbar} from "./SnackbarComponent.jsx";
import api from "../service/api_service.jsx";
import {useNavigate} from "react-router-dom";
import {useUser} from "../contexts/UserContext.jsx";
import {Button} from "@mui/material";
import google_icon from '../assets/google_logo.png'
import AuthService from '../service/AuthService.jsx';
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const {showSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const {setUser} = useUser();
    const {userCredentialLogin, providerLogin} = AuthService();

    const handleLogin = async (event) => {
        event.preventDefault();
        userCredentialLogin(email, password);
    };

    const handleSocialLogin = (provider) => {
        providerLogin(provider)
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-neutral-900">
            <div className="w-full max-w-md p-8 space-y-6 bg-neutral-800 rounded-lg shadow-lg">
                <h2 className="text-3xl font-extrabold text-center text-white">
                    Sign in to Jobly
                </h2>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm">
                        <div className="mb-4">
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email" // Correctly name the input field
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-center mb-4">{error}</div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember_me"
                                name="remember_me"
                                type="checkbox"
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-neutral-600 rounded"
                            />
                            <label
                                htmlFor="remember_me"
                                className="ml-2 block text-sm text-neutral-300"
                            >
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a
                                href="#"
                                className="font-medium text-orange-600 hover:text-orange-500"
                            >
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-gradient-to-r from-orange-500 to-orange-800 hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-neutral-400"> Don't have an account?</p>
                    <a
                        href="#"
                        className="font-medium text-orange-600 hover:text-orange-500"
                    >
                        Create an account
                    </a>
                </div>
                <div className="w-full h-auto">
                    <p className="w-full text-center">OR</p>
                </div>
                <div className="w-full h-auto">
                    <Button onClick={() => {
                        handleSocialLogin("google")
                    }} variant="outlined"
                            startIcon={<img src={google_icon} alt="Google logo" style={{width: 20, height: 20}}/>}
                            className="w-full bg-orange-800 py-2 px-6 rounded-md text-white">Sign in with
                        Google</Button>
                </div>
            </div>
        </div>
    );
};
export default Login;
