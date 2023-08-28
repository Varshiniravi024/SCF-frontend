const initialState = {
    user: null,
    data: null,
    currencyData: null,
    basicDetailsData: null,
    // inboxOnboardingDetail: null,
    inboxProgramDetail: null,
    // inboxinvoiceDetail: null,
    // financeRequestDetail: null,
    // programData: null,
    // counterPartyData: null,
    // inboxUnreadCount: null,
    interestType: null,
    interestRateType: null,
    menuStatus: null,
    // sentCount: null,
    inboxCount: null,
    draftCount: null,
    countryData: null,
    programBasicdetailsData: null,
    programCounterpartydetailsData: null,
    socketInfo:null,
    pageSizeData:null,
};

const userReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'login':
            return {
                ...state,
                user: action.payload,
            };
        case 'allInbox':
            return {
                ...state,
                data: action.payload,
            };
        case 'allCurrency':
            return {
                ...state,
                currencyData: action.payload,
            };
        case 'basicDetails':
            return {
                ...state,
                basicDetailsData: action.payload,
            };
        // case 'inbox_onboardingDetails':
        //     return {
        //         ...state,
        //         inboxOnboardingDetail: action.payload,
        //     };
        case 'inbox_programDetails':
            return {
                ...state,
                inboxProgramDetail: action.payload,
            };
        // case 'inbox_invoiceDetails':
        //     return {
        //         ...state,
        //         inboxinvoiceDetail: action.payload,
        //     };
        // case 'financeRequest_Detail':
        //     return {
        //         ...state,
        //         financeRequestDetail: action.payload,
        //     };
        // case 'program_data':
        //     return {
        //         ...state,
        //         programData: action.payload,
        //     };
        // case 'counterparty_data':
        //     return {
        //         ...state,
        //         counterPartyData: action.payload,
        //     };
        // case 'inbox_unread_count':
        //     return {
        //         ...state,
        //         inboxUnreadCount: action.payload,
        //     };
        case 'allInterestType':
            return {
                ...state,
                interestType: action.payload,
            };
        case 'allInterestRateType':
            return {
                ...state,
                interestRateType: action.payload,
            };
        case 'menuStatus_data':
            return {
                ...state,
                menuStatus: action.payload,
            };
        // case 'sentCount_data':
        //     return {
        //         ...state,
        //         sentCount: action.payload,
        //     };
        case 'inboxCount_data':
            return {
                ...state,
                inboxCount: action.payload,
            };
        case 'draftCount_data':
            return {
                ...state,
                draftCount: action.payload,
            };
        case 'allCountry':
            return {
                ...state,
                countryData: action.payload,
            };
        case 'program_Basicdetails':
            return {
                ...state,
                programBasicdetailsData: action.payload,
            }
        case 'program_counterpartydetails':
            return {
                ...state,
                programCounterpartydetailsData: action.payload,
            };
            case 'socketInfoDetails':
                return {
                    ...state,
                    socketInfo: action.payload,    
                };
                case 'pageSizeDetails':
                return {
                    ...state,
                    pageSizeData: action.payload,    
                };

        default:
            return state;
    }

};

export default userReducer;
