import httpClient from "../../utils/config/core/httpClient";
import baseurl from "../../utils/config/url/base";
import { message } from "antd";
import { TransactionType } from "../../utils/enum/choices";
import NotFound from "../../utils/page/500";

export const transition = (detailData: any, buttonKey: string, fromParty: any, toParty: any, route: string, returnRoute: any) => {
    const loginlocalItems = localStorage.getItem("login_detail") as any;
    let body = {} as any

    body = {
        type: detailData?.data?.work_model ? detailData?.data?.work_model?.model_type : detailData?.type ? detailData?.type : detailData?.model ?detailData?.model : TransactionType.TINVOICE,
        t_id: detailData?.data?.work_model ? detailData?.data?.work_model?.t_id : detailData?.data?.id ? detailData?.data?.id : detailData?.t_id ? detailData?.t_id : detailData.id,
        action: buttonKey,
        from_party: fromParty,
        to_party: toParty,
        ...(buttonKey !== "RETURN") && { party: JSON.parse(loginlocalItems).party_id }
    }
    httpClient
        .getInstance()
        .post(`${baseurl}finflo/transition/`, body)
        .then((response: any) => {
            if (response.data.status) {
                returnRoute(true)
                message.success(response.data.status)
            } else {
                message.error(response.data.data)
            }
        })
        .catch((err) => {
            // message.error(ErrorMessage.INTRANS)
            <NotFound />
        })
}

