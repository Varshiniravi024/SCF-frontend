export const PartyType = {
    "CUSTOMER": "CUSTOMER",
    "NON_CUSTOMER": "NON-CUSTOMER",
    "BANK": "BANK",
    "NONE": "NONE"
}
export const Status = {
    "NONE": "NONE",
    "NEW": "NEW",
    "IN_PROGRESS": "IN_PROGRESS",
    "ONBOARDED": "ONBOARDED",
    "DEACTIVATED": "DEACTIVATED",
}

export const OnboardingStatus = {
    "NONE": "NONE",
    "DRAFT": "DRAFT",
    "STB": "SENT_TO_BANK",
    "STC": "SENT_TO_COUNTERPARTY",
    "COMPLETED": "COMPLETED",
    "REJECTED": "REJECTED",
}

export const ResponseStatus = {
    "SUCCESS": "Success",
    "FAILURE": "Failure"
}

export const InterimState = {
    "FINANCERQ": "Finance requested",
    "ABYBUYER": "Approved by buyer",
    "AWAITINGBUYERA": "Awaiting buyer approval",
    "COMPLETED": "Completed",
    "STB": "Sent to bank",
    "DRAFT": "Draft",
    "AWAITINGCUSA": "Awaiting customer approval",
    "REJECTED": "Rejected",
    "RETURNED": "Returned",
    "REJECTEDBYB": "Rejected by banK",
    "SETTLED": "Settled",
    "FINANCED": "Financed",
    "APPROVED":"Approved"
}

export const Type = {
    "INVOICE": "Invoice",
    "UPLOAD": "upload",
    "PROGRAM": "Program",
    "INVOICEUPLOAD": "Invoiceupload",
    "COUNTERPARTY": "Counterparty",
    "FINANCERQ": "Financereques",
    "FINANCEREQ": "Financerequest",
    "FINANCEREPAYMENT": "Financerepayment"
}

// export const FinalState = {
//     "FINANCED": "FINANCED"
// }

export const ProgramType = {
    "APF": "APF",
    "RF": "RF"
}

export const Action = {
    "RETURN": "RETURN",
    "RECHECK": "RECHECK",
    "APPROVE": "APPROVE",
    "REJECT": "REJECT",
    "SUBMIT": "SUBMIT",
    "REQFINANCE": "REQUEST FINANCE",
    "DRAFT": "DRAFT",
    "ACCEPT": "ACCEPT",
    "MODIFY": "MODIFY",
    "FINANCED": "FINANCED",
}

export const TransactionType = {
    "TINVOICE": "transaction.invoices",
    "TFINANCEREPAYMENT": "transaction.financerepayments",
    "TPROGRAM": "transaction.programs",
    "TINVOICEUPLOADS": "transaction.invoiceuploads",
}

export const InterestPaidBy = {
    "OWNPARTY": "OWNPARTY",
    "COUNTERPARTY": "COUNTERPARTY"
}

export const InterestDeduction = {
    "FINANCING": "FINANCING",
    "REPAYMENT": "REPAYMENT"
}
export const RecordType = {
    "FINANCEREQ":"FINANCE REQUEST",
    "PROGRAM":"PROGRAM",
    "AWSIGN":"AW_SIGN",
    "CPONBOARDING":"COUNTERPARTY ONBOARDING",
    "INVOICE":"INVOICE",
    "ALL":"ALL"
}
