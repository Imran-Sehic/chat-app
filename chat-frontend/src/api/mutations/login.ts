import axios from "axios";
import { loginUrl } from "../../constants/urls";

export const loginMutation = (username: string) =>
  axios.post(loginUrl, { username });
