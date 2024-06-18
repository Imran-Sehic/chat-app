import axios from "axios";
import { uploadFileUrl } from "../../constants/urls";

export const uploadFileMutation = (formData: FormData) =>
  axios.post(uploadFileUrl, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
