import axios from "axios";
import { setFiles, addFile, removeFile } from "../reducers/fileReducer";
import {
  addUploadFile,
  hideUploader,
  removeUploadFile,
  showUploader,
  updateUploadFile,
} from "../reducers/uploadReducer";
import { showLoader, hideLoader } from "../reducers/appReducer";

export function getFiles(dirId, sort) {
  return async (dispatch) => {
    try {
      dispatch(showLoader());
      let url = "api/files";
      if (sort && dirId) url += `?parent=${dirId}&sort=${sort}`;
      else if (dirId) url += "?parent=" + dirId;
      else if (sort) url += "?sort=" + sort;
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch(setFiles(response.data));
    } catch (e) {
      alert(e.response.data.message);
    } finally {
      dispatch(hideLoader());
    }
  };
}

export function createDir(parentDirId, name) {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        "api/files/",
        {
          name,
          parent: parentDirId,
          type: "dir",
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(addFile(response.data));
      console.log(response.data);
    } catch (e) {
      alert(e.response.data.message);
    }
  };
}

export function uploadFile(parentDirId, file) {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (parentDirId) {
        formData.append("parent", parentDirId);
      }
      const uploadFile = { name: file.name, progress: 0, id: Date.now() };
      dispatch(showUploader());
      dispatch(addUploadFile(uploadFile));
      const response = await axios.post(
        "api/files/upload",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          onUploadProgress: (progressEvent) => {
            const totalLength = progressEvent.total;
            console.log("total", totalLength);
            const progress = Math.round(
              (progressEvent.loaded * 100) / totalLength
            );
            uploadFile.progress = progress;
            dispatch(updateUploadFile(uploadFile));
            if (progress === 100) {
              dispatch(removeUploadFile(uploadFile.id));
              dispatch(hideUploader());
            }
            console.log(progress);
          },
        }
      );
      dispatch(addFile(response.data));
    } catch (e) {
      alert(e.response.data.message);
    }
  };
}

export async function downloadFile(file) {
  try {
    const response = await fetch(
      `api/files/download?id=${file._id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    if (response.status === 200) {
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  } catch (e) {
    alert(e);
  }
}

export function deleteFile(file) {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `api/files/?id=${file._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(removeFile(file._id));
    } catch (e) {
      alert(e.response.data.message);
    }
  };
}

export function searchFile(search) {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `api/files/search?search=${search}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(setFiles(response.data));
    } catch (e) {
      alert(e.response.data.message);
    }
  };
}
