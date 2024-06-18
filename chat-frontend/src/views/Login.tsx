import { FormEvent, useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { loginMutation } from "../api/mutations/login";
import { AuthContext } from "../context-providers/AuthContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await loginMutation(username);
      login && login(username);
      navigate("/chat");
    } catch (err: any) {
      toast.error(err.response.data.message, {
        duration: 4000,
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 justify-center items-center h-[100vh]">
      <h1 className="text-gray-500 text-center text-4xl mb-20 md:mb-10">
        Welcome to the{" "}
        <span className="font-extrabold text-5xl text-cyan-500 block md:inline">
          Chatt!
        </span>
      </h1>
      <h2 className="text-slate-500">Login as an existing user!</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border-b focus:border-b-cyan-500 transition outline-none"
          required
        />
        <button
          type="submit"
          className="text-white bg-cyan-500 hover:bg-cyan-600 transition rounded p-2"
        >
          Login
        </button>
      </form>
      <p className="mt-10 text-slate-500 text-sm">
        Don't have an account?{" "}
        <Link to="/signup" className="text-cyan-500">
          Signup
        </Link>
      </p>
    </div>
  );
};

export default Login;
