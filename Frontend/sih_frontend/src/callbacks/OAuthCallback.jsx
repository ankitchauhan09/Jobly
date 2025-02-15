import {useLocation, useNavigate} from "react-router-dom";
import {useSnackbar} from "../components/SnackbarComponent.jsx";
import {useEffect} from "react";
import {useUser} from "../contexts/UserContext";

const useQuery = () => {
    return new URLSearchParams(useLocation().search)
}

const OAuthCallback = () => {
    const navigate = useNavigate();
    const { showSnackBar } = useSnackbar();
    const { setUser  } = useUser ();
    const query = useQuery();

    useEffect(() => {
        const userInfo = query.get("user");

        // Clear any existing auth state first
        const clearAuthState = () => {
            localStorage.clear();
            sessionStorage.clear();
            setUser(null);
        };

        if (userInfo) {
            try {
                clearAuthState()
                // Parse the base64 encoded user info
                const decodedUser  = JSON.parse(atob(userInfo));
                setUser (decodedUser );
                console.log("Decoded User:", decodedUser );
                // Navigate after setting user
                navigate('/', { replace: true });
            } catch (error) {
                console.error('Error processing user info:', error);
                showSnackBar('Error processing login information', 'error');
                navigate('/login', { replace: true });
            }
        } else {
            console.log("no user");
            showSnackBar('No user information received', 'error');
            navigate('/login', { replace: true });
        }
    }, [query, navigate, setUser , showSnackBar]); // Add dependencies


    // Show loading state while processing
    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-900">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-4 text-white">Authenticating...</h2>
                <div
                    className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto"></div>
            </div>
        </div>
    );
}

export default OAuthCallback;