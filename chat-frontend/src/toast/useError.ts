import toast from "react-hot-toast";

export const useError = (message: string) => {
  return toast.error(message, {
    duration: 4000,
    style: {
      background: "#333",
      color: "#fff",
    },
  });
};
