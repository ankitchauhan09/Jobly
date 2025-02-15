import api_service from "./api_service.jsx";

export const UserService = {

    updateProfilePic: async (userId, profilePic) => {
        const formData = new FormData();
        formData.append('profilePic', profilePic)
        console.log(profilePic)
        const response = await api_service.post('http://localhost:8099/user/update/image/' + userId, formData);
        if (response.status === 200) {
            console.log(response.data);
            return response.data;
        } else {
            console.error("error while updating the user image");
            return null;
        }
    },
    updateSocialLinks: async (socialLinks, userId) => {
        try {
            console.log('Payload:', socialLinks);
            console.log('User ID:', userId);

            const response = await api_service.post(
                `http://localhost:8099/user/update/socialLinks/${userId}`,
                socialLinks
            );

            if (response.status === 200) {
                console.log('Response:', response.data);
                return response.data;
            } else {
                console.error("Error while updating the user social links");
                throw new Error('Failed to update social links');
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    updateContactInformation: async (user) => {
        try {
            console.log(user)
            const response = await api_service.post("http://localhost:8099/user/update/contact/" + user.id, user);
            if (response.status === 200) {
                console.log(response.data)
                return response.data
            } else {
                throw Error("Error while updating contact information");
            }
        } catch (error) {
            console.error("API Error : " + error);
            throw error;
        }
    }

}
