    import {Menu, X} from "lucide-react";
    import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
    import React, {useEffect, useRef, useState} from "react";
    import logo from "../assets/logo.png";
    import {navItems} from "../constants";
    import {Link, useNavigate} from "react-router-dom";
    import gsap from "gsap";
    import {useUser} from "../contexts/UserContext";
    import api_service from "../service/api_service.jsx";
    import {Badge} from "@mui/material";
    import {useNotification} from "../contexts/NotificationContext.jsx";

    const Navbar = () => {
        const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
        const toggleNavbar = () => {
            setMobileDrawerOpen(!mobileDrawerOpen);
        };
        const { notification, addNotification, removeNotification } = useNotification();
        const [notificationCount, setNotificationCount] = useState(0);
        const navigate = useNavigate();
        const {user, setUser} = useUser();

        useEffect(() => {
            console.log("user in navbar")
            console.log(user)
        }, [user])

        useEffect(() => {
            const unreadCount = notification.filter(noti => !noti.read).length;
            setNotificationCount(unreadCount);
        }, [notification]);

        const navbarRef = useRef(null);

        const navigateToProfile = (userId) => {
            navigate("/profile/user/" + userId);
        };

        const clearAllCookies = () => {
            // Get all cookies
            const cookies = document.cookie.split(';');

            // Different paths and domains to try
            const paths = ['/', '/auth', '/oauth', '/realms', '', '/api'];
            const domains = ['localhost', '127.0.0.1', window.location.hostname];

            // Attributes to try
            const attributes = [
                '',
                '; secure',
                '; httponly',
                '; secure; httponly',
                '; samesite=strict',
                '; samesite=lax',
                '; samesite=none; secure'
            ];

            cookies.forEach(cookie => {
                const cookieName = cookie.split('=')[0].trim();

                // Try every combination of path, domain, and attributes
                paths.forEach(path => {
                    domains.forEach(domain => {
                        attributes.forEach(attr => {
                            // Clear with domain
                            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain}${attr}`;

                            // Clear without domain
                            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${attr}`;
                        });
                    });
                });
            });

            // Also try clearing specific known cookies
            const specificCookies = [
                'KEYCLOAK_SESSION',
                'KEYCLOAK_IDENTITY',
                'KC_RESTART',
                'JSESSIONID',
                'connect.sid',
                'JWT-TOKEN',
                'AUTH_SESSION_ID',
                'KEYCLOAK_REMEMBER_ME',
                'identity_token',
                'access_token',
                'refresh_token'
            ];

            specificCookies.forEach(cookieName => {
                paths.forEach(path => {
                    domains.forEach(domain => {
                        attributes.forEach(attr => {
                            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain}${attr}`;
                            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${attr}`;
                        });
                    });
                });
            });
        };

        const openNotificationsPage = () => {
            navigate('/notifications')
        }

        const logoutUser = async () => {
            const response = await api_service.post('/auth/logout');
            console.log(response.data); // Optional: Log the response message

            clearAllCookies()
            localStorage.clear(); // Clear all localStorage
            sessionStorage.clear(); // Clear all sessionStorage

            // Clear user context
            setUser(null);

            navigate("/login");
        };

        useEffect(() => {
            if (navbarRef.current) {
                // Set initial styles before animation
                gsap.set(navbarRef.current, {y: -100, opacity: 0});

                // GSAP animation to bring the navbar into view
                gsap.to(navbarRef.current, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    delay: 0.5, // Adjust delay as needed
                });
            }
        }, []); // Empty dependency array ensures this runs once after component mounts

        return (
            <nav
                ref={navbarRef}
                    className="navbar sticky flex flex-row align-items-center top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80"
            >
                <div className="container px-4 mx-auto relative text-sm">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center flex-shrink-0">
                            <Link to="/" className="flex items-center flex-shrink-0">
                                <img className="h-10 w-10 mr-2" src={logo} alt="Jobly logo"/>
                                <span className="text-xl tracking-tight">Jobly</span>
                            </Link>
                        </div>

                        <ul className="hidden lg:flex ml-14 space-x-12">
                            {navItems.map((item, index) => (
                                <li key={index}>
                                    <Link to={item.href}>{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                        <div className="hidden lg:flex justify-center space-x-12 items-center">
                            {user ? (
                                // Display user's name and a logout button if user is logged in
                                <>
                    <span
                        onClick={() => navigateToProfile(user.id)}
                        className="cursor-pointer text-white"
                    >
                      Welcome, {user.name}
                    </span>
                                    <button
                                        onClick={logoutUser}
                                        className="py-2 px-3 border rounded-md"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                // Show Sign in and Create account buttons if user is not logged in
                                <>
                                    <Link to="/login" className="py-2 px-3 border rounded-md">
                                        Sign in
                                    </Link>
                                    <Link
                                        to="/create-account"
                                        className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md"
                                    >
                                        Create an account
                                    </Link>
                                </>
                            )}
                        </div>
                        <div className="lg:hidden md:flex flex-col justify-end">
                            <button onClick={toggleNavbar}>
                                {mobileDrawerOpen ? <X/> : <Menu/>}
                            </button>
                        </div>
                    </div>
                    {mobileDrawerOpen && (
                        <div
                            className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
                            <ul>
                                {navItems.map((item, index) => (
                                    <li key={index} className="py-4">
                                        <Link to={item.href}>{item.label}</Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex space-x-6">
                                {user ? (
                                    // Display user's name and a logout button if user is logged in
                                    <>
                                        <span className="text-white">Welcome, {user.name}</span>
                                        <Link to="/logout" className="py-2 px-3 border rounded-md">
                                            <Logout></Logout>
                                        </Link>
                                    </>
                                ) : (
                                    // Show Sign in and Create account buttons if user is not logged in
                                    <>
                                        <Link to="/login" className="py-2 px-3 border rounded-md">
                                            Sign in
                                        </Link>
                                        <Link
                                            to="/create-account"
                                            className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md"
                                        >
                                            Create an account
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end mr-5">
                    <Badge badgeContent={notificationCount} color="primary">
                        <NotificationsNoneIcon onClick={openNotificationsPage} sx={{ fontSize: 30 }} color="white"/>
                    </Badge>
                </div>
            </nav>
        );
    };

    export default Navbar;
