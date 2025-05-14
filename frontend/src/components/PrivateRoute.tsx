import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isExpired, refreshAccessToken } from "../Login/helpers/tokenHelper"

type Props = {
    children: JSX.Element
}

const PrivateRoute = ({children} : Props) => {
    const [isAuth, setIsAuth] = useState<boolean | null>(null); 
    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem("access_token");

            if (!token || isExpired(token)){
                const newToken = await refreshAccessToken();
                if(!newToken){
                    setIsAuth(false);
                    return;
                }
            }

            setIsAuth(true)
        }

        validateToken();
    }, []);

    if (isAuth === null) return <p>Cargando...</p>

    return isAuth ? children : <Navigate to="/login" replace/>
}

export default PrivateRoute