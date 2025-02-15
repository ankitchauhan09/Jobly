import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase, Search, Star, Mail, MapPin,
    Languages, ChevronRight, Badge, MessageSquare, Sparkles
} from 'lucide-react';
import { MentorService } from "../service/MentorService.jsx";
import {useUser} from "../contexts/UserContext.jsx";

const Mentorship = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const {user} = useUser();

    const fetchMentors = async () => {
        try {
            setLoading(true);
            const api_response = await MentorService.getAllMentors();
            if (api_response != null) {
                setMentors(api_response);
                setError(null);
            } else {
                console.log(api_response);
                setError("Received empty mentor array");
                setMentors([]);
            }
        } catch (err) {
            setError("Failed to fetch mentors");
            console.error("Error fetching the mentors : ", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMentors();
    }, []);

    const filteredMentors = mentors.filter(mentor => {
        const searchString = searchTerm.toLowerCase();
        return (
            mentor.name.toLowerCase().includes(searchString) ||
            (mentor.technicalSkills && mentor.technicalSkills.some(skill =>
                skill.toLowerCase().includes(searchString)
            )) ||
            (mentor.location && mentor.location.toLowerCase().includes(searchString)) ||
            (mentor.languages && mentor.languages.toLowerCase().includes(searchString))
        );
    });

    const navigateToMentorDetails = (mentorId) => {
        if(user != null) {
            navigate(`/mentor/${mentorId}`);
        } else {
            navigate(`/login`)
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-black to-gray-900">
            {/* Enhanced Hero Section */}
            <div className="relative overflow-hidden">
                {/* Abstract Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 transform rotate-12 scale-150 blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-6">
                            <Sparkles className="w-8 h-8 text-orange-500 animate-pulse mr-2" />
                            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-400 bg-clip-text text-transparent">
                                Find Your Perfect Mentor
                            </h1>
                            <Sparkles className="w-8 h-8 text-orange-500 animate-pulse ml-2" />
                        </div>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto mt-6 leading-relaxed">
                            Connect with industry experts who can guide you through your tech journey
                        </p>
                    </div>

                    {/* Enhanced Search Section */}
                    <div className="max-w-3xl mx-auto mt-12">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors duration-300" size={20}/>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by name, skills, location, or languages..."
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-900/90 backdrop-blur-sm border border-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Enhanced Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-t-4 border-b-4 border-orange-500 animate-spin" />
                            <div className="w-24 h-24 rounded-full border-r-4 border-l-4 border-yellow-500 animate-spin absolute inset-0 rotate-45" />
                        </div>
                        <p className="mt-8 text-gray-400 text-xl">Discovering amazing mentors...</p>
                    </div>
                )}

                {/* Enhanced Error State */}
                {error && (
                    <div className="text-center py-16 px-4">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-red-500 rounded-xl blur opacity-30" />
                            <div className="relative bg-gray-900 rounded-xl p-8 max-w-md mx-auto border border-red-500/20">
                                <p className="text-red-400 text-lg mb-6">{error}</p>
                                <button
                                    onClick={fetchMentors}
                                    className="px-8 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Mentors Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredMentors.map((mentor) => (
                            <div
                                key={mentor.id}
                                onClick={() => navigateToMentorDetails(mentor.id)}
                                className="group relative bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-orange-500 transition-all duration-500 cursor-pointer overflow-hidden hover:transform hover:scale-105"
                            >
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Enhanced Mentor Header */}
                                <div className="flex items-start space-x-4 mb-6 relative">
                                    <div className="relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-500" />
                                        <img
                                            src={mentor.profilePictureUrl || "/api/placeholder/96/96"}
                                            alt={mentor.name}
                                            className="relative w-20 h-20 rounded-xl object-cover ring-2 ring-gray-800 group-hover:ring-orange-500 transition-all duration-500"
                                        />
                                        {mentor.isVerified && (
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 ring-2 ring-black flex items-center justify-center">
                                                <Badge size={14} className="text-black" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-semibold text-white group-hover:text-orange-500 transition-colors duration-300">
                                            {mentor.name}
                                        </h3>
                                        {mentor.title && (
                                            <p className="text-gray-400 text-sm mt-1">{mentor.title}</p>
                                        )}
                                        {mentor.rating && (
                                            <div className="flex items-center mt-2">
                                                <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                                <span className="ml-1 text-sm text-gray-300">{mentor.rating}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Enhanced Info Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {mentor.yearsOfExperience && (
                                        <div className="flex items-center text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                                            <Briefcase className="w-4 h-4 mr-2 text-orange-500"/>
                                            {mentor.yearsOfExperience} years
                                        </div>
                                    )}
                                    {mentor.location && (
                                        <div className="flex items-center text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                                            <MapPin className="w-4 h-4 mr-2 text-orange-500"/>
                                            {mentor.location}
                                        </div>
                                    )}
                                    {mentor.languages && (
                                        <div className="flex items-center text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                                            <Languages className="w-4 h-4 mr-2 text-orange-500"/>
                                            {mentor.languages}
                                        </div>
                                    )}
                                    {mentor.email && (
                                        <div className="flex items-center text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                                            <Mail className="w-4 h-4 mr-2 text-orange-500"/>
                                            <span className="truncate">{mentor.email}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Enhanced Qualifications */}
                                {mentor.qualifications && mentor.qualifications.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {mentor.qualifications.map((qual, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 text-xs rounded-full bg-gray-800/60 text-gray-300 border border-gray-700 group-hover:border-gray-600 transition-colors duration-300"
                                            >
                                                {qual}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Enhanced Technical Skills */}
                                {mentor.technicalSkills && mentor.technicalSkills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {mentor.technicalSkills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 text-xs rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 group-hover:bg-orange-500/20 group-hover:border-orange-500/30 transition-all duration-300"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Enhanced Description */}
                                {mentor.description && (
                                    <p className="text-sm text-gray-400 mb-6 line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
                                        {mentor.description}
                                    </p>
                                )}

                                {/* Enhanced View Profile Button */}
                                <button className="flex items-center text-sm text-orange-500 hover:text-orange-400 transition-all duration-300 group-hover:translate-x-2">
                                    View Full Profile
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Enhanced No Results */}
                {!loading && !error && filteredMentors.length === 0 && (
                    <div className="text-center py-16">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full blur-3xl opacity-30" />
                            <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-6" />
                            <p className="text-gray-400 text-xl mb-3">No mentors found matching your search criteria.</p>
                            <p className="text-gray-500">Try adjusting your search terms.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Mentorship;