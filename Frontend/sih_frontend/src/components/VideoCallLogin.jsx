import React, {useState} from 'react';
import {LogIn, Monitor} from 'lucide-react';
import {useLocation, useNavigate} from "react-router-dom";
import {MentorService} from "../service/MentorService.jsx";

const VideoCallLogin = () => {
    const [meetingId, setMeetingId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const serviceName = location.state?.serviceName;
    const service = serviceName === "text_chat_service" ? "Text Chat" : "Video Call"

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!meetingId || !password) {
            setError('Please enter both Meeting ID and Password');
            return;
        }
        // Reset error before submission
        setError('');

        await joinSession();
    };

    const joinSession = async () => {
        try {
            // Call the MentorService to verify session login
            const response = await MentorService.verifySessionLogin(meetingId, password);
            // Ensure response is valid
            if (response && response.status) {
                const mentorId = response.job_booking_dto?.mentorId;
                const bookingId = response.job_booking_dto?.bookingId;
                const fetchedServiceName = response.job_booking_dto?.serviceName;
                // Check if mentorId exists
                if (mentorId && bookingId && serviceName) {

                    if (serviceName !== fetchedServiceName) {
                        setError("Invalid session credentials...")
                        return;
                    }
                    if (serviceName === "text_chat_service") {
                        navigate(`/session/join/text/${bookingId}/${mentorId}`);
                    } else {
                        navigate(`/session/join/video/${bookingId}/${mentorId}`);
                    }
                } else {
                    setError("Mentor ID is missing from the response.");
                }
            } else {
                setError("Invalid username or password.");
            }
        } catch (error) {
            console.error("Error during session login:", error);
            setError("An error occurred while verifying session login.");
        }
    }


    return (
        <div
            className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="relative">
                    {/* Gradient blur background */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-3xl blur-xl"/>

                    {/* Main content container */}
                    <div
                        className="relative z-10 bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 shadow-2xl">
                        <div className="flex justify-center mb-6">
                            <Monitor className="w-16 h-16 text-orange-500"/>
                        </div>

                        <h2 className="text-3xl font-bold text-white text-center mb-6">
                            Join {service}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="meetingId" className="block text-gray-300 mb-2">
                                    Meeting ID
                                </label>
                                <input
                                    type="text"
                                    id="meetingId"
                                    value={meetingId}
                                    onChange={(e) => setMeetingId(e.target.value)}
                                    placeholder="Enter Meeting ID"
                                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-gray-300 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter Password"
                                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {error && (
                                <div
                                    className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-center">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
                            >
                                <LogIn className="mr-2"/>
                                Join {service}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-neutral-500 text-sm">
                            Need help? Contact support
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCallLogin;