import { ObjectId, GridFSBucket } from 'mongodb';
import express, { Request, Response } from 'express';
import upload from '../utils/middleware';
import { Readable } from 'stream';
import databaseConnect from '../utils/dbConnect';

const router = express.Router();

//post route
router.post('/upload', upload.single('video'), async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const db = await databaseConnect();

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


//get all videos
router.get('/', async (req: Request, res: Response) => {
    const db = await databaseConnect();
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

//get by id
router.get('/:id', async (req: Request, res: Response) => {
    const db = await databaseConnect();
    const bucket = new GridFSBucket(db, { bucketName: 'videos' });
    const id = req.params.id;

    if(!ObjectId.isValid(id)){
        return res.status(500).json({message: "Invalid Id"})
    }

    try {
        const fileId = new ObjectId(id);  

        const videoFile = await bucket.find({ _id: fileId }).toArray();
        console.log(videoFile)
        if(videoFile.length === 0){
            return res.status(500).json({message: "file not found"})
        }

        res.set({
            'Content-Type': 'video/mp4',
            'Content-Disposition': `attachment; filename="${videoFile[0].filename}"`,
            'Content-Length': videoFile[0].length,
        });

        const downloadStream = bucket.openDownloadStream(fileId);

        downloadStream.on('error', (err) => {
            console.error('Error downloading video:', err);
            return res.status(500).json({ message: 'Error downloading video.' });
        });

        downloadStream.pipe(res).on('error', (err) => {
            console.error('Stream error:', err);
            res.status(500).json({ message: 'Error streaming video.' });
        })
        .on('finish', () => {
            console.log("Streaming complete for a video", videoFile[0].filename)
        })

    } catch (error) {
        console.error('Error fetching video:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

//delete by id
router.delete('/:id', async (req: Request, res: Response) => {
    const db = await databaseConnect();
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

export default router;