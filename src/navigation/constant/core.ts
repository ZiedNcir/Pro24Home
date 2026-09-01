import { IRole } from "@utils/constant";
import type { CreateInterventionRequest } from '@store/api/api.types';

export type AppStackType = {
    SignIn: { role?: 'client' | 'professional' };
    RegisterScreen: { role?: 'client' | 'professional' };
    VerifyScreen: { email?: string | null; role: IRole | null };
    AccountPendingScreen: undefined;
    AddAddress: undefined;
    PriceEstimation: { intervention: CreateInterventionRequest };
    PaymentTravelFee: { intervention: CreateInterventionRequest };
    InterventionSuccess: undefined;
    InterventionDetail: { intervention_id: number };
    NewIntervention: { service_id?: number; service_name?: string } | undefined;

    ForgetPassword: undefined;
    RecoverPassword: undefined;
    EditProfile: undefined;
    Welcome: undefined;
    AccountType: undefined;
    VerifyDocument: undefined;
    AddVehicle: undefined;
    HomePageUser: undefined;
    //Tabs: { role: IRole | undefined };
    ProfitionalPosition: { service_id: number };
    HelpMeOut: { service_id: number };
    //Locations: { data: GooglePlaceData; details: GooglePlaceDetail | null };



    Notifications: undefined;
    ProfessionnelHome: undefined;
    Documents: undefined;
    DocumentDetail: undefined;
    AddLocation: undefined;
    //InterventionDetail: { intervention: IIntervention };
    PrixIntervention: { interevention_id: number };
    SelectLocationScreen: { lat: number; lng: number };
    Tabs: undefined;
};

export type BottomTabType = {
    Home: undefined;
    Documents: undefined;
    Profile: undefined;
    SettingPage: undefined;
    ListIntervention: undefined;
};
