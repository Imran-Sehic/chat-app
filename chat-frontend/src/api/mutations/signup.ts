import axios from "axios";

export const signupMutation = (username: string) =>
  axios.post("http://localhost:3000/signup", {
    username,
  });
