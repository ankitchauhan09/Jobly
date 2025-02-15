import api_service from "./api_service.jsx";

export const Job_Application_Service = {

    submitJobApplication : async(formData, file) => {
        const formDataToSend = {
            "applicationData" : formData,
            "resume" : file
        }
        console.log("submitting application")
        const headers = {'Content-Type' : 'multipart/form-data'}
        const response = await api_service.post("http://localhost:8099/job-application/submit", formDataToSend, {headers : headers});
        if(response.status == 200) {
            return response.data;
        } else {
            console.error("Error while receiving the response");
        }
    },

    isAlreadyApplied : async(jobId, userId) => {
        const response = await api_service.get("http://localhost:8099/job-application/is-applied/" + jobId + "/" + userId);
        if(response.status == 200) {
            return response.data;
        } else {
            console.error("Error while checking the applied status")
        }
    },

    getAllApplicationsByUserEmail : async (email) => {
        const response = await api_service.get("http://localhost:8099/job-application/all/" + email);
        if(response.status === 200) {
            return response.data;
        } else {
            console.error("Error while fetching the applications with email..")
        }
    }

};