import api_context from "./api_service.jsx";

export const Job_Service = {
    getAllJobs: async (page = 0, size = 0) => {
        try {
            const response = await api_context.get(
                `/jobs/all?page=${page}&size=${size}`
            );
            return response.data;
        } catch (error) {
            // throw handleError(error);
        }
    },

    getAllJobProfiles: async () => {
        try {
            const response = await api_context.get('/job/profiles/all')
            if (response.status === 200) {
                return response.data;
            } else {
                throw handleError("Error response is not 200")
            }
        } catch (error) {
            throw handleError("Error while fetching job profiles : ", error);
        }
    },

    searchJobsWithKeyword : async(keyword) => {
        try{
            const params = {"keyword":keyword, "page":0, "size":10};
            const response = await api_context.get('/jobs/search/keyword', {params : params})
            return response.data
        }  catch (error) {
            throw handleError("Error while fetching job with keyword ", error)
        }
    },

    getJobById: async (id) => {
        try {
            const response = await api_context.get(`/jobs/${id}`)
            if (response.status === 200) {
                return response.data;
            } else {
                throw handleError("Error response is not 200");
            }
        } catch (error) {
            throw handleError("Error while fetching the job with id : " + id, error);
        }
    },

    deleteJob: async (jobId) => {
        try {
            await api_context.delete(`/jobs/${jobId}`);
        } catch (error) {
            throw handleError(error);
        }
    },

    getJobsWithFilter: async (params) => {
        try {
            Object.keys(params).forEach(key => params[key] == null && delete params[key])
            const response = await api_context.get(`/search`, {params})
            return response.data;
        } catch (error) {
            throw handleError(error);
        }
    },

    getJobByCompany : async (companyId) => {
        try{
            const response = await api_context.get(`/jobs/company/${companyId}`)
            return response.data
        } catch (error) {
            throw handleError(error);
        }
    }
};

const handleError = (error) => {
    if (error.response) {
        return new Error(error.response.data.message || "An error occurred");
    } else if (error.request) {
        return new Error("No response received from server");
    } else {
        return new Error("Error setting up request");
    }
};
