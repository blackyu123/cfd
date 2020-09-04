import {NewRequest, parseResponseAndHandleErrors, URLForEndpoint} from "./request";
import {ERROR_SERVER_UNREACHABLE} from "../data/datasourceConst";
import Cookies from "js-cookie";
import {locale} from "../locale";
const API_HOST = "https://tdmxapi.bclg.in";

export default class Datasource {

    constructor() {
        this.token = null;
    }

    static get shared() {
        if (Datasource.instance == null || Datasource.instance === undefined) {
            Datasource.instance = new Datasource();
        }

        let instanceToken = Datasource.instance.token;
        if (instanceToken === undefined || instanceToken === "null") {
            instanceToken = Cookies.get("ftnToken");
            console.log("instanceToken", instanceToken);
        } else {
            console.log('notinstance', instanceToken);
        }
        return Datasource.instance;
    }

    async callAPI(endPoint, method = "GET", queryObject, requestBody, hasContentType = true) {
        const url = URLForEndpoint(endPoint, queryObject);
        const request = NewRequest(method, hasContentType);

        if (!hasContentType) {
            delete request.headers["Content-Type"];
            request.body = requestBody;
        } else if (method !== "GET" && requestBody) {
            request.body = JSON.stringify(requestBody);
        }
        let response;
        try {
            response = await fetch(url, request);
        } catch (err) {
            throw ERROR_SERVER_UNREACHABLE;
        }
        return await parseResponseAndHandleErrors(response);
    }

