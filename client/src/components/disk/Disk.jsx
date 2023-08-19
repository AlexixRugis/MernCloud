import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentDir, setView } from '../../reducers/fileReducer';
import { getFiles, uploadFile } from "../../actions/file";
import FileList from "./fileList/FileList";
import Popup from "./Popup";
import Uploader from "./uploader/Uploader";
import "./disk.css";

const Disk = () => {
  const dispatch = useDispatch();
  const currentDir = useSelector((state) => state.file.currentDir);
  const dirStack = useSelector((state) => state.file.dirStack);
  const [dragEnter, setDragEnter] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [sort, setSort] = useState('type');

  useEffect(() => {
    dispatch(getFiles(currentDir?._id, sort));
  }, [currentDir, sort]);

  function createDirHandler() {
    setPopupVisible(true);
  }

  function backClickHandler() {
    const backDir = dirStack.pop();
    dispatch(setCurrentDir(backDir));
  }

  function fileUploadHandler(event) {
    const files = [...event.target.files];
    files.forEach(file => dispatch(uploadFile(currentDir?._id, file)));
  }

  function dragEnterHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragEnter(true);
  }

  function dragLeaveHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragEnter(false);
  }

  function dropHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    const files = [...event.dataTransfer.files];
    files.forEach(file => dispatch(uploadFile(currentDir?._id, file)));
    setDragEnter(false);
  }

  return ( !dragEnter ?
    <div className="disk" onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
      <div className="disk__container">
        <div className="disk__btns">
          <button className="disk__back" onClick={() => backClickHandler()}>Назад</button>
          <button className="disk__create" onClick={() => createDirHandler()}>Создать папку</button>
          <div className="disk__upload">
            <label htmlFor="disk__upload-input" className="disk__upload-label">Загрузить файл</label>
            <input multiple={true} onChange={(event) => fileUploadHandler(event)} type="file" id="disk__upload-input" className="disk__upload-input"/>
          </div>
          <div className="disk__fill"/>
          <button className="disk__plate" onClick={() => dispatch(setView('plate'))}/>
          <button className="disk__list" onClick={() => dispatch(setView('list'))}/>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="disk__sort-select">
            <option value="name">По имени</option>
            <option value="type">По типу</option>
            <option value="date">По дате</option>
            <option value="size">По размеру</option>
          </select>
        </div>
        <div className="disk__path">{currentDir?.path ? `/${currentDir.path.replace('\\', '/')}` : "/"}</div>
        <FileList />
        <Popup visible={popupVisible} setVisible={setPopupVisible}/>
        <Uploader/>
      </div>
    </div>
    :
    <div className="drop-area" onDrop={dropHandler} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>Перетащите сюда файлы</div>
  );
};

export default Disk;
