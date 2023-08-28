import httpClient from "../../utils/config/core/httpClient";
import baseurl from "../../utils/config/url/base";

export const Country = async () => {
    const { data } = await  httpClient.getInstance().get(`${baseurl}api-auth/country/`);
    return data.data;
};

export const Currency = async () => {
    const { data } = await  httpClient.getInstance().get(`${baseurl}api-auth/currency/`);
    return data.data;
};

export const InterestRateType = async () => {
    const { data } = await  httpClient.getInstance().get(`${baseurl}api/resource/choices/`);
    return data.data;
};

export const InterestType = async () => {
    const { data } = await  httpClient.getInstance().get(`${baseurl}api/resource/choices/?type=IC`);
    return data.data;
};

export const MenuStatus = async () => {
    const { data } = await  httpClient.getInstance().get(`${baseurl}api-auth/user/profile/`);
    return data.data.menu_status;
};