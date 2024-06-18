import {
  ArrowCircleRightIcon,
  ChatIcon,
  DocumentDuplicateIcon,
  PlusCircleIcon,
} from "@heroicons/react/outline";
import {
  ChangeEvent,
  DragEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import io from "socket.io-client";
import { uploadFileMutation } from "../api/mutations/upload";
import { getMessagesQuery } from "../api/queries/messages";
import { backendUrl } from "../constants/urls";
import { AuthContext } from "../context-providers/AuthContext";
import { Message } from "../types/Message";

const socket = io(`${process.env.REACT_APP_BACKEND_URL}`);

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLUListElement>(null);
  const { username, logout } = useContext(AuthContext);

  useEffect(() => {
    getMessagesQuery().then((response) => setMessages(response.data.messages));

    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("initial");
      socket.off("chat message");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll to bottom whenever messages change

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

  const sendMessage = async () => {
    if (input.trim()) {
      const msg = { text: input, fileUrl: "", username };
      socket.emit("chat message", msg);
      setInput("");
    }
  };

  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement> | { target: { files: File[] } }
  ) => {
    const files = "files" in e.target ? Array.from(e.target.files || []) : [];

    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await uploadFileMutation(formData);
      const fileUrls = response.data.fileUrls;

      fileUrls.forEach((fileUrl: string) => {
        const msg = { text: "", fileUrl, username };
        socket.emit("chat message", msg);
      });
    } catch (error) {
      toast.error("Error uploading files!", {
        duration: 4000,
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const fileList = e.dataTransfer.files;

    if (fileList.length > 0) {
      handleFileUpload({ target: { files: Array.from(fileList) } });
    }
  };

  return (
    <div className="flex flex-col h-[100vh]">
      <div className="relative flex justify-center bg-slate-200 p-5">
        <span className="font-extrabold text-4xl text-cyan-500">Chatt!</span>
        <button
          onClick={logout}
          className="absolute right-5 top-[50%] translate-y-[-50%] flex gap-2 items-center text-gray-400 font-bold"
        >
          Logout <ArrowCircleRightIcon className="w-4" />
        </button>
      </div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex flex-col mx-5 md:mx-[20%] xl:mx-[30%] my-5 rounded grow overflow-y-scroll no-scrollbar p-5 bg-slate-100"
      >
        <ul
          ref={messagesEndRef}
          className="flex flex-col grow overflow-y-scroll no-scrollbar"
        >
          {messages.map((msg, index) => {
            const date = new Date(msg.createdAt || "");
            const prevDate = new Date(messages[index - 1]?.createdAt || "");

            const day = String(date.getDate()).padStart(2, "0");
            const prevDay = String(prevDate.getDate()).padStart(2, "0");

            const month = String(date.getMonth() + 1).padStart(2, "0");
            const prevMonth = String(prevDate.getMonth() + 1).padStart(2, "0");

            const year = date.getFullYear();
            const prevYear = prevDate.getFullYear();

            const formattedDate = `${day} / ${month} / ${year}`;

            const showDate =
              day != prevDay || month != prevMonth || year != prevYear;

            return (
              <li
                key={index}
                className={`flex flex-col ${
                  msg.username == username ? "items-end" : ""
                }`}
              >
                {showDate && (
                  <p className="text-center w-full my-1 text-xs text-slate-400">
                    {formattedDate}
                  </p>
                )}
                {(messages[index - 1]?.username != msg.username ||
                  showDate) && (
                  <strong className="text-gray-500">{msg.username}</strong>
                )}
                {msg.text && (
                  <p className="rounded-xl px-2 py-1 my-0.5 bg-cyan-400 w-fit text-white">
                    {msg.text}
                  </p>
                )}
                {msg.fileUrl && (
                  <p className="my-1">
                    <a
                      href={`${backendUrl}${msg.fileUrl}`}
                      target="_blank"
                      className="rounded-xl flex px-2 py-1 bg-white border w-fit text-cyan-500"
                      rel="noopener noreferrer"
                    >
                      <DocumentDuplicateIcon className="w-5" />
                    </a>
                  </p>
                )}
              </li>
            );
          })}
        </ul>
        {messages.length == 0 && (
          <p className="flex flex-col justify-center items-center h-full text-gray-400 text-xl">
            <ChatIcon className="w-6" />
            <span> No messages to display</span>
            <span className="text-sm"> Be the first to type</span>
          </p>
        )}

        <div className="flex mt-2">
          <div className="w-full flex relative">
            <input
              type="text"
              className="w-full p-2 rounded focus:outline-none focus:border-b focus:border-b-cyan-500 transition"
              placeholder="Enter message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => (e.key === "Enter" ? sendMessage() : null)}
            />
            <div className="absolute right-2 top-[50%] translate-y-[-40%]">
              <button onClick={() => fileInputRef.current?.click()}>
                <PlusCircleIcon className="w-5 text-cyan-500" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                multiple
              />
            </div>
          </div>
          <button
            disabled={input.trim().length == 0}
            className={`bg-cyan-400 px-3 rounded-e text-white ${
              input.trim().length == 0 ? "opacity-50" : ""
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
