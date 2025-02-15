    import React, {useState} from 'react';
    import {ArrowLeft, MessageSquare, Mic, MicOff, PhoneOff, ScreenShare, Video, VideoOff} from 'lucide-react';
    import {useNavigate} from 'react-router-dom';

    const VideoConferencingUI = ({
                                     mentor,
                                     user,
                                     roomId,
                                     localVideoRef,
                                     remoteVideoRef,
                                     localStream,
                                     remoteStream,
                                     startCall,
                                     isConnected
                                 }) => {
        const [isMicOn, setIsMicOn] = useState(true);
        const [isCameraOn, setIsCameraOn] = useState(true);
        const navigate = useNavigate();

        const toggleMic = () => {
            if (localStream) {
                const audioTrack = localStream.getAudioTracks()[0];
                audioTrack.enabled = !isMicOn;
                setIsMicOn(!isMicOn);
            }
        };

        const toggleCamera = () => {
            if (localStream) {
                const videoTrack = localStream.getVideoTracks()[0];
                videoTrack.enabled = !isCameraOn;
                setIsCameraOn(!isCameraOn);
            }
        };

        const endCall = () => {
            navigate('/get-mentorship');
        };

        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
                {/* Top Navigation */}
                <div className="bg-black/50 backdrop-blur-sm border-b border-gray-800 p-4">
                    <div className="max-w-8xl mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/get-mentorship')}
                                className="text-gray-400 hover:text-orange-500 transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6"/>
                            </button>
                            <img
                                src="/api/placeholder/40/40"
                                alt={mentor?.name}
                                className="rounded-full w-10 h-10 object-cover ring-2 ring-orange-500"
                            />
                            <div>
                                <h2 className="text-lg font-semibold">{mentor?.name}</h2>
                                <p className="text-xs text-gray-400">
                                    {isConnected ? 'Connected' : 'Connecting...'}
                                </p>
                            </div>
                        </div>
                        <div className="text-gray-400">
                            <span>00:00:00</span>
                        </div>
                    </div>
                </div>

                {/* Main Video Container */}
                <div className="grid grid-cols-12 gap-4 p-4 h-[calc(100vh-200px)]">
                    {/* Remote Video Stream */}
                    <div className="col-span-9 bg-gray-800 rounded-3xl overflow-hidden relative">
                        {remoteStream ? (
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                <p className="text-gray-500">Waiting for mentor to join...</p>
                            </div>
                        )}
                        <div className="absolute bottom-4 left-4 bg-black/50 px-4 py-2 rounded-full">
                            <span>{mentor?.name}</span>
                        </div>
                    </div>

                    {/* Local Video Stream & Controls */}
                    <div className="col-span-3 flex flex-col gap-4">
                        {/* Local Video */}
                        <div className="bg-gray-800 rounded-3xl overflow-hidden relative flex-grow">
                            {localStream ? (
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    muted
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                    <p className="text-gray-500">Initializing camera...</p>
                                </div>
                            )}
                            <div className="absolute bottom-4 left-4 bg-black/50 px-4 py-2 rounded-full">
                                <span>{user?.name}</span>
                            </div>
                        </div>

                        {/* Control Buttons */}
                        <div className="bg-gray-800 rounded-3xl p-4 flex justify-center items-center gap-4">
                            <button
                                onClick={toggleMic}
                                className={`p-3 rounded-full transition-all ${
                                    isMicOn
                                        ? 'bg-gray-700 text-white'
                                        : 'bg-red-600 text-white'
                                }`}
                            >
                                {isMicOn ? <Mic/> : <MicOff/>}
                            </button>
                            <button
                                onClick={toggleCamera}
                                className={`p-3 rounded-full transition-all ${
                                    isCameraOn
                                        ? 'bg-gray-700 text-white'
                                        : 'bg-red-600 text-white'
                                }`}
                            >
                                {isCameraOn ? <Video/> : <VideoOff/>}
                            </button>
                            <button
                                onClick={endCall}
                                className="p-3 bg-red-600 text-white rounded-full"
                            >
                                <PhoneOff/>
                            </button>
                        </div>

                        {/* Additional Controls */}
                        <div className="bg-gray-800 rounded-3xl p-4 flex justify-center items-center gap-4">
                            <button
                                onClick={startCall}
                                className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors"
                            >
                                Start Call
                            </button>
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <ScreenShare/>
                            </button>
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <MessageSquare/>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="fixed bottom-0 left-0 w-full bg-black/50 backdrop-blur-sm border-t border-gray-800 p-4">
                    <div className="max-w-8xl mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">
                  Connection: {isConnected ? 'Strong' : 'Connecting'}
                </span>
                            <span className="text-sm text-gray-400">
                  Room ID: {roomId || 'Generating...'}
                </span>
                        </div>
                        <div className="text-gray-400">
                            Powered by MentorConnect
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    export default VideoConferencingUI;