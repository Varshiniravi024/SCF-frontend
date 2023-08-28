// actions.js
export const login = (user:any) => ({
    type: 'login',
    payload: user,
  });
  
  export const allInbox = (data:any) => ({
    type: 'allInbox',
    payload: data,
  });
  
  export const allCurrency = (currencyData:any) => ({
    
    type: 'allCurrency',
    payload: currencyData ,
  });
  export const basicDetails = (basicDetailsData:any) => ({
    type: 'basicDetails',
    payload: basicDetailsData,
  });
  // export const inbox_onboardingDetails = (inboxOnboardingDetail:any) => ({
  //   type: 'inbox_onboardingDetails',
  //   payload: inboxOnboardingDetail,
  // });
  export const inbox_programDetails = (inboxProgramDetail:any) => ({
    type: 'inbox_programDetails',
    payload: inboxProgramDetail,
  });
  // export const inbox_invoiceDetails = (inboxinvoiceDetail:any) => ({
  //   type: 'inbox_invoiceDetails',
  //   payload: inboxinvoiceDetail,
  // });
  // export const financeRequest_Detail = (financeRequestDetail:any) => ({
  //   type: 'financeRequest_Detail',
  //   payload: financeRequestDetail,
  // });
  // export const program_data = (programData:any) => ({
  //   type: 'program_data',
  //   payload: programData,
  // });
  // export const counterparty_data = (counterPartyData:any) => ({
  //   type: 'counterparty_data',
  //   payload: counterPartyData,
  // });
  // export const inbox_unread_count = (inboxUnreadCount:any) => ({
  //   type: 'inbox_unread_count',
  //   payload: inboxUnreadCount,
  // });
  export const allInterestType = (interestType:any) => ({
    type: 'allInterestType',
    payload: interestType,
  });
  export const allInterestRateType = (interestRateType:any) => ({
    type: 'allInterestRateType',
    payload: interestRateType,
  });
  export const menuStatus_data = (menuStatus:any) => ({
    type: 'menuStatus_data',
    payload: menuStatus,
  });
  // export const sentCount_data = (sentCount:any) => ({
  //   type: 'sentCount_data',
  //   payload: sentCount,
  // });
  export const inboxCount_data = (inboxCount:any) => ({
    type: 'inboxCount_data',
    payload: inboxCount,
  });
  export const draftCount_data = (draftCount:any) => ({
    type: 'draftCount_data',
    payload: draftCount,
  });
  export const allCountry = (countryData:any) => ({
    type: 'allCountry',
    payload: countryData,
  });
  export const program_Basicdetails = (programBasicdetailsData:any) => ({
    type: 'program_Basicdetails',
    payload: programBasicdetailsData,
  });
  export const program_counterpartydetails = (programCounterpartydetailsData:any) => ({
    type: 'program_counterpartydetails',
    payload: programCounterpartydetailsData,
  });
  export const socketInfoDetails = (socketInfo:any) => ({
    type: 'socketInfoDetails',
    payload: socketInfo,
  });

  export const pageSizeDetails = (pageSizeData:any) => ({
type:'pageSizeDetails',
payload:pageSizeData
  })

  

  // Add other action creators here
  