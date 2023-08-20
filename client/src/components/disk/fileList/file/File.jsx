import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentDir, pushToStack } from "../../../../reducers/fileReducer";
import { downloadFile, deleteFile } from "../../../../actions/file";
import "./file.css";
import sizeFormat from "../../../../utils/sizeFormat";
import DirImg from "../../../../assets/img/directory.svg";
import FileImg from "../../../../assets/img/file.svg";
import { formatDate } from "../../../../utils/dateFormat";

const File = ({ file }) => {
  const dispatch = useDispatch();
  const currentDir = useSelector((state) => state.file.currentDir);
  const view = useSelector((state) => state.file.view);

  function openDirHandler() {
    if (file.type === "dir") {
      dispatch(pushToStack(currentDir));
      dispatch(setCurrentDir(file));
    }
  }

  function downloadHandler(event) {
    event.stopPropagation();
    downloadFile(file);
  }

  function deleteClickHandler(event) {
    event.stopPropagation();
    dispatch(deleteFile(file));
  }

  if (view === "list") {
    return (
      <div className="file" onClick={() => openDirHandler()}>
        <img
          src={file.type === "dir" ? DirImg : FileImg}
          alt=""
          className="file__img"
        />
        <div className="file__name">{file.name}</div>
        <div className="file__date">{formatDate(file.date)}</div>
        <div className="file__size">{file.type !== 'dir' ? sizeFormat(file.size) : "-"}</div>
        {file.type !== "dir" && (
          <button
            onClick={(event) => downloadHandler(event)}
            className="file__btn file__download"
          >
            Скачать
          </button>
        )}
        <button
          onClick={(event) => deleteClickHandler(event)}
          className="file__btn file__delete"
        >
          Удалить
        </button>
      </div>
    );
  } else if (view === "plate") {
    return (
      <div className="file-plate" onClick={() => openDirHandler()}>
        <img
          src={file.type === "dir" ? DirImg : FileImg}
          alt=""
          className="file-plate__img"
        />
        <div className="file-plate__name">{file.name}</div>
        <div className="file-plate__btns">
          {file.type !== "dir" && (
            <button
              onClick={(event) => downloadHandler(event)}
              className="file-plate__btn file-plate__download"
            >
              Скачать
            </button>
          )}
          <button
            onClick={(event) => deleteClickHandler(event)}
            className="file-plate__btn file-plate__delete"
          >
            Удалить
          </button>
        </div>
      </div>
    );
  }
};

export default File;
