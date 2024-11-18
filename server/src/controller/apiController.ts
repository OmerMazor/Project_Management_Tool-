/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Request, Response } from 'express'
import httpResponse from '../util/httpResponse'
import responseMessage from '../constant/responseMessage'
import httpError from '../util/httpError'
import quicker from '../util/quicker'
import {
    ValidateChangePasswordBody,
    ValidateForgotPasswordBody,
    validateJoiSchema,
    ValidateLoginBody,
    ValidateRegisterBody,
    ValidateResetPasswordBody,
    ValidateCreateOrganizationBody,
    ValidateInviteUserRequestBody,
} from '../service/validationService'
import {
    IChangePasswordRequestBody,
    IDecryptedJwt,
    IForgotPasswordRequestBody,
    ILoginUserRequestBody,
    IRefreshToken,
    IRegisterUserRequestBody,
    IResetPasswordRequestBody,
    IUser,
} from '../types/userTypes'
import { 
    IOrganization,
    ICreateOrganizationRequestBody,
    IInviteUserRequestBody,
} from '../types/organisationTypes'
import { 
    EOrganizationStatus,
} from '../constant/organisationConstant'

import {
    IRegisterRequest,
    IConfirmRequest,
    ILoginRequest,
    ISelfIdentificationRequest,
    IForgotPasswordRequest,
    IResetPasswordRequest,
    IChangePasswordRequest,
    ICreateOrganizationRequest,
    IInviteUserRequest,
    IConfirmInvitationRequest,
    IUpdateUserToOrganisation
} from '../types/payloadTypes'

import databaseService from '../service/databaseService'
import { EUserRole } from '../constant/userConstant'
import emailService from '../service/emailService'
import config from '../config/config'
import logger from '../util/logger'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { EApplicationEnvironment } from '../constant/application'
import { 
    generateConfirmationEmailHtml, 
    generatePasswordResetHtml,
    generateAccountConfirmedHtml,
    generatePasswordResetRequestHtml,
    generatePasswordChangedHtml
} from '../service/htmlService'

dayjs.extend(utc)

