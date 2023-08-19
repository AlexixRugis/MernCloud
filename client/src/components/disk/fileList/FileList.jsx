import React from "react";
import "./fileList.css";
import { useSelector } from "react-redux";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import File from "./file/File";

const FileList = () => {
  const files = useSelector((state) => state.file.files);
  const loader = useSelector((state) => state.app.loader);
  const view = useSelector((state) => state.file.view);

  return (
    <div className="filelist">
      {view === "list" ? (
        <>
          <div className="filelist__header">
            <div className="filelist__name">Имя</div>
            <div className="filelist__date">Дата</div>
            <div className="filelist__size">Размер</div>
          </div>
          {!loader && (
            <TransitionGroup>
              {files.map((file) => (
                <CSSTransition
                  key={file._id}
                  timeout={500}
                  classNames={"file"}
                  exit={false}
                >
                  <File file={file} />
                </CSSTransition>
              ))}
            </TransitionGroup>
          )}
        </>
      ) : (
        <div className="fileplate">
          {files.map((file) => (
              <File file={file} key={file._id}/>
          ))}
        </div>
      )}
      {loader && (
        <div className="loader">
          <div class="lds-facebook">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      {files.length === 0 && !loader && (
        <div className="filelist__nofiles">Нет файлов</div>
      )}
    </div>
  );
};

export default FileList;
