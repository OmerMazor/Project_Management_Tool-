import { Request } from 'express';
import {
    IChangePasswordRequestBody,
    IForgotPasswordRequestBody,
    ILoginUserRequestBody,
    IRegisterUserRequestBody,
    IResetPasswordRequestBody,
    IUser,
    IUserWithId
} from '../types/userTypes'

import {
    ICreateOrganizationRequestBody,
    IInviteUserRequestBody,
} from '../types/organisationTypes'

export interface IRegisterRequest extends Request {
    body: IRegisterUserRequestBody
}

export interface IConfirmRequest extends Request {
    params: {
        token: string
    }
    query: {
        code: string
    }
}

export interface ILoginRequest extends Request {
    body: ILoginUserRequestBody
}

export interface ISelfIdentificationRequest extends Request {
    authenticatedUser: IUser
}

export interface IForgotPasswordRequest extends Request {
    body: IForgotPasswordRequestBody
}

export interface IResetPasswordRequest extends Request {
    params: {
        token: string
    }
    body: IResetPasswordRequestBody
}

export interface IChangePasswordRequest extends Request {
    authenticatedUser: IUserWithId
    body: IChangePasswordRequestBody
}

export interface ICreateOrganizationRequest extends Request {
    body: ICreateOrganizationRequestBody
}

export interface IInviteUserRequest extends Request {
    body: IInviteUserRequestBody
    
}

export interface IConfirmInvitationRequest extends Request {
    params: {
        organizationId: string
    }
    query: {
        code: string
    }
}

export interface IUpdateUserToOrganisation extends Request {
    params: {
        userId: string
        organizationId: string
    }
}