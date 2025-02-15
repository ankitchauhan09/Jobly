import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
    Award,
    Book,
    Briefcase,
    Calendar,
    Clock,
    Edit,
    Github,
    Linkedin,
    LinkIcon,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Star
} from "lucide-react";
import {useUser} from "../contexts/UserContext";
import {Job_Application_Service} from "../service/Job_Application_Service.jsx";
import camera_icon from '../assets/camera.png'
import {Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle} from '@headlessui/react'
import {UserService} from "../service/UserService.jsx";
import {useSnackbar} from "./SnackbarComponent.jsx";

const UpdateProfilePictureDialog = ({isOpen, setIsOpen, profilePic, setProfilePic, updateProfilePic}) => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const profilePicRef = useRef(null);

    const handleProfilePicChange = (e) => {
        const selectedImage = e.target.files[0];
        if (!selectedImage) {
            setError("No file selected");
            return;
        }

        const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedFileTypes.includes(selectedImage.type)) {
            setError('Invalid file type. Please select a JPEG, JPG or PNG');
            return;
        }

        const maxFileSize = 3 * 1024 * 1024; // 3MB
        if (selectedImage.size > maxFileSize) {
            setError('File size exceeded the limit (3MB)');
            return;
        }

        setError('');
        setProfilePic(selectedImage);
    };
    const handleUpdateProfilePic = async () => {
        setIsLoading(true);
        try {
            await updateProfilePic();
            setIsOpen(false);
        } catch (err) {
            setError('Failed to update profile picture');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} as="div" className="relative w-full z-10 focus:outline-none"
                onClose={() => !isLoading && setIsOpen(false)}>
            <DialogBackdrop className="fixed inset-0 bg-black/70"/>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        className="w-full max-w-md h-auto max-h-[90vh] rounded-xl bg-white/5 p-6 backdrop-blur-2xl"
                    >
                        <DialogTitle as="h3" className="text-base font-medium text-white">
                            Update profile picture
                        </DialogTitle>
                        <div className="mt-2">
                            <label
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-neutral-600 border-dashed rounded-lg cursor-pointer bg-neutral-700 hover:bg-neutral-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <p className="text-sm text-neutral-400">
                                        {!profilePic && <span className="font-semibold">Click to upload</span>}
                                        {profilePic && <span className="font-semibold">{profilePic.name}</span>}
                                    </p>
                                    <p className="text-xs text-neutral-400 mt-1">JPEG, JPG or PNG (max 3MB)</p>
                                </div>
                                <input
                                    type="file"
                                    ref={profilePicRef}
                                    onChange={handleProfilePicChange}
                                    className="hidden"
                                    accept="image/jpeg,image/png,image/jpg"
                                    name="profilePic"
                                    required
                                    disabled={isLoading}
                                />
                            </label>
                            {error && (
                                <p className="mt-2 text-sm text-red-500">{error}</p>
                            )}
                        </div>
                        <div className="mt-4">
                            <Button
                                className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleUpdateProfilePic}
                                disabled={!profilePic || error || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin"/>
                                        Updating...
                                    </>
                                ) : (
                                    'Update'
                                )}
                            </Button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

