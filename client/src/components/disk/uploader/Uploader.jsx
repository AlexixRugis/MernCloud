import React from 'react'
import UploadFile from './UploadFile';
import './uploader.css'
import { useSelector, useDispatch } from 'react-redux';
import { hideUploader } from '../../../reducers/uploadReducer';

const Uploader = () => {
    const dispatch = useDispatch();
    const files = useSelector(state => state.upload.files);
    const isVisible = useSelector(state => state.upload.isVisible);

    function closeUploader() {
        dispatch(hideUploader());
    }

  return ( isVisible &&
    <div className="uploader">
        <div className="uploader__header">
            <div className="uploader__title">Загрузки</div>
            <button className="uploader__close" onClick={closeUploader}>X</button>
        </div>
        {files.map(file => <UploadFile file={file} key={file.id}/>)}
    </div>
  )
}

export default Uploader