import { Router } from 'express'
import apiController from '../controller/apiController'
import authentication from '../middleware/authentication'
import authorize from '../middleware/authorization'
import rateLimit from '../middleware/rateLimit'
import { EUserRole } from '../constant/userConstant'

const router = Router()

// system information routes
router.route('/self').get(apiController.self)
router.route('/health').get(apiController.health)

// Authenication routes
router.route('/register').post(rateLimit, apiController.register)
router.route('/confirmation/:token').put(rateLimit, apiController.confirmation)
router.route('/login').post(rateLimit, apiController.login)
router.route('/self-identification').get(authentication, apiController.selfIdentification)
router.route('/logout').put(authentication, apiController.logout)
router.route('/refresh-token').post(rateLimit, apiController.refreshToken)
router.route('/forgot-password').put(rateLimit, apiController.forgotPassword)
router.route('/reset-password/:token').put(rateLimit, apiController.resetPassword)
router.route('/change-password').put(authentication, apiController.changePassword)

// Organisation routes
router.route('/create-organisation').post(authentication, authorize([EUserRole.ADMIN]), apiController.createOrganisation)
router.route('/organisation-identification').get(authentication, apiController.organisationIdentification)
router.route('/create-invitation-link').post(authentication,authorize([EUserRole.ADMIN]), apiController.inviteUserToOrganization)
router.route('/confirm-user-invitation/:organizationId').get(apiController.confirmUserInvitation)
router.route('/update-organization-details/:organizationId/:userId').get(authentication,apiController.updateOrganizationDetails)

export default router