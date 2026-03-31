import { IRole } from "@utils/constant";

export type AppStackType = {
    SignIn: { role?: 'client' | 'professional' };
    RegisterScreen: { role?: 'client' | 'professional' };
    ForgetPassword: undefined;
    RecoverPassword: undefined;
    EditProfile: undefined;
    VerifyScreen: { email?: string | null; role: IRole | null };
    Welcome: undefined;
    VerifyDocument: undefined;
    AddVehicle: undefined;
    HomePageUser: undefined;
    //Tabs: { role: IRole | undefined };
    ProfitionalPosition: { service_id: number };
    HelpMeOut: { service_id: number };
    //Locations: { data: GooglePlaceData; details: GooglePlaceDetail | null };
    AddressDetails: undefined;
    Notifications: undefined;
    ProfessionnelHome: undefined;
    Documents: undefined;
    DocumentDetail: undefined;
    AddLocation: undefined;
    //InterventionDetail: { intervention: IIntervention };
    PrixIntervention: { interevention_id: number };
    SelectLocationScreen: { lat: number; lng: number };
};