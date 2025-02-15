import React, {Fragment, useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Job_Service} from "../service/Job_Service.jsx";
import {
    Award,
    BadgeCheck,
    BriefcaseBusiness,
    Building2,
    CheckCircle2,
    Clock,
    DollarSign,
    GraduationCap,
    MapPin,
    Target,
    Users
} from 'lucide-react';
import {useUser} from "../contexts/UserContext.jsx";
import {useSnackbar} from "./SnackbarComponent.jsx";
import {Button, CircularProgress, IconButton, Input, Toolbar, Typography} from "@mui/material";
import {RiCloseLargeLine} from "react-icons/ri";
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import {Label, Textarea} from "flowbite-react";
import {Job_Application_Service} from "../service/Job_Application_Service.jsx";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const JobDetailsSection = () => {
    const {jobID} = useParams();
    const [jobData, setJobData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const {user} = useUser();
    const navigate = useNavigate();
    const {showSnackbar} = useSnackbar();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contact: '',
        currentCompanyName: '',
        currentRole: '',
        yearsOfExperience: '',
        linkedInProfileUrl: '',
        portfolioUrl: '',
        coverLetter: '',
        jobId: `${jobID}`
    });

    const [resume, setResume] = useState(null);
    const resumeInputRef = useRef(null);
    const [resumeError, setResumeError] = useState("");
    const applyNowButton = useRef();
    const [isAppliedForJob, setIsAppliedForJob] = useState(false);
    const [isCheckingApplication, setIsCheckingApplication] = useState(true);

    const handleResumeInputChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
            setResumeError("No file selected")
        } else {
            const allowedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
            if (!allowedFileTypes.includes(selectedFile.type)) {
                setResumeError("Invalid file type. Please upload a PDF or DOCX")
            } else {
                const maxFileSize = 5 * 1024 * 1024;
                if (selectedFile.size > maxFileSize) {
                    setResumeError("File size exceeded 5MB limit");
                } else {
                    setResumeError("");
                    setResume(selectedFile);
                }
            }
        }
    }


    const checkApplicationStatus = async () => {
        if (!user?.id || !jobID) {
            setIsAppliedForJob(false);
            setIsCheckingApplication(false);
            return;
        }

        try {
            setIsCheckingApplication(true);
            const response = await Job_Application_Service.isAlreadyApplied(jobID, user.id);
            // Ensure we're dealing with actual boolean values
            setIsAppliedForJob(response === true || response === "true");
        } catch (error) {
            console.error("Error checking application status:", error);
            setIsAppliedForJob(false);
            showSnackbar("Error checking application status", "error");
        } finally {
            setIsCheckingApplication(false);
        }
    };


    // Separate useEffect for checking application status
    useEffect(() => {
        checkApplicationStatus();
    }, [user, jobID]); // Dependencies to ensure it reruns when user or jobID changes

    // Debug useEffect to monitor state changes
    useEffect(() => {
        console.log("isAppliedForJob state updated:", isAppliedForJob);
    }, [isAppliedForJob]);


    const handleRemoveFile = () => {
        resume(null);
        setResumeError('');
        if (resumeInputRef.current) {
            resumeInputRef.current.value = '';
        }
        onFileSelect(null);
    };


    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!open);
    };

    const fetchJobDetails = async () => {
        try {
            const response = await Job_Service.getJobById(jobID);
            if (response) {
                setJobData(response);
            } else {
                console.log("Received invalid response");
            }
        } catch (error) {
            console.error("Error fetching job details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const applyForJob = () => {
        if (user == null) {
            navigate('/login');
        } else {
            showSnackbar("Applying for job");
            handleOpen();
        }
    };

    useEffect(() => {
        fetchJobDetails();
    }, [jobID]);

    const formatSalary = (salary) => {
        return salary ? `$${salary.toLocaleString()}` : 'Not Specified';
    };

    const handleDialogOpen = () => {
        if (user == null) {
            navigate('/login');
        } else {
            showSnackbar("Opening job application form");
            setIsDialogOpen(true);
        }
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Form validation
        if (!resume) {
            console.error("Please upload your resume");
            return;
        }
        try {
            console.log(formData)
            setIsLoading(true);
            formData.userId = user.id;
            const result = await Job_Application_Service.submitJobApplication(JSON.stringify(formData), resume);
            if (result) {
                // Show success message
                console.log("Application submitted successfully!");
                handleDialogClose();
                await checkApplicationStatus();
            } else {
                // Show error message
                console.error(result.error);
            }
        } catch (error) {
            console.error("Failed to submit application. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div
            className="min-h-screen bg-neutral-900 text-white flex items-center justify-center flex flex-row gap-10">
            <h1>Loading...</h1>
            <CircularProgress/>
        </div>;
    }
    if (!jobData) {
        return <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
            Job not found
        </div>;
    }
    return (
        <>
            <div className="h-fit bg-neutral-900 text-white">
                <Fragment>
                    <Dialog
                        fullScreen
                        open={isDialogOpen}
                        onClose={handleDialogClose}
                        TransitionComponent={Transition}
                        PaperProps={{
                            style: {
                                backgroundColor: '#262626', // dark neutral background
                                backgroundImage: 'none',
                            }
                        }}
                        sx={{
                            '& .MuiDialog-paper': {
                                backgroundColor: '#262626',
                                backgroundImage: 'none',
                                margin: 0,
                                maxHeight: '100%',
                                height: '100%',
                                overflowY: 'auto',
                            }
                        }}
                    >
                        <AppBar sx={{position: 'relative ', background: '#C4420C'}}>
                            <Toolbar>
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={handleDialogClose}
                                    aria-label="close"
                                >
                                    <RiCloseLargeLine/>
                                </IconButton>
                                <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                                    Fill the details to apply for the job
                                </Typography>
                                <Button autoFocus color="inherit" onClick={handleDialogClose}>
                                    Save
                                </Button>
                            </Toolbar>
                        </AppBar>

                        <div className="w-full h-full bg-neutral-800 text-white">
                            <form onSubmit={handleSubmit} className="space-y-6 text-white  px-10 py-6">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="block text-xl text-white mb-2 mt-4">First
                                                Name</Label>
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName" className="block text-xl text-white mb-2 mt-4">Last
                                                Name</Label>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email"
                                                   className="block text-xl text-white mb-2 mt-4">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="block text-xl text-white mb-2 mt-4">Phone
                                                Number</Label>
                                            <Input
                                                id="phone"
                                                name="contact"
                                                type="tel"
                                                value={formData.contact}
                                                onChange={handleChange}
                                                className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Professional Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentCompany"
                                                   className="block text-xl text-white mb-2 mt-4">Current
                                                Company</Label>
                                            <Input
                                                id="currentCompany"
                                                name="currentCompanyName"
                                                value={formData.currentCompanyName}
                                                onChange={handleChange}
                                                className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="currentRole" className="block text-xl text-white mb-2 mt-4">Current
                                                Role</Label>
                                            <Input
                                                id="currentRole"
                                                name="currentRole"
                                                value={formData.currentRole}
                                                onChange={handleChange}
                                                className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="yearsOfExperience"
                                                   className="block text-xl text-white mb-2 mt-4">Years of
                                                Experience</Label>
                                            <Input
                                                id="yearsOfExperience"
                                                name="yearsOfExperience"
                                                type="number"
                                                value={formData.yearsOfExperience}
                                                onChange={handleChange}
                                                className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Online Presence */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Online Presence</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="linkedinProfile" className="block text-xl text-white mb-2 mt-4">LinkedIn
                                            Profile</Label>
                                        <Input
                                            id="linkedinProfile"
                                            name="linkedInProfileUrl"
                                            value={formData.linkedInProfileUrl}
                                            onChange={handleChange}
                                            className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="portfolio" className="block text-xl text-white mb-2 mt-4">Portfolio
                                            URL</Label>
                                        <Input
                                            id="portfolio"
                                            name="portfolioUrl"
                                            value={formData.portfolioUrl}
                                            onChange={handleChange}
                                            className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Cover Letter */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Cover Letter</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="coverLetter" className="block text-xl text-white mb-2 mt-4">Why
                                            are you interested in this position?</Label>
                                        <Textarea
                                            id="coverLetter"
                                            name="coverLetter"
                                            value={formData.coverLetter}
                                            onChange={handleChange}
                                            className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Resume Upload */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Resume</h3>
                                    <div className="flex items-center justify-center w-full">
                                        <label
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-neutral-600 border-dashed rounded-lg cursor-pointer bg-neutral-700 hover:bg-neutral-600">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <p className="text-sm text-neutral-400">
                                                    <span className="font-semibold">Click to upload</span> or drag and
                                                    drop
                                                </p>
                                                <p className="text-xs text-neutral-400">PDF or DOCX (MAX. 5MB)</p>
                                            </div>
                                            <input type="file" ref={resumeInputRef} onChange={handleResumeInputChange}
                                                   className="hidden" accept=".pdf,.docx" name="resume" required/>
                                        </label>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r py-2 rounded-md from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                                >
                                    Submit Application
                                </button>
                            </form>
                        </div>
                    </Dialog>
                </Fragment>

                {/* Hero Section */}
                <div className="bg-neutral-800 border-b border-neutral-700">
                    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-2 text-orange-500 mb-4">
                                {jobData.employmentType && (
                                    <span className="px-3 py-1 bg-orange-500/20 rounded-full text-sm">
                                            {jobData.employmentType}
                                        </span>
                                )}
                                {jobData.workplaceType && (
                                    <span className="px-3 py-1 bg-orange-500/20 rounded-full text-sm">
                                            {jobData.workplaceType}
                                        </span>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                {jobData.title}
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-neutral-300">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-orange-500"/>
                                    <span>{jobData.company}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-orange-500"/>
                                    <span>{jobData.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-orange-500"/>
                                    <span>
                                            {formatSalary(jobData.minSalary)} - {formatSalary(jobData.maxSalary)}
                                        </span>
                                </div>
                                {jobData.minExperience && (
                                    <div className="flex items-center gap-2">
                                        <BriefcaseBusiness className="w-5 h-5 text-orange-500"/>
                                        <span>{jobData.minExperience}+ years experience</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Overview Section */}
                            <section>
                                <h2 className="text-2xl font-bold mb-6">Overview</h2>
                                <p className="text-neutral-300 leading-relaxed">
                                    {jobData.description}
                                </p>
                            </section>

                            {/* Required Skills */}
                            {jobData.requiredSkills && jobData.requiredSkills.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-bold mb-6">Required Skills</h2>
                                    <div className="flex flex-wrap gap-3 mb-8">
                                        {jobData.requiredSkills.map((skill, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 bg-orange-500/20 text-orange-500 px-4 py-2 rounded-full"
                                            >
                                                <BadgeCheck className="w-4 h-4"/>
                                                <span>{skill}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Preferred Skills */}
                            {jobData.preferredSkills && jobData.preferredSkills.length > 0 && (
                                <section>
                                    <h3 className="text-xl font-semibold mb-4">Preferred Skills</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {jobData.preferredSkills.map((skill, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 bg-neutral-700 text-neutral-300 px-4 py-2 rounded-full"
                                            >
                                                <Target className="w-4 h-4"/>
                                                <span>{skill}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Quick Apply Card */}
                            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 sticky top-8">
                                <h3 className="text-xl font-bold mb-4">Quick Apply</h3>
                                <button
                                    disabled={isAppliedForJob || isCheckingApplication}
                                    onClick={handleDialogOpen}
                                    className={`w-full bg-gradient-to-r ${
                                        isAppliedForJob
                                            ? 'from-gray-500 to-gray-600 cursor-not-allowed'
                                            : 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                                    } text-white px-6 py-3 rounded-lg transition-all text-lg font-medium mb-4`}
                                >
                                    {isCheckingApplication ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <CircularProgress size={20} color="inherit"/>
                                            <span>Checking status...</span>
                                        </div>
                                    ) : isAppliedForJob ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <CheckCircle2 className="w-5 h-5"/>
                                            <span>Already Applied</span>
                                        </div>
                                    ) : (
                                        'Apply Now'
                                    )}
                                </button>
                                <div className="flex items-center justify-center text-neutral-400">
                                    <Clock className="w-4 h-4 mr-2"/>
                                    <span>Quick apply takes less than 5 minutes</span>
                                </div>
                            </div>

                            {/* Company Info Card */}
                            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                                <h3 className="text-xl font-bold mb-4">About the Company</h3>
                                <div className="space-y-4 text-neutral-300">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-orange-500"/>
                                        <span>Industry: {jobData.industryType}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-orange-500"/>
                                        <span>Department: {jobData.departmentName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="w-5 h-5 text-orange-500"/>
                                        <span>Education: {jobData.educationLevel}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Award className="w-5 h-5 text-orange-500"/>
                                        <span>Career Level: {jobData.careerLevel}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Benefits Section */}
                            {jobData.benefits && jobData.benefits.length > 0 && (
                                <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                                    <h3 className="text-xl font-bold mb-4">Benefits</h3>
                                    <div className="space-y-3">
                                        {jobData.benefits.map((benefit, index) => (
                                            <div key={index} className="flex items-center gap-2 text-neutral-300">
                                                <CheckCircle2 className="w-5 h-5 text-orange-500"/>
                                                <span>{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default JobDetailsSection;