import React, { useEffect, useState } from "react";
import jobJSON from "../assets/response_1727544267607.json"; // Ensure this path is correct
import JobCard from '../components/ui-components/JobCard.jsx'; // Ensure this path is correct

const RecruiterSection = () => {
    const [title, setTitle] = useState("");

    useEffect(() => {
        console.log(jobJSON); // Verify the data structure
        if (jobJSON.jobTitle) {
            setTitle(jobJSON.jobTitle);
        }
    }, []);

    return (
        <div className="text-white">
            <h1>Job title: {title}</h1>
            <JobCard title={title} />
        </div>
    );
};

export default RecruiterSection;
