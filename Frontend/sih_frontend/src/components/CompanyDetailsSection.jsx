import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { CompaniesService } from "../service/CompaniesService.jsx";
import { Job_Service } from "../service/Job_Service.jsx";

const CompanyDetailsSection = () => {
    const { companyId } = useParams();
    const [company, setCompany] = useState(null);
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        fetchCompanyDetails();
    }, [companyId]);

    const fetchCompanyDetails = async () => {
        try {
            setLoading(true);
            const companyData = await CompaniesService.getCompanyById(companyId);
            const vacanciesData = await Job_Service.getJobByCompany(companyId);
            setCompany(companyData);
            setVacancies(vacanciesData);
            setError(null);
        } catch (err) {
            setError("Failed to fetch company details");
            console.error("Unable to fetch company details:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleJobClick = (id) => {
        if(id != null) {
            navigate("/job-details/" + id);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] text-white p-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 border-r-2" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] text-white p-8 flex flex-col items-center justify-center">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={fetchCompanyDetails}
                    className="mt-4 px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!company) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0c0c0c] text-white p-8">
            <div className="lg:max-w-8xl mx-auto">
                {/* Company Header Card */}
                <div className="mb-8 bg-neutral-800/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-700 hover:border-orange-500/50 transition-all duration-300">
                    <div className="flex items-start space-x-6">
                        <div className="w-24 h-24 rounded-lg bg-neutral-700 overflow-hidden">
                            <img
                                src={company.companyLogoUrl || "/api/placeholder/96/96"}
                                alt={`${company.companyName} logo`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">{company.companyName}</h1>
                            <p className="text-neutral-400 mb-4">{company.companyLocation}</p>
                            <p className="text-neutral-300 mb-4">{company.companyDescription}</p>
                            <div className="flex items-center text-sm text-neutral-400">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                                </svg>
                                {company.noOfEmployees.toLocaleString()} employees
                            </div>
                        </div>
                    </div>
                </div>

                {/* Open Positions Section */}
                <div className="bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-700">
                    <div className="p-6 border-b border-neutral-700">
                        <h2 className="text-2xl font-semibold">Open Positions</h2>
                    </div>
                    <div className="p-6">
                        {vacancies.length > 0 ? (
                            <div className="space-y-4">
                                {vacancies.map((vacancy) => (
                                    <div
                                        key={vacancy.id}
                                        className="bg-neutral-700/50 rounded-lg p-6 hover:border-orange-500/50 border border-neutral-600 transition-all duration-300 cursor-pointer"
                                        onClick={() => handleJobClick(vacancy.id)}
                                    >
                                        <h3 className="text-xl font-semibold mb-2 text-orange-500">
                                            {vacancy.title}
                                        </h3>
                                        <p className="text-neutral-300 mb-4">
                                            {vacancy.description}
                                        </p>
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-sm text-neutral-400">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                </svg>
                                                {vacancy.location}
                                            </div>
                                            <div className="flex items-center text-sm text-neutral-400">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                                                </svg>
                                                {vacancy.experience} experience required
                                            </div>
                                        </div>
                                        <button className="text-orange-500 hover:text-orange-400 transition-colors font-medium">
                                            Apply Now →
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-neutral-400">
                                No open positions at the moment.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetailsSection;