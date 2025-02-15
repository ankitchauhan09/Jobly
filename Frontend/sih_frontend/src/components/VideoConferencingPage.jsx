import {ArrowLeft, MessageSquare, Mic, MicOff, PhoneOff, ScreenShare, Video, VideoOff} from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {MentorService} from "../service/MentorService.jsx";
import {useUser} from "../contexts/UserContext.jsx";
import {Stomp} from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const VideoConferencingPage = () => {

    const {mentorId, bookingId} = useParams();
    const roomId = 123
    const navigate = useNavigate();

    useEffect(() => {
        deleteBookingInfoFromDb(bookingId);
    } , [bookingId])

    const deleteBookingInfoFromDb = (bookingId) => {
        MentorService.deleteBookingInfo(bookingId);
    }

    const [mentor, setMentor] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);

    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const peerConnectionRef = useRef(null);
    const stompClientRef = useRef(null);

    const user = useUser();

    // Initialize WebSocket connection
    useEffect(() => {
        let retryCount = 0;
        const maxRetries = 3;

        const connectWebSocket = () => {
            try {
                const socket = new SockJS("http://localhost:9011/ws");
                const stomp = Stomp.over(socket);

                stomp.connect({}, () => {
                    console.log('WebSocket Connected');
                    setIsConnected(true);
                    stompClientRef.current = stomp;

                    stomp.subscribe(`/user/${mentorId}/signal`, (message) => {
                        const data = JSON.parse(message.body);
                        handleSignalingData(data);
                    });
                }, (error) => {
                    console.error('WebSocket connection error:', error);
                    if (retryCount < maxRetries) {
                        retryCount++;
                        setTimeout(connectWebSocket, 3000);
                    }
                });
            } catch (error) {
                console.error('WebSocket initialization error:', error);
            }
        };

        connectWebSocket();

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.disconnect();
            }
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
        };
    }, [mentorId]);

    // Initialize media stream
    useEffect(() => {
        const initializeMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing media devices:", error);
            }
        };

        initializeMedia();
    }, []);

    // Fetch mentor data
    useEffect(() => {
        const fetchMentorById = async () => {
            const mentorData = await MentorService.getMentorById(mentorId);
            setMentor(mentorData);
        };
        fetchMentorById();
    }, [mentorId]);

    const createPeerConnection = async () => {
        try {
            const configuration = {
                iceServers: [
                    {urls: 'stun:stun.l.google.com:19302'}
                ]
            };

            const pc = new RTCPeerConnection(configuration);

            // Add local tracks to the connection
            if (localStream) {
                localStream.getTracks().forEach(track => {
                    pc.addTrack(track, localStream);
                });
            }

            // Handle incoming tracks
            pc.ontrack = (event) => {
                setRemoteStream(event.streams[0]);
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
            };

            // Handle ICE candidates
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    sendSignalingMessage("ice-candidate", event.candidate);
                }
            };

            pc.oniceconnectionstatechange = () => {
                console.log("ICE Connection State:", pc.iceConnectionState);
            };

            peerConnectionRef.current = pc;
            return pc;
        } catch (error) {
            console.error("Error creating peer connection:", error);
            throw error;
        }
    };

    const handleSignalingData = async (data) => {
        try {
            if (!peerConnectionRef.current) {
                console.log("init peer connection due to null during handling signal")
                await createPeerConnection();
            }
            console.log("data received of type : " + data.type);
            console.log(data.signal)
            switch (data.type) {
                case "offer":
                    await handleOffer(data.signal);
                    // Automatically generate and send an answer after receiving an offer
                    await sendAnswer();
                    break;
                case "answer":
                    await handleAnswer(data.signal);
                    break;
                case "ice-candidate":
                    await handleIceCandidate(data.signal);
                    break;
                default:
                    console.warn("Unknown signal type:", data.type);
            }
        } catch (error) {
            console.error("Error handling signaling data:", error);
        }
    };

    const sendAnswer = async () => {
        try {
            const pc = peerConnectionRef.current;
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            sendSignalingMessage("answer", answer);
        } catch (error) {
            console.error("Error sending answer:", error);
        }
    };

    const handleOffer = async (offer) => {
        try {
            const pc = peerConnectionRef.current;
            await pc.setRemoteDescription(offer);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            sendSignalingMessage("answer", answer);
        } catch (error) {
            console.error("Error handling offer:", error);
        }
    };

    const handleAnswer = async (answer) => {
        try {
            await peerConnectionRef.current.setRemoteDescription(
                new RTCSessionDescription(answer)
            );
        } catch (error) {
            console.error("Error handling answer:", error);
        }
    };

    const handleIceCandidate = async (candidate) => {
        try {
            await peerConnectionRef.current.addIceCandidate(
                new RTCIceCandidate(candidate)
            );
        } catch (error) {
            console.error("Error handling ICE candidate:", error);
        }
    };

    const sendSignalingMessage = (type, signal) => {
        if (!stompClientRef.current?.connected) {
            console.error("WebSocket not connected");
            return;
        }

        const mentorIdToSend = mentorId === 'tcKcHGCj' ? 'CDLwJDtU' : 'tcKcHGCj';
        const message = {
            userId: user.id,
            receiverId: mentorIdToSend,
            signal: signal,
            type: type,
            roomId: roomId
        };

        stompClientRef.current.send('/app/signal', {}, JSON.stringify(message));
    };

    useEffect(() => {
        const initPeer = async () => {
            await createPeerConnection()
        }
        initPeer();
    }, [])

    const startCall = async () => {
        try {
            const pc = await createPeerConnection();
            const offer = await pc.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });
            await pc.setLocalDescription(offer);
            sendSignalingMessage("offer", offer);
        } catch (error) {
            console.error("Error starting call:", error);
        }
    };

    const toggleMic = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMicOn(audioTrack.enabled);
        }
    };

    const toggleCamera = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsCameraOn(videoTrack.enabled);
        }
    };

    const endCall = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
        if (stompClientRef.current) {
            stompClientRef.current.disconnect();
        }
        navigate('/get-mentorship');
    };


    // Render UI
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
                            controls={false}
                            disabled={true}
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
                            // onClick={toggleMic}
                            className={`p-3 rounded-full transition-all ${
                                isMicOn
                                    ? 'bg-gray-700 text-white'
                                    : 'bg-red-600 text-white'
                            }`}
                        >
                            {isMicOn ? <Mic/> : <MicOff/>}
                        </button>
                        <button
                            // onClick={toggleCamera}
                            className={`p-3 rounded-full transition-all ${
                                isCameraOn
                                    ? 'bg-gray-700 text-white'
                                    : 'bg-red-600 text-white'
                            }`}
                        >
                            {isCameraOn ? <Video/> : <VideoOff/>}
                        </button>
                        <button
                            // onClick={endCall}
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

export default VideoConferencingPage;