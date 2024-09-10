import React, { useState } from 'react'
import axios from 'axios';
import useGetFiles from './GetFiles';
import DownloadBtn from './DownloadBtn';
import DeleteBtn from './DeleteBtn';

const UploadFiles = () => {
    const [files, getAllFiles] = useGetFiles()
    const [selectedFile, setSelectedFile] = useState(null); 

    const uploadFile = async(event: any) => {
        event.preventDefault();

        if (!selectedFile) {
            console.log("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append('video', selectedFile);

        try {
            const res = await axios.post('/api/video/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(res);
            await getAllFiles()
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    }

    return (
        <div className='w-full flex flex-col justify-center items-center gap-4'>
            <div className='flex flex-col justify-center items-center gap-4'>
                <h4 className='text-2xl my-4 font-bold'>Upload Files</h4>
            </div>
            <div className='flex justify-center items-center'>
                <form onSubmit={uploadFile}>
                    <label htmlFor="file">File</label>
                    <input 
                        type="file" 
                        id="file" 
                        onChange={(event) => setSelectedFile(event.target.files[0])}
                    />
                    <button type="submit" className='w-28 h-12 text-center p-2 bg-red-600 text-black border-2 rounded-lg'>
                        Upload File
                    </button>
                </form>
            </div>
            <div className='flex flex-col justify-center items-center gap-y-4'>
                {files.map((data) => (
                    <div className='flex justify-center items-center gap-x-4' key={data._id}>
                        <li>{data.filename}</li>
                        <DownloadBtn id= {data._id} />
                        <DeleteBtn id= {data._id} refreshFiles={getAllFiles} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UploadFiles;
