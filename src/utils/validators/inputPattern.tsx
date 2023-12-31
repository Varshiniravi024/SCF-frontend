export const InputPatterns = {
    // "EMAILANDMOBILE" :/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$/,
    "EMAILANDMOBILE" :/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$/,
    "INVOICEAMT": /^[1-9]\d{0,7}(\.\d{1,2})*(,\d+)?$/,
    "INVOICEPCT":/^[0-9]\d{0,1}(,\d+)?$/,
    "MAXTENOR":/^[1-9]\d{0,2}(\.\d{1,2})*(,\d+)?$/,
    "GRACEPERIOD":/^[1-9]\d{0,1}(,\d+)?$/,
    "MARGIN":/^[0-9]\d{0,5}(\.\d{1,2})*(,\d+)?$/,
    "OVERDUEINTRATE":/^(\d{1,2}(\.\d{0,2})?|100)$/,
    "EMAIL": /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    "MOBILE":/^[1-9]{1}[0-9]{9}$/,
    "LIMITAMT":/^[1-9]\d{0,3}(,\d+)?$/,
    "IFSC":/^[A-Z]{4}0[A-Z0-9]{6}$/
}