    async callAPI2(endPoint, method = "GET", queryObject, requestBody) {
        const url = URLForEndpoint(endPoint, queryObject);


        let formBody = [];
        for (let property in requestBody) {
            const encodedKey = encodeURIComponent(property);
            const encodedValue = encodeURIComponent(requestBody[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");


        const request = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                "Authorization": "Bearer " + this.token
            },
            body: formBody,
            method: method,
        };

        let response;
        try {
            response = await fetch(url, request);
        } catch (err) {
            console.log('err', err);
            throw ERROR_SERVER_UNREACHABLE;
        }

        return response.json();
    }

    // by default, withToken set to true
    callWebService(endPoint, data, method, withToken = true, withFormData = false) {
        const request = {
            dataType: "json",
            url: `${API_HOST}${endPoint}`,
            cache: false,
            success: function (response) {
                return response;
            }
        };
        if (method) {
            request.method = method;
        }

        if (data) {
            request.data = data;
        }

        if (withToken) {
            data.token = Cookies.get('authToken');
            data.UserSchool_Session = Cookies.get('schoolSession');
            data.UserID_Session = Cookies.get('userIDSession');
            data.UserType_Session = Cookies.get('userTypeSession');
            data.UserUniversity_Session = Cookies.get('userUniversitySession');
            data.UserEmail_Session = Cookies.get('userEmailSession');
            data.USRid_Session = Cookies.get('usRidSession');
            data.UserName_Session = Cookies.get('userNameSession');
            data.UserSchoolName_Session = Cookies.get('userSchoolNameSession');
            data.UserSchoolInfoSerialize_Session = Cookies.get('userSchoolInfoSerializeSession');
            const extendTime = Cookies.get('extendTime');
            const expireTime = Cookies.get('expireTime');
            // const nowMs = getMs();


            //expire date after login
            // if (nowMs >= extendTime && nowMs < expireTime) {
            //     const newExtendDate = new Date(Number(expireTime) + (120 * 60 * 1000));
            //     if (newExtendDate.getTime() >= Number(expireTime)) {
            //         const newExpireDate = new Date(Number(expireTime) + (180 * 60 * 1000));
            //         this.extendCookies(newExpireDate, newExtendDate);
            //     }
            // }
        }

        if (withFormData) {
            request.processData = false;
            request.contentType = false;
        }

        // return jQuery.ajax(request);
    }

    async login(type, user, password) {
        const data = {
            grant_type: type,
            username: user,
            password: password,
        };
        try {
            const response = await this.callAPI2("/token", "POST", null, data);
            Cookies.set("ftnToken", response.access_token);
            this.token = response.access_token;
            return response;

        } catch (e) {
            throw e;
        }
    }

    async Logout(){
        this.token = '';
    }

    async checkToken(){
        if(this.token){
            return this.token;
        }
    }

    // async UpdatePasswordVerification() {
    //     try {
    //         const response = await this.callAPI2("/api/v1/Member/GetPassword", "GET", null, null);
    //         return response;
    //
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async getHomeIndex() {
    //     try {
    //         const response = await this.callAPI2("/api/v1/Home/Index", "GET", null, null);
    //         return response;
    //
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async getTransferPointSelectionIndex() {
    //     try {
    //         const response = await this.callAPI2("/api/v1/Point/GetTransferPointSelection", "GET", null, null);
    //         return response;
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async getConvertPointSelectionIndex() {
    //     try {
    //         const response = await this.callAPI2("/api/v1/Point/GetConvertPointFromSelection", "GET", null, null);
    //         return response;
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async getWithdrawType() {
    //     try {
    //         const response = await this.callAPI2("/api/v1/Point/GetWithdrawAmountType", "GET", null, null);
    //         return response;
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async getConvertTo(fromID) {
    //     const data = {
    //         id: fromID
    //     };
    //     try {
    //         const response = await this.callAPI2("/api/v1/Point/GetConvertPointToSelection", "GET", data, null);
    //         return response;
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async TransferMemberSearch(Keyword) {
    //     const data = {
    //         SearchKeyword: Keyword
    //     };
    //     try {
    //         const response = await this.callAPI2("/api/v1/Point/GetTransferMemberSearch", "POST", null, data);
    //         return response;
    //
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async TransferConfirmation(Password, TransferPointType, Amount, TransferID, TransferLoginNameTo, TransferLoginNameFrom, PointTypeName) {
    //     const data = {
    //         TransferPointType:TransferPointType,
    //         TransferID: TransferID,
    //         TransferLoginNameFrom: TransferLoginNameFrom,
    //         TransferLoginNameTo: TransferLoginNameTo,
    //         ConfirmPassword: Password,
    //         PointTypeName: PointTypeName,
    //         Amount: Amount
    //
    //     };
    //     try {
    //         const response = await this.callAPI2("/api/v1/Point/PostTransferConfirmation", "POST", null, data);
    //         return response;
    //
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async ConvertConfirmation(Amount, ConvertPointFrom, ConvertPointTo, ConfirmPassword) {
    //     const data = {
    //         Amount:Amount,
    //         ConvertPointFrom: ConvertPointFrom,
    //         ConvertPointTo: ConvertPointTo,
    //         ConfirmPassword: ConfirmPassword,
    //     };
    //     try {
    //         const response = await this.callAPI2("/api/v1/Point/PostConvertConfirmation", "POST", null, data);
    //         return response;
    //
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async WithdrawalConfirmation(WithdrawalMethod, WithdrawAmount, ETHWalletAddress, PointType, SecondPassword, VerificationCode) {
    //     const data = {
    //         WithdrawalMethod: WithdrawalMethod,
    //         WithdrawAmount: WithdrawAmount,
    //         ETHWalletAddress: ETHWalletAddress,
    //         PointType: PointType,
    //         SecondPassword: SecondPassword,
    //         VerificationCode: VerificationCode,
    //     };
    //     try {
    //         const response = await this.callAPI2("/api/v1/Point/PostWithdrawAmountTypeConfirmation", "POST", null, data);
    //         return response;
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    //
    // async GetMemoList() {
    //     try {
    //         const response = await this.callAPI2("/api/v1/CMS/GetMemoList", "GET", null, null);
    //         return response;
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    //
    // async GetMemo(ID) {
    //     try {
    //         const response = await this.callAPI2("/api/v1/CMS/GetMemo?id="+ID, "GET", null, null);
    //         return response;
    //
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    //
    // async getProfile(){
    //     try {
    //         const response = await this.callAPI2("/api/v1/Member/GetProfile", "GET", null, null);
    //         return response;
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async updateProfile(FullName,Email,MobileDialCode,MobileNo,DocumentNumber,SecondPassword,SMSVerificationDigit){
    //     const data = {
    //         FullName: FullName,
    //         Email: Email,
    //         MobileDialCode: MobileDialCode,
    //         MobileNo: MobileNo,
    //         DocumentNumber: DocumentNumber,
    //         SecondPassword: SecondPassword,
    //         SMSVerificationDigit: SMSVerificationDigit
    //     };
    //
    //     try {
    //         const response = await this.callAPI2("/api/v1/Member/PostProfile", "POST", null, data);
    //         return response;
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async updatePassword(LoginPassword,NewPassword,ConfirmPassword,SecondPassword,SMSVerificationDigit){
    //     const data = {
    //         LoginPassword: LoginPassword,
    //         NewPassword: NewPassword,
    //         ConfirmPassword: ConfirmPassword,
    //         SecondPassword: SecondPassword,
    //         SMSVerificationDigit: SMSVerificationDigit
    //     };
    //
    //     try {
    //         const response = await this.callAPI2("/api/v1/Member/PostPassword", "POST", null, data);
    //         return response;
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async updateSecurityPassword(NewPassword,ConfirmPassword,SecondPassword,SMSVerificationDigit){
    //     const data = {
    //         LoginPassword: LoginPassword,
    //         NewPassword: NewPassword,
    //         ConfirmPassword: ConfirmPassword,
    //         SecondPassword: SecondPassword,
    //         SMSVerificationDigit: SMSVerificationDigit
    //     };
    //
    //     try {
    //         const response = await this.callAPI2("/api/v1/Member/PostSecurityPassword", "POST", null, data);
    //         return response;
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async getVerifyCode(MobileNo){
    //     try {
    //         const response = await this.callAPI2("/api/v1/Member/GetSMSVerification?MobileNo=6"+MobileNo, "GET", null, null);
    //         return response;
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async getInviteQRCode(){
    //     const data = {
    //         Data: 'InviteLink'
    //     };
    //     try {
    //         const response = await this.callAPI2("/api/v1/Member/GetInvitationQR?Data=InviteLink", "GET", data, null);
    //         return response;
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async getTeam(){
    //     try {
    //         const response = await this.callAPI2("/api/v1/Member/GetMyTeam", "GET", null, null);
    //         return response;
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    //
    // async postTeam(MemberSearch,MemberID){
    //     const data = {
    //         MemberSearch: MemberSearch,
    //         MemberID: MemberID
    //     };
    //     console.log(data)
    //     try {
    //         const response = await this.callAPI2("/api/v1/Member/PostMyTeam", "POST", null, data);
    //         return response;
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async getReportGroupSales(){
    //     try {
    //         const response = await this.callAPI2("/api/v1/Report/GetGroupSales", "GET", null, null);
    //         return response;
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async getReportWithdrawalList(){
    //     try {
    //         const response = await this.callAPI2("/api/v1/Report/GetWithdrawalList", "GET", null, null);
    //         return response;
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async getAboutUs(){
    //     try {
    //         const response = await this.callAPI2("/api/v1/CMS/GetAboutUs", "GET", null, null);
    //         return response;
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async getTermsAndConditions(){
    //     try {
    //         const response = await this.callAPI2("/api/v1/CMS/GetTermsAndConditions", "GET", null, null);
    //         return response;
    //     } catch (e) {
    //         throw e;
    //     }
    // }
    //
    // async getUserLicense(){
    //     try {
    //         const response = await this.callAPI2("/api/v1/CMS/GetUserLicense", "GET", null, null);
    //         return response;
    //     } catch (e) {
    //         throw e;
    //     }
    // }

}

