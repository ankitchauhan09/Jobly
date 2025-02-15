import React, { useEffect } from 'react';
import { BriefcaseBusiness, Building2, Clock, DollarSign, GraduationCap, MapPin, Users } from 'lucide-react';

const JobCard = ({ jobData, onClick }) => {
    useEffect(() => {
    }, [jobData]);

    const handleClick = () => {
        console.log("job card clicked");
        if (onClick) onClick(jobData);
    };

    function onApplyButtonClicked(event) {
        event.stopPropagation();
        console.log(jobData);
        console.log("apply button clicked");
    }

    return (
        <div
            onClick={handleClick}
            className="bg-neutral-800 rounded-lg p-4 md:p-5 mb-4 text-white hover:bg-neutral-700/50 transition-all cursor-pointer border border-neutral-700"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2 sm:gap-0">
                <div className="flex-1">
                    <h2 className="text-lg md:text-xl font-semibold text-orange-500">{jobData.title}</h2>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-400 mt-1">
                        <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            <span>{jobData.departmentName}</span>
                        </div>
                        <span className="hidden sm:block w-1 h-1 bg-neutral-500 rounded-full"></span>
                        <span>{jobData.employmentType}</span>
                    </div>
                </div>
                <div className="flex sm:flex-col items-start sm:items-end gap-2 sm:ml-4">
                    <span className="bg-orange-500/20 text-orange-500 px-2 py-1 rounded-full text-sm">
                        {jobData.careerLevel}
                    </span>
                    <div className="flex items-center text-sm text-neutral-400">
                        <Users className="w-4 h-4 mr-1" />
                        <span>Openings</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-4">
                <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                    <span className="text-neutral-300">{jobData.location}</span>
                </div>
                <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                    <span className="text-neutral-300">
                        {`${jobData.minSalary?.toLocaleString()} - ${jobData.maxSalary?.toLocaleString()}`}
                    </span>
                </div>
                <div className="flex items-center">
                    <BriefcaseBusiness className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                    <span className="text-neutral-300">{`${jobData.minExperience} years minimum`}</span>
                </div>
                <div className="flex items-center">
                    <GraduationCap className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                    <span className="text-neutral-300">{jobData.educationLevel}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                <div>
                    <h3 className="text-sm font-medium text-neutral-400 mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-1.5">
                        {jobData.requiredSkills?.length ? (
                            jobData.requiredSkills.map((skill, index) => (
                                <span key={index} className="bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded-full text-sm">
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <span className="text-neutral-400">No skills listed</span>
                        )}
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-neutral-400 mb-2">Benefits</h3>
                    <div className="flex flex-wrap gap-1.5">
                        {jobData.benefits?.length ? (
                            jobData.benefits.map((benefit, index) => (
                                <span key={index} className="bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded-full text-sm">
                                    {benefit}
                                </span>
                            ))
                        ) : (
                            <span className="text-neutral-400">No benefits listed</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <div className="flex items-center text-sm text-neutral-400">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Posted {new Date().toLocaleDateString()}</span>
                </div>
                <button
                    onClick={onApplyButtonClicked}
                    className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1.5 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all text-sm"
                >
                    Apply Now
                </button>
            </div>
        </div>
    );
};

export default JobCard;