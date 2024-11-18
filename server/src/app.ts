import express, { Application, NextFunction, Request, Response } from 'express'
import path from 'path'
import router from './router/apiRouter'
import globalErrorHandler from './middleware/globalErrorHandler'
import responseMessage from './constant/responseMessage'
import httpError from './util/httpError'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import passport from './config/passport';

const app: Application = express()

app.use(helmet())
app.use(cookieParser())
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../', 'public')))
app.use(passport.initialize());

app.use('/api/v1', router)

app.use((req: Request, _: Response, next: NextFunction) => {
    try {
        throw new Error(responseMessage.NOT_FOUND('route'))
    } catch (err) {
        httpError(next, err, req, 404)
    }
})

app.use(globalErrorHandler)

export default app