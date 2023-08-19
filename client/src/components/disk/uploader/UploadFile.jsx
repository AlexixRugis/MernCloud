import React from 'react'
import { useDispatch } from 'react-redux';
import { removeUploadFile } from '../../../reducers/uploadReducer';
import './uploader.css';

const UploadFile = ({ file }) => {

    const dispatch = useDispatch();

    function removeUpload() {
        dispatch(removeUploadFile(file.id));
    }

  return (
    <div className="upload-file">
        <div className="upload-file__header">
            <div className="upload-file__name">{file.name}</div>
            {/*<button className="upload-file__remove" onClick={removeUpload}>X</button>*/}
        </div>
        <div className="upload-file__progress-bar">
            <div className="upload-file__upload-bar" style={{width: `${file.progress}%`}}/>
        </div>
    </div>
  )
}

export default UploadFile