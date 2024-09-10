import express from 'express';
import filesRouter from '../routes/filesRouter'

const app = express();
const port = 8080;

app.use(express.json());

app.use('/api/video',filesRouter)

app.listen(port, () => {
    console.log("app is listening to port 8080");
})