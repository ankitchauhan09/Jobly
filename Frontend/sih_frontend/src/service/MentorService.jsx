import api_service from "./api_service.jsx";

export const MentorService = {
    getAllMentors: async () => {
        const response = await api_service.get("http://localhost:8099/mentor/")
        if (response.status == 200) {
            console.log(response.data)
            return response.data;
        } else {
            console.error("Error while fetching the mentors")
        }
    },

    getAllBookings: async (userId, mentorId) => {
        const response = await api_service.get(`http://localhost:8099/mentor/all-bookings/${userId}/${mentorId}`)
        if (response) {
            console.log(response.data)
            return response.data;
        } else {
            console.error("Error while fetching all the bookings")
        }
    },

    getMentorById: async (mentorId) => {
        const response = await api_service.get("http://localhost:8099/mentor/" + mentorId);
        if (response) {
            console.log("mentor " + response.data.name);
            return response.data;
        } else {
            console.error("Error while fetching the mentor with id : " + mentorId);
        }
    },

    verifySessionLogin: async (meetingId, password) => {
        const response = await api_service.post("http://localhost:8099/mentor/session/login", {
            username: meetingId,
            password: password
        });

        if (response.status === 200) {
            console.log("session login info")
            console.log(response.data);
            return await response.data;
        } else {
            console.error("Error while fetching the session login info ");
        }

    },
    deleteBookingInfo: async (bookingId) => {
        await api_service.delete(`http://localhost:8099/mentor/session/delete/${bookingId}`);
    }
}