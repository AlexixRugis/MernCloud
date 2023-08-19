import React, { useState } from 'react';
import Input from '../../utils/input/input';
import { useDispatch, useSelector } from 'react-redux';
import { createDir } from '../../actions/file';

const Popup = ({visible, setVisible}) => {
    const dispatch = useDispatch();
    const currentDir = useSelector(state => state.file.currentDir);
    const [dirName, setDirName] = useState('');

    function close() {
        setVisible(false);
    }

    function validateDirName() {
        const rg=/^(?!\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!prn$)[^\|\*\?\\:<>/$"]*[^\.\|\*\?\\:<>/$"]+$/;
        return rg.test(dirName);
    }

    function createDirHandler() {
        if (validateDirName()) {
            dispatch(createDir(currentDir, dirName));
            setDirName("");
            close();
        }
    }

  return (
    <div className="popup" style={{display: visible ? 'flex' : 'none'}} onClick={close}>
        <div className="popup__content" onClick={(event => event.stopPropagation())}>
            <div className="popup__header">
                <div className="popup__title">Создать новую папку</div>
                <div className="popup__close" onClick={close}>X</div>
            </div>
            <Input value={dirName} setValue={setDirName} type="text" placeholder="Название"/>
            <button className="popup__create" onClick={createDirHandler} disabled={!validateDirName()}>Создать</button>
        </div>
    </div>
  )
}

export default Popup