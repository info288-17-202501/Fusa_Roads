import { useNavigate } from "react-router-dom";
import { useUser } from "./useUser";

const useLogout = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();


    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null)
        navigate("/")
    }
    
    return logout;
}

export default useLogout;