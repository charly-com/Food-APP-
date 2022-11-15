import express, {Request, Response} from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import userRouter from './routes/Users'; 
import indexRouter from './routes/index';
import {db} from './config/index';

db.sync().then(() => {
    console.log('Database connected');
}).catch(err=> {
    console.log(err);
})

const app = express();

app.use(express.json());
app.use(logger('dev'));
app.use(cookieParser());

//Router middleware
app.use('/users', userRouter);
app.use("/", indexRouter);

const port = 4000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

export default app;