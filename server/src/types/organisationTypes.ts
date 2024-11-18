import { EUserRole } from '../constant/userConstant'
import { EOrganizationStatus, ESubscriptionPlan,EInvitationLinkExpirationStatus } from '../constant/organisationConstant'


export interface IOrganization {                
    name: string;                              
    maxProjects: number;                        
    maxMembers: number;                         
    isActive: boolean;                          
    status: EOrganizationStatus;                
    totalMembersByRole: {                       
        [key in EUserRole]: number;
    };
    subscriptionPlan: ESubscriptionPlan;                   
    subscriptionExpiresAt?: Date;               
    billingDetails?: {
        cardLast4Digits: string | null ; 
        billingEmail: string | null;
    };                         
    projects?: {
        projectId: string | null;
        name: string | null;
        isActive: boolean;
    }[];
    joinSettings?: {
        allowPublicJoin: boolean;
        inviteRequired: boolean;
        autoApprove: boolean;
    };
    tags?: string[];                           
    customFields?: { [key: string]: string };  
    branding?: {
        logoUrl?: string;
        primaryColor?: string | null;
    };
    invitationLink?: {
        link: string | null;
        expiredAt: Date | null;
        code: string | null;
    }
}

export interface ICreateOrganizationRequestBody {
    name: string;                              
    maxProjects: number;                        
    maxMembers: number;
    subscriptionPlan: ESubscriptionPlan;
    joinSettings?: {
        allowPublicJoin?: boolean;
        inviteRequired?: boolean;
        autoApprove?: boolean;
    };
    tags?: string[];
    branding?: {
        logoUrl?: string;
        primaryColor?: string;
    };
    userId: string;
}

export interface IInviteUserRequestBody {
    organizationId: string;
    expiredAt: EInvitationLinkExpirationStatus;
}