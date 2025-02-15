import React, {useEffect, useState} from 'react';
import {Search} from 'lucide-react';
import {CompaniesService} from "../service/CompaniesService.jsx";
import {useNavigate} from "react-router-dom";

const Companies = () => {
    const [allCompanies, setAllCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getAllCompanies();
    }, []);

    const getAllCompanies = async () => {
        try {
            setLoading(true);
            const response = await CompaniesService.getAllCompanies();
            console.log(response)
            if (Array.isArray(response)) {
                setAllCompanies(response);
                setError(null);
            } else {
                setError("Invalid response format");
            }
        } catch (err) {
            setError("Failed to fetch companies");
            console.error("Unable to fetch all the companies:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredCompanies = allCompanies.filter(company =>
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.companyLocation?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const navigateToCompanyDetails= (id) =>{
        navigate(`/company-details/${id}`)
    }

    return (
        <div className="min-h-screen bg-[#0c0c0c] text-white p-8">
            <div className="lg:max-w-8xl mx-auto">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Featured Companies</h1>
                    <p className="text-neutral-400 mb-8">Discover opportunities at leading technology companies</p>
                </div>
                {/* Search Bar */}
                <div className="relative mb-12">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search companies..."
                        className="w-full text-lg rounded-lg px-6 py-3 bg-neutral-800 border border-neutral-700 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-500" size={20}/>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-8">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 border-r-2 mx-auto mb-4"></div>
                        <p className="text-neutral-400">Loading companies...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-8 text-red-500">
                        <p>{error}</p>
                        <button
                            onClick={getAllCompanies}
                            className="mt-4 px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Companies Grid */}
                {!loading && !error && (
                    <div className="grid mb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCompanies.map((company) => (
                            <div
                                key={company.id}
                                onClick={() => navigateToCompanyDetails(company.id)}
                                className="bg-neutral-800/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-700 hover:border-orange-500/50 transition-all duration-300 group cursor-pointer"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 rounded-lg bg-neutral-700 overflow-hidden">
                                        <img
                                            src={`${company.companyLogoUrl}`}
                                            alt={`${company.companyName} logo`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold group-hover:text-orange-500 transition-colors">
                                            {company.companyName}
                                        </h3>
                                        <p className="text-neutral-400 text-sm">{company.companyDescription.slice(0, 50)}...</p>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center text-sm text-neutral-300">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                        {company.companyLocation}
                                    </div>
                                    <div className="flex items-center text-sm text-neutral-300">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                                        </svg>
                                        {company.noOfEmployees.toLocaleString()} employees
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-neutral-700">
                                    <button className="text-sm text-orange-500 hover:text-orange-400 transition-colors">
                                        View {company.noOfVacancies} open positions →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Development Banner */}
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Companies;