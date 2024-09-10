import React from 'react';
import axios from 'axios';

const DownloadBtn = ({ id }: string) => {
    console.log(id)

    const downloadTheFile = async () => {
        try {
            const res = await axios.get(`/api/video/${id}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.mp4'); 
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.log("Error downloading file:", error);
        }
    };

    return (
        <div>
            <button onClick={downloadTheFile} className='w-24 h-12 bg-green-500 text-center text-black rounded-lg'>
                Download
            </button>
        </div>
    );
};

export default DownloadBtn;
