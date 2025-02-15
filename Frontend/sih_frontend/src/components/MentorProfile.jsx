import React, {Fragment, useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    ArrowLeft,
    Award,
    Badge,
    Briefcase,
    Clock,
    GraduationCap,
    Languages,
    Mail,
    MapPin,
    MessageSquare,
    Star,
    TvMinimal
} from 'lucide-react';
import AppBar from "@mui/material/AppBar";
import {
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Input,
    MenuItem,
    Toolbar,
    Typography
} from "@mui/material";
import {RiCloseLargeLine} from "react-icons/ri";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import Select from '@mui/material/Select';
import {PaymentService} from "../service/PaymentService.jsx";
import {useUser} from "../contexts/UserContext.jsx";
import {MentorService} from "../service/MentorService.jsx";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const MentorProfile = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const sendMessageDialog = useRef();
    const [timeSlotForBooking, setTimeSlotForBooking] = useState();

    const {user} = useUser();

    useEffect(() => {
        checkIsBookedStatus()
        // initializeMessagingService;
    }, [user]);

    const mentor = {
        id: "CDLwJDtU",
        name: "Dr. Sarah Johnson",
        title: "Senior Software Architect",
        email: "dr.sarah.johnson@email.com",
        description: "this is a mentor",
        location: "varanasi",
        languages: "hindi",
        yearsOfExperience: 12,
        rating: 5.5,
        videoChatPrice: 999,
        chatPrice: 1000,
        isVerified: true,
        profilePictureUrl: "adfa.dafd",
        qualifications: [
            "Ph.D. in Computer Science",
            "AWS Certified Solutions Architect"
        ],
        technicalSkills: [
            "React",
            "Node.js",
            "Cloud Architecture",
            "System Design"
        ],
        availabilitySlots: [
            {
                slot: "1am to 10am",
                isAvailable: "AVAILABLE"
            },
            {
                slot: "11am to 5pm",
                isAvailable: "UNAVAILABLE"
            }
        ],
        availabilityStatus: "Available"
    };

    const [messageDialog, setMessageDialog] = useState(false);

    const sendMessageToMentor = () => {
        setMessageDialog(!messageDialog);
    }

    const payForTextChat = async () => {
        const dataToSend = {
            userId: user.id,
            serviceId: 101,
            timeSlotBooked: timeSlotForBooking,
            mentorId: id,
            mentorName: mentor.name,
            scheduledDate: "29 Feb 2023=4"
        };

        await PaymentService.handleMentorServicePayment(mentor.videoChatPrice, dataToSend, user, setIsTextChatBooked);
        console.log("isBooked " + setIsTextChatBooked)
    }

    const handleMessageDialogClose = () => {
        setMessageDialog(false);
    }

    const [messageToMentor, setMessageToMentor] = useState();
    const submitMessageToMentorForm = async (event) => {
        event.preventDefault();
        try {
        } catch (err) {
            console.error(err);
        }
    }
    const handleMessageToMentorChange = (e) => {
        const {name, value} = e.target;
        setMessageToMentor(value);
    }

    const backToMentor = () => {
        navigate("/get-mentorship")
    }

    const [bookVideoChatDialog, setBookVideoChatDialog] = useState(false);
    const handleBookVideoChatDialogClose = () => {
        setBookVideoChatDialog(false);
    }

    useEffect(() => {
        const initializeBookingStatus = async () => {
            await checkIsBookedStatus();
        };

        if (user) {
            initializeBookingStatus();
        }
    }, [user, id]);

    const payForVideoChat = async () => {
        const dataToSend = {
            userId: user.id,
            serviceId: 100,
            timeSlotBooked: timeSlotForBooking,
            mentorId: id,
            mentorName: mentor.name,
            scheduledDate: "29 Feb 2023=4"
        };

        await PaymentService.handleMentorServicePayment(mentor.videoChatPrice, dataToSend, user, setIsVideoChatBooked);
        console.log("isBooked " + isVideoChatBooked)
    };


    const [isVideoChatBooked, setIsVideoChatBooked] = useState(false);
    const [isTextChatBooked, setIsTextChatBooked] = useState(false);

    const checkIsBookedStatus = async () => {
        if (user == null) {
            console.log("user is null")
            navigate('/login')
            return;
        }
        try {
            // Wait for the response
            const response = await MentorService.getAllBookings(user.id, id);
            if (response != null) {
                updateBookingStatus(response);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
            // Set default values in case of error
            setIsVideoChatBooked(false);
            setIsTextChatBooked(false);
        }
    }

    const updateBookingStatus = (bookings) => {
        console.log("Bookings response:", bookings);

        if (!Array.isArray(bookings)) {
            console.error("Bookings is not an array:", bookings);
            setIsVideoChatBooked(false);
            setIsTextChatBooked(false);
            return;
        }

        // Check for video chat booking
        const videoBooking = bookings.find(booking =>
            booking.serviceName === 'video_chat_service' ||
            booking.serviceId === 100
        );

        // Check for text chat booking
        const textBooking = bookings.find(booking =>
            booking.serviceName === 'text_chat_service' ||
            booking.serviceId === 101
        );

        setIsVideoChatBooked(!!videoBooking);
        setIsTextChatBooked(!!textBooking);
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const [selectedService, setSelectedService] = useState("");

    const handleClose = () => {
        setOpen(false);
    };

    const navigateToLogin = () => {
        navigate("/session/login", {state: {serviceName: selectedService}});
    }


        const BottomBookedSessionDescriptionBar = () => (
            <div
                className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-orange-800 to-orange-600 text-white py-3 z-50 shadow-lg">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <span className="animate-pulse mr-2">🚧</span>
                        <p className="text-sm font-medium">
                            Check your email for username and password to join the booked session....
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
        <span className="text-xs bg-orange-900/30 px-3 py-1 rounded-full">
          Version 0.1 Beta
        </span>
                    </div>
                </div>
            </div>
        );

        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
                {/* Top Navigation */}
                <div className="bg-black/50 backdrop-blur-sm border-b border-gray-800">
                    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <button
                            onClick={backToMentor}
                            className="flex items-center text-gray-400 hover:text-orange-500 transition-colors duration-300">
                            <ArrowLeft className="w-5 h-5 mr-2"/>
                            Back to Mentors
                        </button>
                    </div>
                </div>

                <Fragment>
                    <Dialog ref={sendMessageDialog} fullScreen open={messageDialog} onClose={handleMessageDialogClose}
                            TransitionComponent={Transition}
                            PaperProps={{
                                style: {backgroundColor: "#262626", backgroundImage: 'none'}
                            }}
                            sx={{
                                '& .MuiDialog-paper': {
                                    backgroundColor: '#262626',
                                    borderRadius: 4,
                                    backgroundImage: 'none',
                                    margin: 50,
                                    maxHeight: '50%',
                                    height: '50%',
                                    overflowY: 'auto',
                                }
                            }}
                    >
                        <AppBar sx={{position: 'relative ', background: '#C4420C'}}>
                            <Toolbar>
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={handleMessageDialogClose}
                                    aria-label="close"
                                >
                                    <RiCloseLargeLine/>
                                </IconButton>
                                <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                                    Send message to the mentor
                                </Typography>
                                <Button className="border-2 border-white" autoFocus color="inherit"
                                        onClick={handleMessageDialogClose}>
                                    Send
                                </Button>
                            </Toolbar>
                        </AppBar>

                        <div className="flex-1 bg-neutral-800 text-white overflow-hidden">
                            <form onSubmit={submitMessageToMentorForm} className="h-full flex flex-col p-6 gap-4">
                                <Input
                                    id="mentorName"
                                    value={mentor.name}
                                    disabled
                                    className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 text-white disabled:text-white focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-lg rounded-md"
                                />
                                <textarea
                                    id="messageToMentor"
                                    name="messageToMentor"
                                    placeholder="Enter your message..."
                                    value={messageToMentor}
                                    onChange={handleMessageToMentorChange}
                                    className="flex-1 w-full resize-none rounded-md px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-lg"
                                    required
                                />
                            </form>
                        </div>

                    </Dialog>

                </Fragment>

                <Fragment>
                    <Dialog fullScreen open={bookVideoChatDialog} onClose={handleBookVideoChatDialogClose}
                            TransitionComponent={Transition}
                            PaperProps={{
                                style: {backgroundColor: "#262626", backgroundImage: 'none'}
                            }}
                            sx={{
                                '& .MuiDialog-paper': {
                                    backgroundColor: '#262626',
                                    borderRadius: 4,
                                    backgroundImage: 'none',
                                    margin: 50,
                                    maxHeight: '50%',
                                    height: '50%'
                                }
                            }}
                    >
                        <AppBar sx={{position: 'relative', background: '#C4420C'}}>
                            <Toolbar>
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={handleBookVideoChatDialogClose}
                                    aria-label="close"
                                >
                                    <RiCloseLargeLine/>
                                </IconButton>
                                <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                                    Book video chat assistance with {mentor.name}
                                </Typography>
                            </Toolbar>
                        </AppBar>

                        <div className="bg-neutral-800 w-full h-full text-white flex">
                            <div className="w-3/5 ml-10 flex flex-col gap-5 py-5">
                                <div>
                                    <h2 className="text-lg mb-2">Available Slots</h2>
                                    <Select
                                        sx={{
                                            color: 'white',
                                            borderColor: 'white',
                                            borderWidth: 2,
                                            '& .MuiSelect-icon': {
                                                color: 'white'
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'white'
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'white'
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'white'
                                            }
                                        }}
                                        placeholder="Select among the available time slots"
                                        className="w-full text-center"
                                        inputProps={{'aria-label': 'Without label'}}
                                        defaultValue=""
                                    >
                                        <MenuItem value="" disabled>
                                            <em>Choose Slots</em>
                                        </MenuItem>
                                        {mentor.availabilitySlots && mentor.availabilitySlots.map((slot) => (
                                            <MenuItem
                                                disabled={slot.isAvailable !== "AVAILABLE"}
                                                key={slot.slot}
                                                value={slot.slot}
                                            >
                                                {slot.slot} - ({slot.isAvailable.toString()})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </div>
                                <textarea
                                    id="mentorName"
                                    placeholder="Describe about your issue..."
                                    className=" w-full h-full resize-none rounded-md px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-white focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-lg"
                                />
                            </div>
                            <div className="w-2/5 m-5 gap-8 flex flex-col aign-items-center justify-center p-5">
                                <h3 className="text-2xl text-center">Pay to book your slot now</h3>
                                <button onClick={payForVideoChat}
                                        className="w-full bg-orange-800 rounded-md text-xl py-2">Pay Now
                                </button>
                            </div>
                        </div>
                    </Dialog>


                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        sx={{
                            "& .MuiPaper-root": {
                                backgroundColor: "#121212", // Dark background color
                                color: "#ffffff", // White text color
                            },
                        }}
                    >
                        <DialogTitle
                            id="alert-dialog-title"
                            sx={{
                                fontSize: "19px",
                                color: "#ffffff", // White text
                            }}
                        >
                            {"WARNING"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText
                                id="alert-dialog-description"
                                sx={{
                                    color: "#ffffff", // White text
                                }}
                            >
                                Session will start once you join the call. If the session gets interrupted due to any
                                reasons the amount paid will not be refunded
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={handleClose}
                                sx={{
                                    color: "#ffffff", // White text
                                    backgroundColor: "transparent",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.1)", // Subtle hover effect
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={navigateToLogin}
                                autoFocus
                                sx={{
                                    backgroundColor: "#ff9800", // Orange-500
                                    color: "#ffffff", // White text
                                    "&:hover": {
                                        backgroundColor: "#e68900", // Darker orange on hover
                                    },
                                }}
                            >
                                Continue
                            </Button>
                        </DialogActions>
                    </Dialog>


                </Fragment>

                {/* Main Content */}
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Profile Header */}
                    <div className="relative mb-12">
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-3xl blur-xl"/>

                        <div
                            className="relative overflow-hidden rounded-3xl bg-gray-900/50 backdrop-blur-sm border border-gray-800">
                            <div className="p-8">
                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* Profile Image */}
                                    <div className="relative">
                                        <div
                                            className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl blur opacity-30"/>
                                        <img
                                            src="/api/placeholder/200/200"
                                            alt={mentor.name}
                                            className="relative w-48 h-48 rounded-2xl object-cover ring-2 ring-gray-800"
                                        />
                                        {mentor.isVerified && (
                                            <div
                                                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-orange-500 ring-2 ring-black flex items-center justify-center">
                                                <Badge size={16} className="text-black"/>
                                            </div>
                                        )}
                                    </div>

                                    {/* Profile Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-4">
                                            <h1 className="text-4xl font-bold text-white">{mentor.name}</h1>
                                            {mentor.rating && (
                                                <div
                                                    className="flex items-center px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500"/>
                                                    <span className="ml-1 text-orange-400">{mentor.rating}</span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-xl text-gray-400 mb-6">{mentor.title}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                            <div className="flex items-center text-gray-300">
                                                <Briefcase className="w-5 h-5 mr-2 text-orange-500"/>
                                                {mentor.yearsOfExperience} years experience
                                            </div>
                                            <div className="flex items-center text-gray-300">
                                                <MapPin className="w-5 h-5 mr-2 text-orange-500"/>
                                                {mentor.location}
                                            </div>
                                            <div className="flex items-center text-gray-300">
                                                <Languages className="w-5 h-5 mr-2 text-orange-500"/>
                                                {mentor.languages}
                                            </div>
                                            <div className="flex items-center text-gray-300">
                                                <Clock className="w-5 h-5 mr-2 text-orange-500"/>
                                                {mentor.availabilityStatus}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4">
                                            <button
                                                onClick={() => {
                                                    if (!isVideoChatBooked) {
                                                        setBookVideoChatDialog(true)
                                                    } else {
                                                        setSelectedService("video_chat_service")
                                                        setOpen(true)
                                                    }
                                                }}
                                                className={`px-6 flex flex-row gap-2 py-3 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 ${
                                                    isVideoChatBooked
                                                        ? 'bg-gray-600 cursor-pointer'
                                                        : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                                                }`}
                                            >
                                                <TvMinimal/>
                                                {isVideoChatBooked ? 'Video Chat Booked' : 'Book 1:1 Video Chat'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (!isTextChatBooked) {
                                                        payForTextChat()
                                                    } else {
                                                        setSelectedService("text_chat_service")
                                                        setOpen(true)
                                                    }
                                                }}
                                                className="px-6 py-3 bg-gray-800 rounded-xl text-gray-300 font-semibold hover:bg-gray-700 transition-all duration-300"
                                            >
                                                <MessageSquare className="w-5 h-5 inline mr-2"/>
                                                {isTextChatBooked ? 'Chat Booked' : 'Book 1:1 Chat'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Info Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* About Section */}
                        <div
                            className="col-span-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
                            <h2 className="text-2xl font-semibold text-white mb-6">About</h2>
                            <p className="text-gray-400 leading-relaxed">{mentor.description}</p>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-8">
                            {/* Qualifications */}
                            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
                                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                                    <GraduationCap className="w-5 h-5 mr-2 text-orange-500"/>
                                    Qualifications
                                </h3>
                                <div className="space-y-3">
                                    {mentor.qualifications.map((qual, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center text-gray-300 bg-gray-800/50 rounded-lg p-3"
                                        >
                                            <Award className="w-4 h-4 mr-2 text-orange-500"/>
                                            {qual}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Technical Skills */}
                            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
                                <h3 className="text-xl font-semibold text-white mb-4">Technical Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {mentor.technicalSkills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 text-sm rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                        >
                                        {skill}
                                    </span>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
                                <h3 className="text-xl font-semibold text-white mb-4">Contact</h3>
                                <div className="flex items-center text-gray-300 mb-3">
                                    <Mail className="w-5 h-5 mr-2 text-orange-500"/>
                                    <a href={`mailto:${mentor.email}`}
                                       className="hover:text-orange-500 transition-colors duration-300">
                                        {mentor.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {(isVideoChatBooked || isTextChatBooked) ? <BottomBookedSessionDescriptionBar/> :
                    <div/>
                }
            </div>
        );
    };

    export default MentorProfile;