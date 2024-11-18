import { NextFunction, Request, Response } from 'express'
import { IUser } from '../types/userTypes'
import httpError from '../util/httpError'
import responseMessage from '../constant/responseMessage'
import { EUserRole } from '../constant/userConstant'

interface IAuthenticatedRequest extends Request {
    authenticatedUser: IUser
}

export default (roles: EUserRole[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            const user = (req as IAuthenticatedRequest).authenticatedUser

            if (!user) {
                return httpError(next, new Error(responseMessage.UNAUTHORIZED), req, 401)
            }

            if (!roles.includes(user.role)) {
                return httpError(next, new Error(responseMessage.FORBIDDEN), req, 403)
            }

            next()
        } catch (error) {
            httpError(next, error, req, 500)
        }
    }
}