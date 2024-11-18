import os from 'os'
import config from '../config/config'
import bcrypt from 'bcryptjs'
import { parsePhoneNumber } from 'libphonenumber-js'
import { getTimezonesForCountry } from 'countries-and-timezones'
import { v4 } from 'uuid'
import { randomInt } from 'crypto'
import jwt from 'jsonwebtoken'
import dayjs from 'dayjs'
import { EInvitationLinkExpirationStatus } from '../constant/organisationConstant'

export default {
    getSystemHealth: () => {
        return {
            cpuUsage: os.loadavg(),
            totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
            freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`
        }
    },
    getApplicationHealth: () => {
        return {
            environment: config.ENV,
            uptime: `${process.uptime().toFixed(2)} Second`,
            memoryUsage: {
                heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
                heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
            }
        }
    },
    parsePhoneNumber: (phoneNumber: string) => {
        try {
            const parsedContactNumber = parsePhoneNumber(phoneNumber)
            if (parsedContactNumber) {
                return {
                    countryCode: parsedContactNumber.countryCallingCode,
                    isoCode: parsedContactNumber.country || null,
                    internationalNumber: parsedContactNumber.formatInternational()
                }
            }

            return {
                countryCode: null,
                isoCode: null,
                internationalNumber: null
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            return {
                countryCode: null,
                isoCode: null,
                internationalNumber: null
            }
        }
    },
    hashPassword: (password: string) => {
        return bcrypt.hash(password, 10)
    },
    comparePassword: (attemptedPassword: string, encPassword: string) => {
        return bcrypt.compare(attemptedPassword, encPassword)
    },
    countryTimezone: (isoCode: string) => {
        return getTimezonesForCountry(isoCode)
    },
    generateRandomId: () => v4(),
    generateOtp: (length: number) => {
        const min = Math.pow(10, length - 1)
        const max = Math.pow(10, length) - 1

        return randomInt(min, max + 1).toString()
    },
    generateToken: (payload: object, secret: string, expiry: number) => {
        return jwt.sign(payload, secret, {
            expiresIn: expiry
        })
    },
    verifyToken: (token: string, secret: string) => {
        return jwt.verify(token, secret)
    },
    getDomainFromUrl: (url: string) => {
        try {
            const parsedUrl = new URL(url)
            return parsedUrl.hostname
        } catch (err) {
            throw err
        }
    },
    generateResetPasswordExpiry: (minute: number) => {
        return dayjs().valueOf() + minute * 60 * 1000
    },
    generateExpirationStatus: (status: EInvitationLinkExpirationStatus): Date | null => {
        switch (status) {
            case EInvitationLinkExpirationStatus.EXPIRED_WITHIN_1_DAY:
                return dayjs().utc().add(1, 'day').toDate();
            case EInvitationLinkExpirationStatus.EXPIRED_WITHIN_7_DAYS:
                return dayjs().utc().add(7, 'days').toDate();
            case EInvitationLinkExpirationStatus.EXPIRED_WITHIN_30_DAYS:
                return dayjs().utc().add(30, 'days').toDate();
            default:
                return null;
        }
    }
    
}