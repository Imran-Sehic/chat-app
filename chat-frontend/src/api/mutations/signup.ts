import axios from "axios";
import { signupUrl } from "../../constants/urls";

export const signupMutation = (username: string) =>
  axios.post(signupUrl, {
    username,
  });
