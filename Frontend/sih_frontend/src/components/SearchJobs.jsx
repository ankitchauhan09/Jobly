import React, {Fragment, useEffect, useRef, useState} from "react";
import {RiFilter2Fill, RiFileCloseFill} from 'react-icons/ri';
import {IconButton, Slider, TablePagination, Toolbar} from "@mui/material";
import {useLoadScript} from "@react-google-maps/api";
import {Job_Service} from "../service/Job_Service.jsx";
import JobCard from "./ui-components/JobCard.jsx";
import {useNavigate} from "react-router-dom";


const jobTypesOptions = ["REMOTE", "INTERNSHIP", "PART TIME", "HYBRID", "ONSITE"];
const salaryMarks = [
    {value: 2, label: "2"},
    {value: 4, label: "4"},
    {value: 6, label: "6"},
    {value: 8, label: "8"},
    {value: 10, label: "10"},
    {value: 12, label: "12"},
];
const experienceLevelOptions = ["0 Years", "1 Years", "2 Years", "3 Years", "4 Years", "5+ Years"];

const DEMO_JOBS = [
    {
        id: 1,
        title: "Senior Software Engineer",
        departmentName: "Engineering",
        employmentType: "FULL TIME",
        careerLevel: "Senior",
        location: "Bangalore, India",
        minSalary: 1800000,
        maxSalary: 2500000,
        minExperience: 5,
        educationLevel: "Bachelor's Degree",
        requiredSkills: [   "React", "Node.js", "TypeScript", "AWS"],
        benefits: ["Health Insurance", "Stock Options", "Remote Work"],
    },
    {
        id: 2,
        title: "Product Designer",
        departmentName: "Design",
        employmentType: "REMOTE",
        careerLevel: "Mid-Level",
        location: "Mumbai, India",
        minSalary: 1200000,
        maxSalary: 1800000,
        minExperience: 3,
        educationLevel: "Bachelor's/Master's in Design",
        requiredSkills: ["Figma", "UI/UX", "Product Thinking", "Wireframing"],
        benefits: ["Flexible Hours", "Learning Budget", "Home Office Setup"],
    },
    {
        id: 3,
        title: "Marketing Manager",
        departmentName: "Marketing",
        employmentType: "HYBRID",
        careerLevel: "Mid-Senior",
        location: "Delhi, India",
        minSalary: 1500000,
        maxSalary: 2000000,
        minExperience: 4,
        educationLevel: "MBA Marketing",
        requiredSkills: ["Digital Marketing", "Content Strategy", "Analytics", "Team Management"],
        benefits: ["Performance Bonus", "Health Insurance", "Gym Membership"],
    },
];

const libraries = ["places"];

