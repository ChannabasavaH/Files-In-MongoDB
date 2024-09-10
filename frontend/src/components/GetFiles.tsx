import React, { useEffect, useState } from 'react'
import axios from 'axios';

const useGetFiles = () => {

    const [allFiles, setAllFiles] = useState([]);

    const getAllFiles = async () => {
        try {
           const res = await axios.get('/api/video')
           console.log(res.data.videos)
           setAllFiles(res.data.videos)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllFiles()
    },[])
    
  return [allFiles, getAllFiles] 

}

export default useGetFiles