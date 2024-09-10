import React from 'react'
import axios from 'axios'

const DeleteBtn = ({ id, refreshFiles }) => {

  const deleteFile = async () => {
    try {
      await axios.delete(`/api/video/${id}`)
      refreshFiles()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <button onClick={deleteFile} className='w-24 h-12 bg-red-500 text-center text-black rounded-lg'>Delete</button>
    </div>
  )
}

export default DeleteBtn