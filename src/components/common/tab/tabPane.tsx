import { RecordType } from "../../../utils/enum/choices"

export const TabPaneFunc = ({fromMenu,recordType}:any) => {
    const value = {
        BankTab:
        fromMenu === "inbox" ?[
            {
                Name: "All",
                Key: "1",
                recordType: recordType
            },
            {
                Name: "Finance request",
                Key: "2",
                recordType: RecordType.FINANCEREQ
            },
            {
                Name: "Program",
                Key: "3",
                recordType: RecordType.PROGRAM
            },
            {
                Name: fromMenu === "inbox" ? "Awaiting Sign" : "",
                Key: fromMenu === "inbox" ? "4" : "",
                recordType: fromMenu === "inbox" ? RecordType.AWSIGN : ""
            },
            {
                Name: "Onboarding",
                Key: "5",
                recordType: RecordType.CPONBOARDING
            }
        ] :
         [
            {
                Name: "All",
                Key: "1",
                recordType: recordType
            },
            {
                Name: "Finance request",
                Key: "2",
                recordType: RecordType.FINANCEREQ
            },
            {
                Name: "Program",
                Key: "3",
                recordType: RecordType.PROGRAM
            },
            {
                Name: "Onboarding",
                Key: "5",
                recordType: RecordType.CPONBOARDING
            }
        ],
        CounterPartyTab: [
            {
                Name: "All",
                Key: "1",
                recordType: RecordType.ALL
            },
            {
                Name: "Invoice",
                Key: "2",
                recordType: RecordType.INVOICE
            },
            {
                Name: "Finance request",
                Key: "3",
                recordType: RecordType.FINANCEREQ
            },

            {
                Name: fromMenu === "inbox" ? "Awaiting Sign" : "",
                Key: fromMenu === "inbox" ? "4" : "",
                recordType: fromMenu === "inbox" ? RecordType.AWSIGN: ""
            },
            {
                Name: "Onboarding",
                Key: "5",
                recordType: RecordType.CPONBOARDING
            }
        ],
         Tab:
         [
            {
                Name: "All",
                Key: "1",
                recordType: RecordType.ALL
            },
            {
                Name: "Invoice",
                Key: "2",
                recordType: RecordType.INVOICE
            },
            {
                Name: "Finance request",
                Key: "3",
                recordType: RecordType.FINANCEREQ
            },
            {
                Name: "Program",
                Key: "4",
                recordType: RecordType.PROGRAM
            },
            {
                Name: "Awaiting Sign",
                Key: "5",
                recordType: RecordType.AWSIGN 
            },{
                Name: "Onboarding",
                Key: "6",
                recordType: RecordType.CPONBOARDING
            }
        ]
    }
    const tabValue = localStorage.getItem("user") === "Bank" ? value.BankTab : localStorage.getItem("user") === "CounterParty" ? value.CounterPartyTab : value.Tab

    return tabValue
}