import httpClient from "../../utils/config/core/httpClient";
import baseurl from "../../utils/config/url/base";
import {transition} from "./finfloTransition";
import { message } from "antd";
import { Action, ResponseStatus } from "../../utils/enum/choices";
import { ErrorMessage } from "../../utils/enum/messageChoices";
export const actionStatus = (info:any,buttonKey:any,returnRoute:any) => {
    
    httpClient
    .getInstance()
    .get(`${baseurl}api/resource/action/status/?action=${buttonKey===Action.DRAFT ? "SUBMIT" : buttonKey}&type=${info?.data?.work_model?.model_type}&t_id=${info?.data?.work_model?.t_id}`)
    .then((resp: any) => {
        if (resp.data.status === ResponseStatus.SUCCESS) {
            transition(info,buttonKey===Action.DRAFT ? "SUBMIT" : buttonKey,resp.data.data.from_party,resp.data.data.to_party,info.fromMenu,returnRoute)
        }else{
            message.error(resp.data.data)
        }
     }).catch((err)=>{
        message.error(ErrorMessage.INA)
    })
}
