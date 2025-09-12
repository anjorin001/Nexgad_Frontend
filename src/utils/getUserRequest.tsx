import { useAppContext } from "../context/AppContext";
import api from "./api";
import { useToast } from "./ToastNotification";

export const getUserRequest = () => {
  const { setUserData, setIsAuthenticated } = useAppContext();

  const toast = useToast();

  const handleGetUser = async () => {
    try {
      const userRes = await api.get("/user");
      localStorage.setItem("user", JSON.stringify(userRes.data.data));
      setUserData(userRes.data.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error(err);
      toast.error("", "An error occurred, try again later");
    }
  };

  return { handleGetUser };
};
