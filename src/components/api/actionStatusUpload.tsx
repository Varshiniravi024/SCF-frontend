import httpClient from "../../utils/config/core/httpClient";
import baseurl from "../../utils/config/url/base";
import { message } from "antd";
import { ErrorMessage } from "../../utils/enum/messageChoices";
import { ResponseStatus } from "../../utils/enum/choices";
export const manualActionStatus = async (type: any, id: any, buttonKey: any) => {
    let data =  ""
    httpClient
        .getInstance()
        .get(`${baseurl}api/resource/action/status/?action=${buttonKey}&type=${type}&t_id=${id}`)
        .then((resp: any) => {
            if (resp.data.status === ResponseStatus.SUCCESS) {
                const loginlocalItems = localStorage.getItem("login_detail") as any;
                const body = {
                    type: type,
                    t_id: id,
                    action: buttonKey,
                    from_party: resp.data.data.from_party,
                    to_party: resp.data.data.to_party,
                    party: JSON.parse(loginlocalItems).party_id
                }

                httpClient
                    .getInstance()
                    .post(`${baseurl}finflo/transition/`, body)
                    .then((response: any) => {
                        if (response.data.status) {
                            // if (response.data.status === "Transition success" || response.data.status === "Transition  success") {
                            // navigator(`/Manual`)
                            // returnFunction("/New")
                            message.success(response.data.status)
                        } else {
                            message.error(response.data.data)
                            data=""
                        }
                    }).catch((err) => {
                        message.error(ErrorMessage.INTRANS)
                        data=""
                    })
            } else {
                message.error(resp.data.data)
                data=""
            }
        })
        return data;
}

