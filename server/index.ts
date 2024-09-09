import { MongoClient, Db, ObjectId, GridFSBucket } from 'mongodb';
import express, { Request, Response } from 'express';
import multer from 'multer';
import { Readable } from 'stream';

const app = express();
const port = 8080;

app.use(express.json());

//database connection
const url = 'mongodb://localhost:27017';
const dbName = 'myVideoDB';
let db: Db;

const client = new MongoClient(url);

client.connect().then(() => {
    db = client.db(dbName);
    console.log('Connected to database');
});

//middleware
const storage = multer.memoryStorage();
const upload = multer({ storage });

//post route
app.post('/api/upload', upload.single('video'), async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const bucket = new GridFSBucket(db, { bucketName: 'videos' });
    const readableStream = Readable.from(req.file.buffer);

    const uploadStream = bucket.openUploadStream(req.file.originalname);
    readableStream.pipe(uploadStream)
        .on('error', (err) => {
            console.error('Error uploading file:', err);
            return res.status(500).send({ message: 'Error uploading file.' });
        })
        .on('finish', () => {
            return res.status(201).json({ message: 'File uploaded successfully.' });
        });
});


//Get All Videos Route
app.get('/api/video', async (req: Request, res: Response) => {
    const bucket = new GridFSBucket(db, { bucketName: 'videos' });
    const videos: any = [];
    try {
        const cursor = bucket.find({});
    for await (const doc of cursor) {
        console.log(doc)
        videos.push(doc)
    }
    return res.status(200).json({message: "Found", videos})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Error fetching files", error})
    }
})


//Get By Id Route
app.get('/api/video/:id', (req: Request, res: Response) => {
    const bucket = new GridFSBucket(db, { bucketName: 'videos' });
    const id = req.params.id;

    console.log(id);

    try {
        const fileId = new ObjectId(id);  
        const downloadStream = bucket.openDownloadStream(fileId);

        downloadStream
            .on('error', (err) => {
                console.error('Error fetching file:', err);
                return res.status(404).json({ message: 'Video not found.' });
            })
            .pipe(res); 
    } catch (error) {
        console.error('Invalid ID format:', error);
        return res.status(400).json({ message: 'Invalid video ID.' });
    }
});

//Delete Route
app.delete('/api/video/:id', async (req: Request, res: Response) => {
    const bucket = new GridFSBucket(db, { bucketName: 'videos' });

    const fileId = new ObjectId(req.params.id);
    try {
        await bucket.delete(fileId);
        res.status(200).json({ message: 'Video deleted successfully.' });
    } catch (err) {
        console.error('Error deleting file:', err);
        res.status(500).send('Error deleting file.');
    }
});


app.listen(port, () => {
    console.log("app is listening to port 8080");
})