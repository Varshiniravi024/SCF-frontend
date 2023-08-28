import httpClient from "../../utils/config/core/httpClient";
import baseurl from "../../utils/config/url/base";

export const InterestType = async () => {
    const { data } = await  httpClient.getInstance().get(`${baseurl}api/resource/choices/?type=IC`);
    return data.data;
};
//text file