const SearchJobs = () => {
    const {isLoaded} = useLoadScript({
        googleMapsApiKey: "AIzaSyBDzkcCo1Gn3KnSGDV9IUW1CnydpfXQOdk",
        libraries,
    });

    const navigate = useNavigate();

    const [selectedAddress, setSelectedAddress] = useState("");
    const [selectedPlace, setSelectedPlace] = useState(null);
    const addressAutoCompleteRef = useRef();
    const [jobProfiles, setJobProfiles] = useState([]);
    const [isProfileSuggestionsOpen, setIsProfileSuggestionsOpen] = useState(false);
    const [selectedJobProfiles, setSelectedJobProfiles] = useState([]);
    const [profileInputValue, setProfileInputValue] = useState("");
    const [selectedJobTypes, setSelectedJobTypes] = useState([]);
    const [jobTypesInputValue, setJobTypesInputValue] = useState("");
    const [isJobTypeSuggestionsOpen, setIsJobTypeSuggestionsOpen] = useState(false);
    const [selectedSalaryValue, setSelectedSalaryValue] = useState(2);
    const [experienceLevel, setExperienceLevel] = useState(0);
    const [isExperienceLevelOpen, setIsExperienceLevelOpen] = useState(false);

    const [jobKeyword, setJobKeyword] = useState("");
    const [jobCount, setJobCount] = useState(100);
    const [jobPerPage, setJobPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [allJobs, setAllJobs] = useState([]);

    useEffect(() => {
        if (isLoaded) {
            const autoComplete = new window.google.maps.places.Autocomplete(addressAutoCompleteRef.current, {
                componentRestrictions: {country: "in"},
                types: ["(cities)"],
            });

            autoComplete.addListener("place_changed", () => {
                const place = autoComplete.getPlace();
                setSelectedPlace(place);
                setSelectedAddress(place.name);
            });
        }
    }, [isLoaded]);

    useEffect(() => {
        fetchJobProfiles();
        fetchJobs();
    }, []);

    const fetchJobProfiles = async () => {
        try {
            const response = await Job_Service.getAllJobProfiles();
            if (response) {
                setJobProfiles(response);
            } else {
                console.error("Invalid response:", response);
            }
        } catch (error) {
            console.error("Error while fetching job profiles:", error);
        }
    };

    const searchJobByKeyword = async () => {
        try {
            const response = await Job_Service.searchJobsWithKeyword(jobKeyword);
            if (response && Array.isArray(response)) {
                console.log(response);
                setAllJobs(response)
            } else {
                console.log("invalid response")
                console.log(response);
                setAllJobs([]);
            }
        } catch (error) {
            console.error("Error while fetching job with keyword : ", error);
            setAllJobs([]);
        }
    }

    const BottomDevelopmentBanner = () => (
        <div
            className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-orange-800 to-orange-600 text-white py-3 z-50 shadow-lg">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center">
                    <span className="animate-pulse mr-2">🚧</span>
                    <p className="text-sm font-medium">
                        Website Under Development - Currently Displaying Demo Data
                    </p>
                </div>
                <div className="flex items-center gap-3">
        <span className="text-xs bg-orange-900/30 px-3 py-1 rounded-full">
          Version 0.1 Beta
        </span>
                    {/*<button*/}
                    {/*    onClick={() => window.open('https://github.com/yourusername/yourrepo', '_blank')}*/}
                    {/*    className="bg-white text-orange-600 px-4 py-1 rounded-full text-sm hover:bg-orange-100 transition-colors flex items-center gap-2"*/}
                    {/*>*/}
                    {/*    <span>View Project</span>*/}
                    {/*    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                    {/*        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />*/}
                    {/*    </svg>*/}
                    {/*</button>*/}
                </div>
            </div>
        </div>
    );

    const fetchJobs = async () => {
        try {
            const response = await Job_Service.getAllJobs(page, jobPerPage);
            if (response && Array.isArray(response)) {
                console.log(response)
                setAllJobs(response); // Assuming response is an array of jobs
                setJobCount(response.length);

            } else {
                console.error("Unexpected error format:", response);
                setAllJobs([]);
                setJobCount(0);
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
            setAllJobs([]);
            setJobCount(0);
        }
    };

    const handleJobCardClick = (job) => {
        console.log("Job Card Clicked");
        console.log(job);
        navigate(`/job-details/${job.id}`)
    };

    const handleJobProfileSelected = (profileName) => {
        if (!selectedJobProfiles.includes(profileName)) {
            setSelectedJobProfiles([...selectedJobProfiles, profileName]);
        }
        setProfileInputValue("");
    };

    const handleSelectAndClose = (profileName) => {
        handleJobProfileSelected(profileName);
    };

    const handleJobTypeSelected = (option) => {
        if (!selectedJobTypes.includes(option)) {
            setSelectedJobTypes([...selectedJobTypes, option]);
        }
        setJobTypesInputValue("");
        setIsJobTypeSuggestionsOpen(false);
    };

    const handleSearchJobWithFilter = () => {
        const params = {
            title: selectedJobProfiles.join(","),
            employmentType: selectedJobTypes.join(","),
            minSalary: selectedSalaryValue * 100000,
            minExperience: experienceLevel === "5+ Years" ? 5 : parseInt(experienceLevel),
            location: selectedAddress,
            page: page,
            size: jobPerPage,
        };
        try {
            const response = Job_Service.getJobsWithFilter(params);
            if (response && Array.isArray(response)) {
                setAllJobs(response);
                setJobCount(response.length);
            } else {
                console.error("Unexpected error format:", response);
                setAllJobs([]);
                setJobCount(0);
            }
        } catch (error) {
            console.error("Error fetching filtered jobs:", error);
            setAllJobs([]);
            setJobCount(0);
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const rowsPerPageChange = (event) => {
        setJobPerPage(event.target.value);
        fetchJobs()
    };


    return (
        <div className="relative w-full min-h-screen bg-grey-900">

            <div
                id="searchBox"
                className="w-3/5 h-fit mb-4 mt-10 rounded-lg border-white flex m-auto flex-row items-center"
            >
                <div className="relative h-fit flex w-full">
                    <form
                        className="relative h-fit flex w-full"
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <input
                            type="text"
                            value={jobKeyword}
                            onChange={(e) => setJobKeyword(e.target.value)}
                            placeholder="Search Jobs by keyword"
                            className="text-white w-full text-3xl rounded-md px-6 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 pr-36"
                        />
                        <button
                            onClick={searchJobByKeyword}
                            className="text-white absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 text-lg rounded-md bg-gradient-to-r from-orange-500 to-orange-800 hover:from-orange-600 hover:to-orange-900 transition-colors duration-300"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>

            <div
                className="h-screen no-scrollbar overflow-x-hidden box-border flex md:flex-col flex-col lg:flex-row w-full backdrop-blur bg-[#0c0c0ca1] absolute z-10"
            >
                <div id="filter-section" className="lg:w-3/12 md:w-full h-screen relative">
                    <div
                        id="filter-card"
                        className="backdrop-blur-lg bg-[#3a3a3a] rounded-md w-4/5 h-fit mx-auto mt-20"
                    >
                        <h3 className="text-white text-2xl font-plain flex px-6 py-4 items-center">
                            <RiFilter2Fill size={24} color="white" className="mr-2"/>
                            <span className="text-white">Filters</span>
                        </h3>

                        <div className="w-full bg-white h-0.5 mb-10"></div>

                        <div id="filters-fields" className="px-6 py-3">
                            {/* job profile filter section  */}
                            <label htmlFor="select_role" className="block text-white mb-2">
                                Select Profile
                            </label>
                            <div className="relative">
                                <input
                                    id="feedback"
                                    name="select_role"
                                    type="text"
                                    value={profileInputValue}
                                    onChange={(e) => {
                                        setProfileInputValue(e.target.value);
                                        setIsProfileSuggestionsOpen(true);
                                    }}
                                    on
                                    onFocus={() => setIsProfileSuggestionsOpen(true)}
                                    onBlur={() => setTimeout(() => setIsProfileSuggestionsOpen(false), 100)}
                                    autoComplete="off"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                    placeholder="Select Role"
                                />
                                <div
                                    className={`absolute left-0 z-10 right-0 mt-1 p-1 overflow-y-scroll opacity-0 max-h-0 custom-scrollbar transition-all duration-300 ease-in-out ${
                                        isProfileSuggestionsOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                                    }`}
                                >
                                    <ul className="w-full rounded-md backdrop-blur-lg bg-[#ffffffab] shadow-lg overflow-hidden">
                                        {jobProfiles.map((profile) => (
                                            <li
                                                key={profile.id}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => handleSelectAndClose(profile.profileName)}
                                                className="px-3 py-2 text-black hover:bg-gray-200 cursor-pointer"
                                            >
                                                {profile.profileName}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div
                                id="selectedprofiles"
                                className="mt-4 flex flex-wrap gap-2"
                            >
                                {selectedJobProfiles.map((profile, index) => (
                                    <div
                                        key={index}
                                        className="bg-orange-500 text-white px-2 py-1 rounded-full text-sm flex items-center"
                                    >
                                        {profile}
                                        <button
                                            onClick={() => {
                                                setSelectedJobProfiles(
                                                    selectedJobProfiles.filter((p) => p !== profile)
                                                );
                                            }}
                                            className="ml-2 focus:outline-none"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* job type filter section starts */}
                            <label
                                htmlFor="select_job_type"
                                className="block text-white mb-2 mt-4"
                            >
                                Select Job Type
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="select_job_type"
                                    id="select_job_type"
                                    value={jobTypesInputValue}
                                    onChange={(e) => {
                                        setJobTypesInputValue(e.target.value);
                                        setIsJobTypeSuggestionsOpen(true);
                                    }}
                                    onBlur={() => setTimeout(() => setIsJobTypeSuggestionsOpen(false), 100)}
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                    placeholder="Select Job Type"
                                />
                                <div
                                    className={`absolute left-0 z-10 right-0 mt-1 overflow-hidden transition-all duration-300 ease-in-out ${
                                        isJobTypeSuggestionsOpen ? "max-h-60" : "max-h-0"
                                    }`}
                                >
                                    <ul className="w-full rounded-md backdrop-blur-lg bg-[#ffffffab] shadow-lg">
                                        {jobTypesOptions.map((option, index) => (
                                            <li
                                                key={index}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => {
                                                    handleJobTypeSelected(option);
                                                }}
                                                className="px-3 py-2 text-black hover:bg-gray-200 cursor-pointer"
                                            >
                                                {option}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div
                                id="selectedJobTypes"
                                className="mt-4 flex flex-wrap gap-2"
                            >
                                {selectedJobTypes.map((jobType, index) => (
                                    <div
                                        key={index}
                                        className="bg-orange-500 text-white px-2 py-1 rounded-full text-sm flex items-center"
                                    >
                                        {jobType}
                                        <button
                                            onClick={() => {
                                                setSelectedJobTypes(
                                                    selectedJobTypes.filter((p) => p !== jobType)
                                                );
                                            }}
                                            className="ml-2 focus:outline-none"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* salary range filter section start  */}
                            <label
                                htmlFor="select_salary_range"
                                className="block text-white mb-2 mt-4"
                            >
                                Select Annual Salary (in lakhs)
                            </label>
                            <Slider
                                value={selectedSalaryValue}
                                defaultValue={2}
                                step={2}
                                marks={salaryMarks}
                                min={2}
                                max={12}
                                onChange={(event, newValue) => setSelectedSalaryValue(newValue)}
                                sx={{
                                    "& .MuiSlider-markLabel": {
                                        color: "white",
                                    },
                                }}
                            />

                            {/* experience filter section start  */}
                            <label
                                htmlFor="select_experience"
                                className="block text-white mb-2 mt-4"
                            >
                                Select Experience Level
                            </label>
                            <div className="relative">
                                <input
                                    value={``}
                                    type="text"
                                    name="select_experience"
                                    id="select_experience"
                                    onFocus={() => setIsExperienceLevelOpen(true)}
                                    onBlur={() => setTimeout(() => setIsExperienceLevelOpen(false), 100)}
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                    placeholder="Select Experience"
                                />
                                <div
                                    className={`absolute left-0 z-10 right-0 mt-1 overflow-hidden transition-all duration-300 ease-in-out ${
                                        isExperienceLevelOpen ? "max-h-60" : "max-h-0"
                                    }`}
                                >
                                    <ul className="w-full rounded-md backdrop-blur-lg bg-[#ffffffab] shadow-lg">
                                        {experienceLevelOptions.map((option, index) => (
                                            <li
                                                key={index}
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => setExperienceLevel(option)}
                                                className="px-3 py-2 text-black hover:bg-gray-200 cursor-pointer"
                                            >
                                                {option}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div
                                id="selectedExperienceLevel"
                                className="mt-4 flex flex-wrap gap-2"
                            >
                                {experienceLevel === 0 ? (
                                    <></>
                                ) : (
                                    <div
                                        className="bg-orange-500 text-white px-2 py-1 rounded-full text-sm flex items-center"
                                    >
                                        {experienceLevel}
                                    </div>
                                )}
                            </div>

                            {/* location filter section starts  */}
                            <label
                                htmlFor="select_job_location"
                                className="block text-white mb-2 mt- 4"
                            >
                                Select Desired Job Location
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="select_job_location"
                                    id="select_job_location"
                                    ref={addressAutoCompleteRef}
                                    value={selectedAddress}
                                    onChange={(e) => setSelectedAddress(e.target.value)}
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                    placeholder="Job Location"
                                />
                            </div>

                            <div className="relative">
                                <button
                                    onClick={handleSearchJobWithFilter}
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-800 mt-4"
                                >
                                    Search Jobs
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    id="job-cards-sections"
                    className="lg:w-9/12 md:w-full px-10 mt-6 h-full flex flex-col no-scrollbar"
                >
                    <div>
                        <TablePagination
                            className="text-white"
                            component="div"
                            count={jobCount}
                            page={page}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={(event) => rowsPerPageChange(event)}
                            rowsPerPage={jobPerPage}
                            sx={{
                                color: "white",
                                "& .MuiTablePagination-selectLabel": {
                                    color: "white",
                                },
                                "& .MuiTablePagination-select": {
                                    color: "white",
                                },
                                "& .MuiTablePagination-selectIcon": {
                                    color: "white",
                                },
                                "& .MuiTablePagination-displayedRows": {
                                    color: "white",
                                },
                                "& .MuiTablePagination-actions": {
                                    color: "white",
                                },
                                "& .MuiIconButton-root": {
                                    color: "white",
                                },
                            }}
                        />
                    </div>
                    {allJobs.map((job) => (
                        <JobCard
                            key={job.id}
                            jobData={job}
                            onClick={() => handleJobCardClick(job)}
                        />
                    ))}
                    <div id="job-card-body-section" className="h-4/5"></div>
                </div>
            </div>
            <BottomDevelopmentBanner/>
        </div>
    );
};

export default SearchJobs;