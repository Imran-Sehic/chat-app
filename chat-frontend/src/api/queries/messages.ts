import axios from "axios";
import { messagesUrl } from "../../constants/urls";

export const getMessagesQuery = () => axios.get(messagesUrl);
