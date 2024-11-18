import mongoose from 'mongoose';
import { IOrganization } from '../types/organisationTypes';
import { EUserRole } from '../constant/userConstant';
import { EOrganizationStatus, ESubscriptionPlan, EInvitationLinkExpirationStatus } from '../constant/organisationConstant';

const organisationSchema = new mongoose.Schema<IOrganization>({
    name: {
        type: String,
        minlength: 2,
        maxlength: 72,
        required: true,
        unique: true
    },
    maxProjects: {
        type: Number,
        required: true
    },
    maxMembers: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    },
    status: {
        type: String,
        default: EOrganizationStatus.ACTIVE,
        enum: EOrganizationStatus,
        required: true
    },
    totalMembersByRole: {
        type: Map,
        of: Number,
        default: {
            [EUserRole.USER]: 0,
            [EUserRole.ADMIN]: 0,
            [EUserRole.GUEST]: 0,
            [EUserRole.CLIENT]: 0,
            [EUserRole.LEAD]: 0
        },
        required: true
    },
    subscriptionPlan: {
        type: String,
        default: ESubscriptionPlan.FREE,
        enum: ESubscriptionPlan,
        required: true
    },
    subscriptionExpiresAt: {
        type: Date,
        default: null
    },
    billingDetails: {
        cardLast4Digits: {
            type: String,
            required: false,
        },
        billingEmail: {
            type: String,
            required: false,
        },
    },
    projects: [
        {
            projectId: { type: String },
            name: { type: String },
            isActive: { type: Boolean, default: true },
        },
    ],
    joinSettings: {
        allowPublicJoin: { type: Boolean, default: false },
        inviteRequired: { type: Boolean, default: true },
        autoApprove: { type: Boolean, default: false },
    },
    invitationLink: {
        link: { 
            type: String , 
            required: false
        },
        expiredAt: { 
            type: String, 
            enum:EInvitationLinkExpirationStatus, 
            default: EInvitationLinkExpirationStatus.EXPIRED_WITHIN_1_DAY
        }, 
        code: {
            type: String,
        },
        
    },
    tags: [{ type: String, trim: true }],
    customFields: {
        type: Map,
        of: String,
        default: {},
        required: false,
    },
    branding: {
        logoUrl: { type: String },
        primaryColor: { type: String },
    },
}, { timestamps: true}
)

export default mongoose.model<IOrganization>('Organization', organisationSchema)
