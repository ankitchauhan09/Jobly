import api_service from "./api_service.jsx";
import {accordionSummaryClasses} from "@mui/material";

export const CompaniesService = {
    getAllCompanies : async () => {
        const response = await api_service.get("http://localhost:8099/companies/all")
        if(response.status == 200) {
            console.log(response.data)
            return response.data;
        } else {
            console.error("Error while fetching the companies")
        }
    },

    getCompanyById : async(id) => {
        const response = await api_service.get("http://localhost:8099/companies/" + id);
        if(response.status == 200) {
            return response.data;
        } else {
            console.error("Error while fetching company by id");
        }
    }
}