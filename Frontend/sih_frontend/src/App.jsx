import {BrowserRouter as Router, Route, Routes, useLocation} from "react-router-dom";
import {ErrorBoundary} from 'react-error-boundary';
import {Suspense, useEffect, useRef, useState} from "react";
import gsap from "gsap";

// Component imports
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import CreateAccount from "./components/CreateAccount";
import SnackbarComponent from "./components/SnackbarComponent";
import Splashscreen from "./components/Splashscreen";
import SearchJobs from "./components/SearchJobs";
import RecruiterSection from "./components/RecruiterSection";
import Companies from "./components/Companies";
import OAuthCallback from "./callbacks/OAuthCallback";
import ProfileSection from "./components/ProfileSection";
import JobDetailsSection from "./components/JobDetailsSection";
import CompanyDetailsSection from "./components/CompanyDetailsSection";
import Mentorship from "./components/Mentorship";
import MentorProfile from "./components/MentorProfile";
import NotificationsPage from "./components/NotificationsPage";
import VideoCallLogin from "./components/VideoCallLogin";
import VideoConferencingPage from "./components/VideoConferencingPage";
import MentorChat from "./components/MentorChat";

// Context imports
import {UserProvider} from "./contexts/UserContext";

// Routes where Navbar should be hidden
const ROUTES_WITHOUT_NAVBAR = ['/session/join/'];

// Loading fallback component
const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
);

// Error fallback component
const ErrorFallback = ({error}) => (
    <div className="flex flex-col items-center justify-center h-screen p-4">
        <h2 className="text-xl font-semibold text-red-500 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
            Retry
        </button>
    </div>
);

// Main content wrapper
const AppContent = () => {
    const location = useLocation();
    const mainPageRef = useRef(null);

    // Check if navbar should be shown
    const shouldShowNavbar = !ROUTES_WITHOUT_NAVBAR.some(route =>
        location.pathname.startsWith(route)
    );

    // Initial animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(mainPageRef.current, {
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div ref={mainPageRef} className="min-h-screen">
            <UserProvider>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <SnackbarComponent>
                        {shouldShowNavbar && <Navbar/>}
                        <Suspense fallback={<LoadingSpinner/>}>
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<HeroSection/>}/>
                                <Route path="/login" element={<Login/>}/>
                                <Route path="/create-account" element={<CreateAccount/>}/>
                                <Route path="/oauth/callback" element={<OAuthCallback/>}/>

                                {/* Main Features */}
                                <Route path="/get-jobs" element={<SearchJobs/>}/>
                                <Route path="/hire" element={<RecruiterSection/>}/>
                                <Route path="/companies" element={<Companies/>}/>
                                <Route path="/get-mentorship" element={<Mentorship/>}/>

                                {/* Details Pages */}
                                <Route path="/profile/user/:userId" element={<ProfileSection/>}/>
                                <Route path="/job-details/:jobID" element={<JobDetailsSection/>}/>
                                <Route path="/company-details/:companyId" element={<CompanyDetailsSection/>}/>
                                <Route path="/mentor/:id" element={<MentorProfile/>}/>

                                {/* User Features */}
                                <Route path="/notifications" element={<NotificationsPage/>}/>

                                {/* Session Routes */}
                                <Route path="/session">
                                    <Route path="login" element={<VideoCallLogin/>}/>
                                    <Route path="join">
                                        <Route path="video/:bookingId/:mentorId" element={<VideoConferencingPage/>}/>
                                        <Route path="text/:bookingId/:mentorId" element={<MentorChat/>}/>
                                    </Route>
                                </Route>
                            </Routes>
                        </Suspense>
                    </SnackbarComponent>
                </ErrorBoundary>
            </UserProvider>
        </div>
    );
};

// Root App component
const App = () => {
    const [splashEnded, setSplashEnded] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Simulate any necessary initialization
        const initializeApp = async () => {
            try {
                // Add any initialization logic here
                setIsInitialized(true);
            } catch (error) {
                console.error('Failed to initialize app:', error);
            }
        };

        initializeApp();
    }, []);

    if (!isInitialized) {
        return <LoadingSpinner/>;
    }

    return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <UserProvider>
                <Router>
                    {!splashEnded ? (
                        <Splashscreen
                            setSplashEnded={setSplashEnded}
                            onError={(error) => console.error('Splash screen error:', error)}
                        />
                    ) : (
                        <AppContent/>
                    )}
                </Router>
            </UserProvider>
        </ErrorBoundary>
    );
};

export default App;