export default {
    self: (req: Request, res: Response, next: NextFunction) => {
        try {
            httpResponse(req, res, 200, responseMessage.SUCCESS)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    health: (req: Request, res: Response, next: NextFunction) => {
        try {
            const healthData = {
                application: quicker.getApplicationHealth(),
                system: quicker.getSystemHealth(),
                timestamp: Date.now()
            }

            httpResponse(req, res, 200, responseMessage.SUCCESS, healthData)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { body } = req as IRegisterRequest

            const { error, value } = validateJoiSchema<IRegisterUserRequestBody>(ValidateRegisterBody, body)
            if (error) {
                return httpError(next, error, req, 422)
            }

            const { name, emailAddress, password, phoneNumber, consent, role } = value

            const { countryCode, isoCode, internationalNumber } = quicker.parsePhoneNumber(`+` + phoneNumber)

            if (!countryCode || !isoCode || !internationalNumber) {
                return httpError(next, new Error(responseMessage.INVALID_PHONE_NUMBER), req, 422)
            }

            const timezone = quicker.countryTimezone(isoCode)

            if (!timezone || timezone.length === 0) {
                return httpError(next, new Error(responseMessage.INVALID_PHONE_NUMBER), req, 422)
            }

            const user = await databaseService.findUserByEmailAddress(emailAddress)
            if (user) {
                return httpError(next, new Error(responseMessage.ALREADY_EXIST('user', emailAddress)), req, 403)
            }

           
            const encryptedPassword = await quicker.hashPassword(password)

            const token = quicker.generateRandomId()
            const code = quicker.generateOtp(6)
            
            const payload: IUser = {
                name,
                emailAddress,
                phoneNumber: {
                    countryCode: countryCode,
                    isoCode: isoCode,
                    internationalNumber: internationalNumber
                },
                accountConfirmation: {
                    status: false,
                    token,
                    code: code,
                    timestamp: null
                },
                passwordReset: {
                    token: null,
                    expiry: null,
                    lastResetAt: null
                },
                lastLoginAt: null,
                role: role ? role : EUserRole.USER,
                organizationId : null,
                timezone: timezone[0].name,
                password: encryptedPassword,
                consent:consent
            }

            const newUser = await databaseService.registerUser(payload)

            const confirmationUrl = `${config.FRONTEND_URL}/app/confirmation/${token}?code=${code}`
            const to = [emailAddress]
            const subject = 'Confirm Your Account'
            const text = `Hey ${name}, Please confirm your account by clicking on the link below\n\n${confirmationUrl}`

            const html = generateConfirmationEmailHtml(name, confirmationUrl);

            emailService.sendEmail(to, subject, text, html).catch((err) => {
                logger.error('EMAIL_SERVICE', {
                    meta: err,
                });
            });

            httpResponse(req, res, 201, responseMessage.SUCCESS, { _id: newUser._id})
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    confirmation: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { params, query } = req as IConfirmRequest

            const { token } = params
            const { code } = query

            const user = await databaseService.findUserByConfirmationTokenAndCode(token, code)
            if (!user) {
                return httpError(next, new Error(responseMessage.INVALID_ACCOUNT_CONFIRMATION_TOKEN_OR_CODE), req, 400)
            }

            if (user.accountConfirmation.status) {
                return httpError(next, new Error(responseMessage.ACCOUNT_ALREADY_CONFIRMED), req, 400)
            }

            user.accountConfirmation.status = true
            user.accountConfirmation.timestamp = dayjs().utc().toDate()

            await user.save()

            const to = [user.emailAddress]
            const subject = 'Account Confirmed'
            const text = `Your account has been confirmed`

            const html = generateAccountConfirmedHtml();

            emailService.sendEmail(to, subject, text, html).catch((err) => {
                logger.error('EMAIL_SERVICE', {
                    meta: err,
                });
            });

            httpResponse(req, res, 200, responseMessage.SUCCESS)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { body } = req as ILoginRequest

            const { error, value } = validateJoiSchema<ILoginUserRequestBody>(ValidateLoginBody, body)
            if (error) {
                return httpError(next, error, req, 422)
            }

            const { emailAddress, password } = value

            const user = await databaseService.findUserByEmailAddress(emailAddress, `+password`)
            if (!user) {
                return httpError(next, new Error(responseMessage.NOT_FOUND('user')), req, 404)
            }

            const isValidPassword = await quicker.comparePassword(password, user.password)
            if (!isValidPassword) {
                return httpError(next, new Error(responseMessage.INVALID_EMAIL_OR_PASSWORD), req, 400)
            }

            const accessToken = quicker.generateToken(
                {
                    userId: user.id
                },
                config.ACCESS_TOKEN.SECRET as string,
                config.ACCESS_TOKEN.EXPIRY
            )

            const refreshToken = quicker.generateToken(
                {
                    userId: user.id
                },
                config.REFRESH_TOKEN.SECRET as string,
                config.REFRESH_TOKEN.EXPIRY
            )

            user.lastLoginAt = dayjs().utc().toDate()
            await user.save()

            const refreshTokenPayload: IRefreshToken = {
                token: refreshToken
            }

            await databaseService.createRefreshToken(refreshTokenPayload)

            const DOMAIN = quicker.getDomainFromUrl(config.SERVER_URL as string)

            res.cookie('accessToken', accessToken, {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * config.ACCESS_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(config.ENV === EApplicationEnvironment.DEVELOPMENT)
            }).cookie('refreshToken', refreshToken, {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * config.REFRESH_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(config.ENV === EApplicationEnvironment.DEVELOPMENT)
            })

            httpResponse(req, res, 200, responseMessage.SUCCESS, {
                accessToken,
                refreshToken
            })
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    selfIdentification: (req: Request, res: Response, next: NextFunction) => {
        try {
            const { authenticatedUser } = req as ISelfIdentificationRequest
            httpResponse(req, res, 200, responseMessage.SUCCESS, authenticatedUser)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    logout: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { cookies } = req
            const { refreshToken } = cookies as {
                refreshToken: string | undefined
            }

            if (refreshToken) {
                await databaseService.deleteRefreshToken(refreshToken)
            }

            const DOMAIN = quicker.getDomainFromUrl(config.SERVER_URL as string)

            res.clearCookie('accessToken', {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * config.ACCESS_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(config.ENV === EApplicationEnvironment.DEVELOPMENT)
            })

            res.clearCookie('refreshToken', {
                path: '/api/v1',
                domain: DOMAIN,
                sameSite: 'strict',
                maxAge: 1000 * config.REFRESH_TOKEN.EXPIRY,
                httpOnly: true,
                secure: !(config.ENV === EApplicationEnvironment.DEVELOPMENT)
            })

            httpResponse(req, res, 200, responseMessage.SUCCESS)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    refreshToken: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { cookies } = req

            const { refreshToken, accessToken } = cookies as {
                refreshToken: string | undefined
                accessToken: string | undefined
            }

            if (accessToken) {
                return httpResponse(req, res, 200, responseMessage.SUCCESS, {
                    accessToken
                })
            }

            if (refreshToken) {
                const rft = await databaseService.findRefreshToken(refreshToken)
                if (rft) {
                    const DOMAIN = quicker.getDomainFromUrl(config.SERVER_URL as string)

                    let userId: null | string = null

                    try {
                        const decryptedJwt = quicker.verifyToken(refreshToken, config.REFRESH_TOKEN.SECRET as string) as IDecryptedJwt
                        userId = decryptedJwt.userId
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    } catch (err) {
                        userId = null
                    }

                    if (userId) {
                       
                        const accessToken = quicker.generateToken(
                            {
                                userId: userId
                            },
                            config.ACCESS_TOKEN.SECRET as string,
                            config.ACCESS_TOKEN.EXPIRY
                        )

                        res.cookie('accessToken', accessToken, {
                            path: '/api/v1',
                            domain: DOMAIN,
                            sameSite: 'strict',
                            maxAge: 1000 * config.ACCESS_TOKEN.EXPIRY,
                            httpOnly: true,
                            secure: !(config.ENV === EApplicationEnvironment.DEVELOPMENT)
                        })

                        return httpResponse(req, res, 200, responseMessage.SUCCESS, {
                            accessToken
                        })
                    }
                }
            }

            httpError(next, new Error(responseMessage.UNAUTHORIZED), req, 401)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    forgotPassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const { body } = req as IForgotPasswordRequest

            const { error, value } = validateJoiSchema<IForgotPasswordRequestBody>(ValidateForgotPasswordBody, body)
            if (error) {
                return httpError(next, error, req, 422)
            }

            const { emailAddress } = value

            const user = await databaseService.findUserByEmailAddress(emailAddress)
            if (!user) {
                return httpError(next, new Error(responseMessage.NOT_FOUND('user')), req, 404)
            }

            if (!user.accountConfirmation.status) {
                return httpError(next, new Error(responseMessage.ACCOUNT_CONFIRMATION_REQUIRED), req, 400)
            }

            const token = quicker.generateRandomId()
            const expiry = quicker.generateResetPasswordExpiry(15)

            user.passwordReset.token = token
            user.passwordReset.expiry = expiry

            await user.save()

            const resetUrl = `${config.FRONTEND_URL}/aap/reset-password/${token}`
            const to = [emailAddress]
            const subject = 'Account Password Reset Requested'
            const text = `Hey ${user.name}, Please reset your account password by clicking on the link below\n\nLink will expire within 15 Minutes\n\n${resetUrl}`

            const html = generatePasswordResetRequestHtml(user.name, resetUrl);

            emailService.sendEmail(to, subject, text, html).catch((err) => {
                logger.error('EMAIL_SERVICE', {
                    meta: err, 
                });
            });

            httpResponse(req, res, 200, responseMessage.SUCCESS)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    resetPassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { body, params } = req as IResetPasswordRequest

            const { token } = params
            const { error, value } = validateJoiSchema<IResetPasswordRequestBody>(ValidateResetPasswordBody, body)
            if (error) {
                return httpError(next, error, req, 422)
            }

            const { newPassword } = value

            const user = await databaseService.findUserByResetToken(token)
            if (!user) {
                return httpError(next, new Error(responseMessage.NOT_FOUND('user')), req, 404)
            }

            if (!user.accountConfirmation.status) {
                return httpError(next, new Error(responseMessage.ACCOUNT_CONFIRMATION_REQUIRED), req, 400)
            }

            const storedExpiry = user.passwordReset.expiry
            const currentTimestamp = dayjs().valueOf()

            if (!storedExpiry) {
                return httpError(next, new Error(responseMessage.INVALID_REQUEST), req, 400)
            }

            if (currentTimestamp > storedExpiry) {
                return httpError(next, new Error(responseMessage.EXPIRED_URL), req, 400)
            }

            const hashedPassword = await quicker.hashPassword(newPassword)

            user.password = hashedPassword

            user.passwordReset.token = null
            user.passwordReset.expiry = null
            user.passwordReset.lastResetAt = dayjs().utc().toDate()
            await user.save()

            const to = [user.emailAddress]
            const subject = 'Account Password Reset'
            const text = `Hey ${user.name}, You account password has been reset successfully.`

            const html = generatePasswordResetHtml(user.name);

            emailService.sendEmail(to, subject, text, html).catch((err) => {
                logger.error('EMAIL_SERVICE', {
                    meta: err, 
                });
            });

            httpResponse(req, res, 200, responseMessage.SUCCESS)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    changePassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { body, authenticatedUser } = req as IChangePasswordRequest

            const { error, value } = validateJoiSchema<IChangePasswordRequestBody>(ValidateChangePasswordBody, body)
            if (error) {
                return httpError(next, error, req, 422)
            }

            const user = await databaseService.findUserById(authenticatedUser._id, '+password')
            if (!user) {
                return httpError(next, new Error(responseMessage.NOT_FOUND('user')), req, 404)
            }

            const { newPassword, oldPassword } = value

            const isPasswordMatching = await quicker.comparePassword(oldPassword, user.password)
            if (!isPasswordMatching) {
                return httpError(next, new Error(responseMessage.INVALID_OLD_PASSWORD), req, 400)
            }

            if (newPassword === oldPassword) {
                return httpError(next, new Error(responseMessage.PASSWORD_MATCHING_WITH_OLD_PASSWORD), req, 400)
            }

            const hashedPassword = await quicker.hashPassword(newPassword)

            user.password = hashedPassword
            await user.save()

            const to = [user.emailAddress]
            const subject = 'Password Changed'
            const text = `Hey ${user.name}, You account password has been changed successfully.`

            const html = generatePasswordChangedHtml(user.name);

            emailService.sendEmail(to, subject, text, html).catch((err) => {
                logger.error('EMAIL_SERVICE', {
                    meta: err,
                });
            });


            httpResponse(req, res, 200, responseMessage.SUCCESS)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    createOrganisation: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { body } = req as ICreateOrganizationRequest

            const { error, value } = validateJoiSchema<ICreateOrganizationRequestBody>(ValidateCreateOrganizationBody, body)
            
            if (error) {
                return httpError(next, error, req, 422)
            }
            const { name, maxProjects, maxMembers, userId, subscriptionPlan, tags, branding } = value

            const existingUser = await databaseService.findUserById(userId)

            if (!existingUser) {
                return httpError(next, new Error(responseMessage.NOT_FOUND('user')), req, 404)
            }

            const payload : IOrganization = {
                name,
                maxProjects,
                maxMembers,
                isActive: true,
                status: EOrganizationStatus.ACTIVE,
                totalMembersByRole: {
                    [EUserRole.ADMIN]: 1,
                    [EUserRole.USER]: 0,
                    [EUserRole.GUEST]: 0,
                    [EUserRole.CLIENT]: 0,
                    [EUserRole.LEAD]: 0
                },
                subscriptionPlan,
                subscriptionExpiresAt: dayjs().utc().add(1, 'year').toDate(),
                billingDetails: {
                    cardLast4Digits: null,
                    billingEmail: null
                },
                projects: [
                    { projectId: null , name: null , isActive: false }
                ],
                joinSettings: { allowPublicJoin: true, inviteRequired: true, autoApprove: false },
                tags: tags || [],
                customFields: {},
                branding: { 
                    logoUrl: branding?.logoUrl, 
                    primaryColor: null 
                },
                invitationLink: {
                    link: null,
                    expiredAt: null,
                    code: null
                }
            }

            const newOrganization = await databaseService.createOrganisation(payload)
      
            if(!newOrganization){
                return httpError(next, new Error(responseMessage.SOMETHING_WENT_WRONG), req, 500)
            }

            const updateOrganizationIdToUser = await databaseService.findByUserIdAndUpdateOrganizationId(userId,newOrganization._id.toString())

            if(!updateOrganizationIdToUser){
                return httpError(next, new Error(responseMessage.SOMETHING_WENT_WRONG), req, 500)
            }

            httpResponse(req, res, 201, responseMessage.SUCCESS, {_id: newOrganization})
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    organisationIdentification: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { authenticatedUser } = req as ISelfIdentificationRequest

            if (!authenticatedUser.organizationId) {
                return httpResponse(req, res, 400, responseMessage.INVALID_ORGANIZATION_ID);
            }    
            const organizationDetails = await databaseService.findOrganizationDetailsById(authenticatedUser.organizationId)
            httpResponse(req, res, 200, responseMessage.SUCCESS, organizationDetails)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    inviteUserToOrganization: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { body } = req as IInviteUserRequest

            const { error, value } = validateJoiSchema<IInviteUserRequestBody>(ValidateInviteUserRequestBody, body)

            if (error) {
                return httpError(next, error, req, 422)
            }
            const { organizationId, expiredAt } = value

            const checkOrganisationDetails = await databaseService.findOrganizationDetailsById(organizationId)
            
            if (!checkOrganisationDetails) {
                return httpError(next, new Error(responseMessage.NOT_FOUND('organization')), req, 404)
            }

            const code = quicker.generateOtp(6)
            const invitationLink = `${config.FRONTEND_URL}/join/${organizationId}/?code=${code}`
            const expiredAtStatus = quicker.generateExpirationStatus(expiredAt)

            if (expiredAtStatus === null) {
                return httpError(next, responseMessage.INVALID_EXPIRATION_DATE, req, 400);
            }

            const saveInvitationLink = await databaseService.findOrganisationByIdAndUpdate(organizationId, code, invitationLink, expiredAtStatus.toISOString())
            
            if(!saveInvitationLink) {
                return httpError(next,responseMessage.SOMETHING_WENT_WRONG, req, 500)
            }
            httpResponse(req, res, 200, responseMessage.SUCCESS, { invitationLink, code }) 
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    confirmUserInvitation: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { params, query } = req as IConfirmInvitationRequest

            const { organizationId } = params
            const { code } = query
            
            const checkOrganisationDetails = await databaseService.findOrganizationDetailsById(organizationId)

            if (!checkOrganisationDetails) {
                return httpError(next, responseMessage.NOT_FOUND('organization'), req, 404)
            }
            const invitationLink = checkOrganisationDetails.invitationLink;

            if (invitationLink?.code !== code) {
                return httpError(next, responseMessage.INVALID_INVITE_CODE, req, 403);
            }
            const currentDate = dayjs();
            const expiredAtDate = dayjs(invitationLink.expiredAt); 

            if (currentDate.isAfter(expiredAtDate)) {
                return httpError(next, responseMessage.EXPIRED_INVITE_LINK, req, 403);
            }

            httpResponse(req, res, 200, responseMessage.SUCCESS )
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    updateOrganizationDetails: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { params } = req as IUpdateUserToOrganisation

            const { userId,organizationId } = params

            const organizationDetails = await databaseService.findOrganizationDetailsById(organizationId)

            if(!organizationDetails) {
                return httpError(next,responseMessage.NOT_FOUND('organization'), req, 404)
            }

            const updateUserOrganizationId = await databaseService.updateUserOrganizationId(userId,organizationId)

            if(!updateUserOrganizationId) {
                return httpError(next, responseMessage.SOMETHING_WENT_WRONG, req, 500)
            }

            const findUserRole = await databaseService.findUserById(userId)

            if(!findUserRole) {
                return httpError(next, responseMessage.NOT_FOUND('user'), req, 404)
            }


            const updateEUserRoleCountForOrganisation = await databaseService.updateEUserRoleCount(organizationId, findUserRole.role);

            if (!updateEUserRoleCountForOrganisation) {
                return httpError(next, responseMessage.SOMETHING_WENT_WRONG, req, 500);
            }

            httpResponse(req, res, 200, responseMessage.SUCCESS, findUserRole.role)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    }
}   