const AddContactInformationDialog = ({isOpen, setIsOpen, email, contact, updateContactInformation}) => {
    const [newEmail, setNewEmail] = useState(email || '');
    const [newContact, setNewContact] = useState(contact || '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateContact = (phone) => {
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = async () => {
        // Reset previous errors
        setError('');

        // Validate email
        if (!validateEmail(newEmail)) {
            setError('Please enter a valid email address');
            return;
        }

        // Validate contact number
        if (!validateContact(newContact)) {
            setError('Please enter a valid phone number');
            return;
        }

        // If validation passes, proceed with update
        setLoading(true);
        try {
            const response = await updateContactInformation(
               newEmail,
               newContact
            );

            if (response) {
                setIsOpen(false);
            }
        } catch (err) {
            setError('Failed to update contact information');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={isOpen}
            as="div"
            className="relative w-full z-10 focus:outline-none"
            onClose={() => !loading && setIsOpen(false)}
        >
            <DialogBackdrop className="fixed inset-0 bg-black/70"/>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                    >
                        <DialogTitle
                            as="h3"
                            className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"
                        >
                            <Mail className="w-5 h-5 text-orange-500"/>
                            Update Contact Information
                        </DialogTitle>

                        {/* Email Input */}
                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={newEmail}
                                onChange={(e) => {
                                    setNewEmail(e.target.value);
                                    setError('');
                                }}
                                placeholder="your.email@example.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md
                                           focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        {/* Contact Number Input */}
                        <div className="mb-4">
                            <label
                                htmlFor="contact"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Contact Number
                            </label>
                            <input
                                id="contact"
                                type="tel"
                                value={newContact}
                                onChange={(e) => {
                                    setNewContact(e.target.value);
                                    setError('');
                                }}
                                placeholder="+1 (123) 456-7890"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md
                                           focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <p className="text-red-500 text-xs mb-4">{error}</p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700
                                           bg-white hover:bg-gray-50 border border-gray-300
                                           rounded-md focus:outline-none"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading || !newEmail || !newContact}
                                className={`
                                    px-4 py-2 text-sm font-medium rounded-md 
                                    focus:outline-none transition-colors
                                    ${(!newEmail || !newContact)
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-orange-500 text-white hover:bg-orange-600'}
                                `}
                            >
                                {loading ? 'Updating...' : 'Update'}
                            </Button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};
const AddSocialLinksDialog = ({isOpen, setIsOpen, alreadyAddedSocialLinks = [], updateSocialLinks}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [url, setUrl] = useState('');

    const socialLinks = [
        {
            label: 'github',
            tag: 'Github',
            icon: <Github className="w-6 h-6 text-gray-400 group-hover:text-black"/>,
            placeholder: 'https://github.com/username'
        },
        {
            label: 'linkedin',
            tag: 'LinkedIn',
            icon: <Linkedin className="w-6 h-6 text-gray-400 group-hover:text-black"/>,
            placeholder: 'https://linkedin.com/in/username'
        },
        {
            label: 'portfolio',
            tag: 'Portfolio',
            icon: <LinkIcon className="w-6 h-6 text-gray-400 group-hover:text-black"/>,
            placeholder: 'https://yourportfolio.com'
        },
    ];

    // Memoize the computation of availableSocialLinks
    const availableSocialLinks = useMemo(() => {
        return socialLinks.filter(
            (link) => !alreadyAddedSocialLinks.some((addedLink) => addedLink.label === link.label)
        );
    }, [alreadyAddedSocialLinks]);

    // Initialize selectedSocialLink with useMemo to prevent unnecessary re-renders
    const [selectedSocialLink, setSelectedSocialLink] = useState(() =>
        availableSocialLinks.length > 0 ? availableSocialLinks[0] : null
    );

    // Use useEffect to update selectedSocialLink when availableSocialLinks changes
    useEffect(() => {
        if (availableSocialLinks.length > 0) {
            setSelectedSocialLink(availableSocialLinks[0]);
        } else {
            setSelectedSocialLink(null);
        }
    }, [availableSocialLinks]);

    const handleSubmit = () => {
        console.log(selectedSocialLink)

        const response = {
            label: selectedSocialLink.label,
            tag: selectedSocialLink.tag,
            url: url
        }
        updateSocialLinks(response);
        setUrl('');
        setError('');
        setIsOpen(false);
    };

    return (
        <Dialog
            open={isOpen}
            as="div"
            className="relative w-full z-10 focus:outline-none"
            onClose={() => !loading && setIsOpen(false)}
        >
            <DialogBackdrop className="fixed inset-0 bg-black/70"/>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                    >
                        <DialogTitle
                            as="h3"
                            className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"
                        >
                            <LinkIcon className="w-5 h-5 text-orange-500"/>
                            Add Social Link
                        </DialogTitle>

                        {/* Social Link Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Platform
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {availableSocialLinks.map((link) => (
                                    <button
                                        key={link.label}
                                        onClick={() => setSelectedSocialLink(link)}
                                        className={`
                                            group flex flex-col items-center justify-center 
                                            p-3 rounded-lg border-2 transition-all
                                            ${selectedSocialLink?.label === link.label
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-gray-200 hover:border-orange-300'}
                                        `}
                                    >
                                        {link.icon}
                                        <span className="text-xs mt-2 text-gray-600 group-hover:text-black">
                                            {link.tag}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* URL Input */}
                        <div className="mb-4">
                            <label
                                htmlFor="social-url"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Profile URL
                            </label>
                            <input
                                id="social-url"
                                type="url"
                                onChange={(e) => {
                                    setUrl(e.target.value)
                                    setError('');
                                }}
                                placeholder={selectedSocialLink?.placeholder}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md
                                           focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            {error && (
                                <p className="text-red-500 text-xs mt-1">{error}</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700
                                           bg-white hover:bg-gray-50 border border-gray-300
                                           rounded-md focus:outline-none"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={!selectedSocialLink || !url}
                                className={`
                                    px-4 py-2 text-sm font-medium rounded-md 
                                    focus:outline-none transition-colors
                                    ${!url
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-orange-500 text-white hover:bg-orange-600'}
                                `}
                            >
                                Add Link
                            </Button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};

const ProfileSection = () => {

    const {user} = useUser();
    const [appliedJobApplications, setAppliedJobApplications] = useState([]);
    const {setUser} = useUser();
    const [profilePic, setProfilePic] = useState(null);
    const {showSnackbar} = useSnackbar();
    const [error, setError] = useState(null);
    const [validSocialLinks, setValidSocialLinks] = useState([]);
    const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
    useEffect(() => {
        console.log(user)
        if (user.socialLinks != null) {
            setValidSocialLinks(user.socialLinks.filter((links) => links.url !== '#') || []);
        } else {
            setValidSocialLinks([])
        }
        fetchAllAppliedJobsInfo(user.email);
    }, [user]);

    const fetchAllAppliedJobsInfo = async (email) => {
        const response = await Job_Application_Service.getAllApplicationsByUserEmail(email)
        if (response) {
            setAppliedJobApplications(response)
            console.log("job applications")
            console.log(response)
        }
    }

    const updateSocialLinks = async (selectedSocialLink) => {
        const response = await UserService.updateSocialLinks(selectedSocialLink, user.id);
        if (response) {
            setUser(response);
        } else {
            console.error("Invalid response while updating social links")
        }
    }


    const renderSocialIcon = (label) => {
        switch (label) {
            case 'linkedin':
                return <Linkedin className="w-6 h-6"/>;
            case 'github':
                return <Github className="w-6 h-6"/>;
            case 'portfolio':
                return <LinkIcon className="w-6 h-6"/>;
            default:
                return null;
        }
    };
    const changeProfilePicDialog = () => {
        console.log("lol")
        setIsUpdateProfilePictureDialogOpen(true)
    }

    const updateContactInformation = async (email, contact) => {
        const userToSend = user;
        console.log(email)
        userToSend.email = email;
        userToSend.contact = contact
        const response = await UserService.updateContactInformation(userToSend);
        if (response) {
            setUser(response);
            return response;
        } else {
            return null;
        }
    }

    const [isUpdateProfilePictureDialogOpen, setIsUpdateProfilePictureDialogOpen] = useState(false);

    const updateProfilePic = async () => {
        const response = await UserService.updateProfilePic(user.id, profilePic);
        if (response) {
            setUser(response);
            showSnackbar('User updated successfully..')
        } else {
            setError("")
        }
    }

    const [isAddSocialLinksDialogOpen, setIsAddSocialLinksDialogOpen] = useState(false);

    const addSocialLinks = () => {
        console.log('opening dialog')
        setIsAddSocialLinksDialogOpen(true)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            {/* Header */}
            {/*<div className="bg-black/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-10">*/}
            {/*    <div className="max-w-full mx-auto p-4">*/}
            {/*        <div className="flex items-center gap-4">*/}
            {/*            <button className="text-gray-400 hover:text-orange-500 transition-colors">*/}
            {/*                <ArrowLeft className="w-6 h-6"/>*/}
            {/*            </button>*/}
            {/*            <h1 className="text-xl font-bold">Professional Profile</h1>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className="max-w-full mx-auto p-6 px-20 space-y-8">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-3xl p-8 shadow-xl">
                    <div className="flex justify-between items-start gap-8">
                        <div className="flex gap-8">
                            <div className="relative group">
                                <div
                                    className="w-40 aspect-[3/4] relative">
                                    <div
                                        className="absolute inset-0 opacity-0 bg-black/70 group-hover:opacity-100 transition-opacity duration-150 ease-in rounded-2xl"
                                        onClick={changeProfilePicDialog}>
                                        <img src={camera_icon}
                                             alt="camera_icon"
                                             className="rounded-2xl ring-4 ring-orange-500 shadow-2xl w-full h-full object-scale-down"/>
                                    </div>
                                    <img
                                        src={`https://lh3.googleusercontent.com/d/${user.profilePicUrl}`}
                                        alt="Profile"
                                        referrerPolicy="no-referrer "
                                        className="rounded-2xl ring-4 ring-orange-500 shadow-2xl w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "";
                                        }}
                                    />

                                    <span
                                        className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-gray-900"></span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <h2 className="text-3xl font-bold">{user.name}</h2>
                                        <span
                                            className="bg-orange-500/20 text-orange-400 px-4 py-1 rounded-full text-sm font-medium border border-orange-500/20">
                                                            Looking for Internship
                                                        </span>
                                    </div>
                                    <p className="text-xl text-gray-300">
                                        {/*{user.educations.course != null ? user.educations.course : ""} @ {user.educations.university != null ? user.educations.university : ""}*/}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-gray-400">
                                    <MapPin className="w-5 h-5 text-orange-500"/>
                                    {user.address}
                                </div>

                                <div className="flex gap-4">
                                    {/*<a href="#" className="bg-gray-700/50 p-2 rounded-xl text-gray-300 hover:text-orange-500 hover:bg-gray-700 transition-all">*/}
                                    {/*    <Linkedin className="w-6 h-6"/>*/}
                                    {/*</a>*/}
                                    {/*<a href="#" className="bg-gray-700/50 p-2 rounded-xl text-gray-300 hover:text-orange-500 hover:bg-gray-700 transition-all">*/}
                                    {/*    <Github className="w-6 h-6"/>*/}
                                    {/*</a>*/}
                                    {/*<a href="#" className="bg-gray-700/50 p-2 rounded-xl text-gray-300 hover:text-orange-500 hover:bg-gray-700 transition-all">*/}
                                    {/*    <LinkIcon className="w-6 h-6"/>*/}
                                    {/*</a>*/}

                                    {validSocialLinks.length > 0 && validSocialLinks.map((item, index) => (
                                        <a
                                            key={index}
                                            href={item.url}
                                            target="_blank"
                                            className="bg-gray-700/50 p-2 rounded-xl text-gray-300 hover:text-orange-500 hover:bg-gray-700 transition-all"
                                        >
                                            {renderSocialIcon(item.label)}
                                        </a>
                                    ))}
                                    {validSocialLinks.length <= 3 &&
                                        <button onClick={addSocialLinks}
                                                className="bg-orange-500/20 text-orange-400 px-4 py-1 rounded-full text-sm font-medium border border-orange-500/20">Add
                                            Social Links</button>}
                                </div>
                            </div>
                        </div>
                        <button className="bg-gray-700/50 hover:bg-gray-700 p-3 rounded-xl transition-all">
                            <Edit className="w-5 h-5"/>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Left Column */}
                    <div className="col-span-4 space-y-8">
                        {/* Contact Info */}
                        <div className="bg-gray-800/50 rounded-3xl p-6 backdrop-blur-sm shadow-lg">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-orange-500"/>
                                Contact Information
                                <Edit onClick={() => setIsContactDialogOpen(true)}
                                      className="ml-auto align-content-end"/>
                            </h3>
                            <div className="space-y-4">
                                <a href={`mailto:${user.email}`}
                                   className="flex items-center gap-3 text-gray-300 hover:text-orange-500 transition-colors p-2 rounded-lg hover:bg-gray-700/50">
                                    <Mail className="w-5 h-5"/>
                                    <span>{user.email}</span>
                                </a>
                                <a href="tel:+15551234567"
                                   className="flex items-center gap-3 text-gray-300 hover:text-orange-500 transition-colors p-2 rounded-lg hover:bg-gray-700/50">
                                    <Phone className="w-5 h-5"/>
                                    <span>{user.contact}</span>
                                </a>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="bg-gray-800/50 rounded-3xl p-6 backdrop-blur-sm shadow-lg">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Star className="w-5 h-5 text-orange-500"/>
                                Technical Skills
                                <Edit className="ml-auto align-content-end"/>
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-400 mb-2">Frontend Development</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {["React", "JavaScript", "HTML5", "CSS3", "TypeScript"].map((skill) => (
                                            <span key={skill}
                                                  className="bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-sm border border-orange-500/20">
                                                                {skill}
                                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-400 mb-2">Backend & Tools</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {["Python", "Node.js", "SQL", "Git", "AWS"].map((skill) => (
                                            <span key={skill}
                                                  className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/20">
                                                                {skill}
                                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-span-8 space-y-8">
                        {/* Application History */}
                        <div className="bg-gray-800/50 rounded-3xl p-6 backdrop-blur-sm shadow-lg">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-orange-500"/>
                                Application History
                            </h3>
                            <div className="space-y-4">
                                {/*{[*/}
                                {/*    {*/}
                                {/*        company: "TechCorp",*/}
                                {/*        position: "Software Engineer Intern",*/}
                                {/*        status: "In Review",*/}
                                {/*        days: 3*/}
                                {/*    },*/}
                                {/*    {*/}
                                {/*        company: "InnovateTech",*/}
                                {/*        position: "Frontend Developer Intern",*/}
                                {/*        status: "In Review",*/}
                                {/*        days: 3*/}
                                {/*    },*/}
                                {/*    {*/}
                                {/*        company: "FutureLabs",*/}
                                {/*        position: "Full Stack Developer Intern",*/}
                                {/*        status: "In Review",*/}
                                {/*        days: 3*/}
                                {/*    }*/}
                                {/*]*/}
                                {appliedJobApplications.map((application, index) => (
                                    <div key={index}
                                         className="bg-gray-900/50 rounded-2xl p-5 hover:bg-gray-900/80 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-4">
                                                <div className="w-14 aspect-[3/4]">
                                                    <img
                                                        src="/api/placeholder/42/56"
                                                        alt="Company"
                                                        className="rounded-xl w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-lg">
                                                        {application.body.currentRole !== "NIL" ? application.body.currentRole : "Position Not Specified"}
                                                    </h4>
                                                    <p className="text-gray-400">
                                                        {application.body.currentCompanyName !== "NIL" ? application.body.currentCompanyName : "Company Not Specified"}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-3">
                                    <span
                                        className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm border border-orange-500/20">
                                        Applied
                                    </span>
                                                        <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <Clock className="w-4 h-4"/>
                                                            {application.body.firstName} {application.body.lastName}
                                    </span>
                                                    </div>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-400">Cover
                                                            Letter: {application.body.coverLetter}</p>
                                                        {application.body.linkedInProfileUrl !== "NIL" && (
                                                            <a
                                                                href={application.body.linkedInProfileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-orange-400 hover:text-orange-500 flex items-center gap-1 mt-1"
                                                            >
                                                                <Linkedin className="w-4 h-4"/>
                                                                LinkedIn Profile
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Education */}
                        <div className="bg-gray-800/50 rounded-3xl p-6 backdrop-blur-sm shadow-lg">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Book className="w-5 h-5 text-orange-500"/>
                                Education
                                <Edit className="ml-auto align-content-end"/>
                            </h3>
                            <div className="flex gap-6 items-start">
                                <div className="w-16 aspect-[3/4]">
                                    <img
                                        src="/api/placeholder/48/64"
                                        alt="University"
                                        className="rounded-xl w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold">Stanford University</h4>
                                    <p className="text-lg text-gray-300">BS in Computer Science</p>
                                    <div className="flex items-center gap-4 mt-2 text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4"/>
                                                            2021 - 2025
                                                        </span>
                                        <span className="flex items-center gap-1">
                                                            <Award className="w-4 h-4"/>
                                                            GPA: 3.8/4.0
                                                        </span>
                                    </div>
                                    <p className="mt-4 text-gray-300">
                                        Relevant Coursework: Data Structures, Algorithms, Computer Systems, Database
                                        Management, Web Development
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <UpdateProfilePictureDialog isOpen={isUpdateProfilePictureDialogOpen}
                                        setIsOpen={setIsUpdateProfilePictureDialogOpen}
                                        profilePic={profilePic}
                                        setProfilePic={setProfilePic}
                                        updateProfilePic={updateProfilePic}
            />
            <AddSocialLinksDialog isOpen={isAddSocialLinksDialogOpen}
                                  setIsOpen={setIsAddSocialLinksDialogOpen}
                                  alreadyAddedSocialLinks={user.socialLinks ? user.socialLinks : []}
                                  updateSocialLinks={updateSocialLinks}
            />
            <AddContactInformationDialog isOpen={isContactDialogOpen} setIsOpen={setIsContactDialogOpen}
                                         contact={user.contact} email={user.email}
                                         updateContactInformation={updateContactInformation}/>
        </div>
    )
        ;
};

export default ProfileSection;