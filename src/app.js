import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'))


//import router here
import userRouter from './routes/user.routes.js'
import orderRouter from './routes/order.routes.js'
import productRouter from './routes/product.routes.js'

app.use('/api/v1/users', userRouter)
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/products', productRouter)



export default app