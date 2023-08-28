import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import httpClient from "../../../../utils/config/core/httpClient";
import baseurl from "../../../../utils/config/url/base";
import { Button, message } from "antd";
import { actionStatus } from "../../../api/actionStatus";
import { transition } from "../../../api/finfloTransition";
import { ErrorMessage } from "../../../../utils/enum/messageChoices";
import { Action, InterimState, ResponseStatus } from "../../../../utils/enum/choices";
import { program_Basicdetails
} from "../../../../redux/action";
const ButtonContainer = ({ Data, commentsValue }: any) => {
    const [buttondisable, setButtonDisable] = useState(false);
    const Navigator = useNavigate();
    const dispatch = useDispatch();
    const returnRoute = (data: any) => {
        if (data === true) {
            Navigator(`/${Data.fromMenu}`)
            setButtonDisable(false)
        }
    }
    const onClickAction = (buttonKey: string) => {
        setButtonDisable(true)
        const loginlocalItems = localStorage.getItem("login_detail") as any;
        if (localStorage.getItem("user") === "Bank") {
            if ((buttonKey === "RETURN" && commentsValue === "") || (buttonKey === "REJECT" && commentsValue === "")) {
                message.error(ErrorMessage.PFC)
                setButtonDisable(false)
            } else {
                const commentsBody = {
                    t_id: Data.data.work_model.t_id,
                    type: Data.data.work_model.model_type,
                    comments: commentsValue
                }
                httpClient
                    .getInstance()
                    .post(`${baseurl}api/message/comments/`, commentsBody)
                    .then((resp: any) => {
                        if (resp.data.status === ResponseStatus.SUCCESS) {
                            if (buttonKey !== "RETURN") {
                                actionStatus(Data, buttonKey, returnRoute)
                                
                            } else {
                                transition(Data, buttonKey, JSON.parse(loginlocalItems).party_id, JSON.parse(loginlocalItems).party_id, Data.fromMenu, returnRoute)
                                
                            }
                        } else {
                            setButtonDisable(false)
                        }
                    })
            }

        } else {
            if (buttonKey !== "RETURN") {
                actionStatus(Data, buttonKey, returnRoute)
                
            } else {
                transition(Data, buttonKey, JSON.parse(loginlocalItems).party_id, JSON.parse(loginlocalItems).party_id, Data.fromMenu, returnRoute)
            }
        }
    }

    const onClickExit = () => {
        if (Data.fromMenu === "InboxHistory") {
            Navigator(`/${Data.fromMenu}/History`, { state: { workFlowItem: Data.data.workflowitems } })
        } else {
            Navigator(`/${Data.fromMenu}`)
        }
    };

    const onClickModify = () => {
        Navigator("/Inbox/ProgramModify", { state: Data })
        console.log("butt",Data)
        dispatch(program_Basicdetails(Data))

    }

    return (
        <div className="Button_Container">
            {/* <Button className="ExitButtonContainer" onClick={onClickExit} id={`${Data?.fromMenu}_${Data?.recordType}_program_exit`}> Exit </Button> */}
            {Data?.fromMenu !== "InboxHistory" ? Data?.data?.action === Action.RETURN || Data?.fromMenu === "sent" || Data?.fromMenu === "sent_awap" ? "" : (Data?.data && Data?.data?.next_available_transitions && Data?.data?.next_available_transitions?.values?.length > 0)
                ?
                <Button className="ExitButtonContainer"
                    htmlType="submit"
                    onClick={() => onClickAction(Action.RETURN)}
                    disabled={buttondisable}
                    loading={buttondisable}
                    id={`${Data?.fromMenu}_${Data?.recordType}_program_return`}
                >
                    Return
                </Button>
                :
                localStorage.getItem("user") === "Bank"
                    ?

                    <Button
                        className="ExitButtonContainer"
                        onClick={() => onClickAction(Action.REJECT)}
                        disabled={buttondisable}
                        loading={buttondisable}
                        id={`${Data?.fromMenu}_${Data?.recordType}_program_reject`}
                    >
                        Reject
                    </Button>
                    : "" : ""}
                     {Data?.fromMenu !== "InboxHistory" ?
                Data?.fromMenu === "sent" || Data?.fromMenu === "sent_awap" || Data?.data?.action === Action.RETURN || (Data?.data && Data?.data?.next_available_transitions && Data?.data?.next_available_transitions?.values?.length > 0)
                    || (Data?.data && Data?.data?.action === Action.MODIFY && Data?.data?.interim_state === InterimState.AWAITINGCUSA)
                    ? "" :
                    localStorage.getItem("user") === "Bank"
                        ?
                        <Button className="ExitButtonContainer" onClick={onClickModify} disabled={buttondisable}
                            loading={buttondisable} id={`${Data?.fromMenu}_${Data?.recordType}_program_modify`}>
                            Modify
                        </Button>
                        : "" : ""
            }
            {Data?.fromMenu !== "InboxHistory" ? (Data?.data?.interim_state === InterimState.DRAFT && Data?.data?.action === Action.DRAFT) ?
                <Button className="SaveButtonContainer" htmlType="submit" onClick={() => onClickAction(Action.SUBMIT)} disabled={buttondisable}
                    loading={buttondisable} id={`${Data?.fromMenu}_${Data?.recordType}_program_submit`} >
                    Submit
                </Button>
                : "" : ""}
            {Data?.fromMenu !== "InboxHistory" ? Data?.data?.action === Action.RETURN ?
                <Button className="SaveButtonContainer" htmlType="submit"
                    onClick={() => onClickAction(Data?.data?.previous_action)}
                    disabled={buttondisable} loading={buttondisable} id={`${Data?.fromMenu}_${Data?.recordType}_program_submit`} >
                    Release
                </Button>
                : "" : ""}
            {Data?.fromMenu !== "InboxHistory" ? Data?.fromMenu === "sent" || Data?.fromMenu === "sent_awap" ? "" :
                (Data?.data && Data?.data?.next_available_transitions && Data?.data?.next_available_transitions?.values?.length > 0) ?
                    <Button className="SaveButtonContainer" htmlType="submit"
                        onClick={() => onClickAction(Data?.data.action)}
                        disabled={buttondisable}
                        loading={buttondisable}
                        id={`${Data?.fromMenu}_${Data?.recordType}_program_submit`}
                    >
                        Release
                    </Button>
                    :
                    (Data?.data && Data?.data?.action === Action.MODIFY && Data?.data?.interim_state === InterimState.AWAITINGCUSA) ?
                        <Button className="SaveButtonContainer"
                            htmlType="submit"
                            onClick={() => onClickAction(Action.ACCEPT)}
                            disabled={buttondisable}
                            loading={buttondisable}
                            id={`${Data?.fromMenu}_${Data?.recordType}_program_submit`}
                        >
                            Accept
                        </Button>
                        :
                        Data?.fromMenu === "inbox" && localStorage.getItem("user") === "Bank" ?
                            <Button className="SaveButtonContainer" htmlType="submit" onClick={() => onClickAction(Action.APPROVE)}
                                disabled={buttondisable} loading={buttondisable} id={`${Data?.fromMenu}_${Data?.recordType}_program_approve`}
                            >
                                Approve
                            </Button>
                            :
                            <Button className="SaveButtonContainer" htmlType="submit"
                                onClick={() => onClickAction(Data?.data.action)}
                                disabled={buttondisable}
                                loading={buttondisable}
                                id={`${Data?.fromMenu}_${Data?.recordType}_program_submit`}
                            >
                                Release
                            </Button>
                : ""
            }
           
           
        </div>
    )
}
export default ButtonContainer

