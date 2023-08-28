import { useNavigate } from "react-router-dom";
import httpClient from "../../../../utils/config/core/httpClient";
import baseurl from "../../../../utils/config/url/base";
import { Button, message } from "antd";
import { actionStatus } from "../../../api/actionStatus";
import { transition } from "../../../api/finfloTransition";
import { ErrorMessage } from "../../../../utils/enum/messageChoices";
import { Action, InterimState, ResponseStatus, Type } from "../../../../utils/enum/choices";
const ButtonContainer = ({ Data, commentsValue }: any) => {
    const Navigator = useNavigate();
    const returnRoute = (data: any) => {
        if (data === true) {
            Navigator(`/${Data.fromMenu}`)
        }
    }
    const onClickAction = (buttonKey: string) => {
        const formdata = new FormData();
        formdata.append('comments', commentsValue)
        const loginlocalItems = localStorage.getItem("login_detail") as any;
        if (buttonKey === Action.REQFINANCE) {
            actionStatus(Data, buttonKey, returnRoute);
        } else if (Data.data.type === Type.INVOICEUPLOAD) {
            if ((buttonKey === Action.REJECT && commentsValue === "") || (buttonKey === Action.REJECT && commentsValue === null) || (buttonKey === Action.RETURN && commentsValue === "") || (buttonKey === Action.RETURN && commentsValue === null)) {
                message.error(ErrorMessage.PFC)
            } else if (buttonKey !== Action.RETURN) {
                postMessageComments(buttonKey)

            } else {
                const commentsBody = {
                    t_id: Data.data.work_model.t_id,
                    type: Data.data.model_type,
                    comments: commentsValue
                }
                httpClient
                    .getInstance()
                    .post(`${baseurl}api/message/comments/`, commentsBody)
                    .then((resp: any) => {
                        if (resp.data.status === ResponseStatus.SUCCESS) {
                            transition(Data, buttonKey, JSON.parse(loginlocalItems).party_id, JSON.parse(loginlocalItems).party_id, Data.fromMenu, returnRoute)
                        } else {
                            message.error(resp.data.data)
                        }
                    })
            }
        } else {
            if ((buttonKey === Action.REJECT && commentsValue === "") || (buttonKey === Action.REJECT && commentsValue === null) || (buttonKey === Action.RETURN && commentsValue === "") || (buttonKey === Action.RETURN && commentsValue === null)) {
                message.error(ErrorMessage.PFC)
            } else if (buttonKey !== Action.RETURN) {
                postMessageComments(buttonKey)
            } else {
                transition(Data, buttonKey, JSON.parse(loginlocalItems).party_id, JSON.parse(loginlocalItems).party_id, Data.fromMenu, returnRoute)
            }
        }
    }
    const postMessageComments = (buttonKey: string) => {
        const commentsBody = {
            t_id: Data.data.work_model.t_id,
            type: Data.data.model_type,
            comments: commentsValue
        }
        httpClient
            .getInstance()
            .post(`${baseurl}api/message/comments/`, commentsBody)
            .then((resp: any) => {
                if (resp.data.status === ResponseStatus.SUCCESS) {
                    actionStatus(Data, buttonKey, returnRoute);
                }
            })
    }

    return (
        <div className="Button_Container">
            {/* <Button className="ExitButtonContainer" onClick={onClickExit} id={`${Data?.fromMenu}_${Data?.recordType}_invoice_exit`}>
                Exit
            </Button> */}
             {Data.fromMenu === "sent" || Data.fromMenu === "sent_awap" || Data.fromMenu === "draft" || Data.data.interim_state === InterimState.COMPLETED ? "" :
                Data.data.interim_state === InterimState.AWAITINGBUYERA ?
                    <Button className="ExitButtonContainer" onClick={() => onClickAction(Action.REJECT)} id={`${Data?.fromMenu}_${Data?.recordType}_invoice_reject`}> Reject </Button>
                    : Data.data.next_available_transitions && Data.data.next_available_transitions.values.length > 0 ?
                        <Button className="ExitButtonContainer" onClick={() => onClickAction(Action.RETURN)} id={`${Data?.fromMenu}_${Data?.recordType}_invoice_return`}> Return </Button>
                        : ""}

{/* 
            {Data.fromMenu === "draft" ? <Button className="SaveButtonContainer" onClick={() => onClickAction(Data.data.action)} id={`${Data?.fromMenu}_${Data?.recordType}_invoice_release`}>
                Release </Button> : ""} */}

            {Data.fromMenu === "sent" || Data.fromMenu === "sent_awap" || Data.data.interim_state === InterimState.COMPLETED ? "" :
                Data.data.interim_state === InterimState.ABYBUYER ?
                    <Button className="RequestFinanceButtonContainer" onClick={() => onClickAction(Action.REQFINANCE)} id={`${Data?.fromMenu}_${Data?.recordType}_invoice_requestFinance`} > Request for Finance </Button>
                    : Data.data.interim_state === InterimState.AWAITINGBUYERA ?
                        <Button className="SaveButtonContainer" onClick={() => onClickAction(Action.APPROVE)} id={`${Data?.fromMenu}_${Data?.recordType}_invoice_approve`} > Approve </Button>
                        : Data.data.action === Action.RETURN || Data.data.action === Action.DRAFT ||
                            (Data.data.next_available_transitions && Data.data.next_available_transitions.values.length > 0) ?
                            <Button className="SaveButtonContainer" onClick={() => onClickAction(Data.data.action)} id={`${Data?.fromMenu}_${Data?.recordType}_invoice_release`}>
                                Release </Button>
                            : ""}

           
        </div>
    )
}
export default ButtonContainer

