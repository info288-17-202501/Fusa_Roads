import { JSX, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { authFetch, isExpired, refreshAccessToken } from "../Login/helpers/tokenHelper";
import { Spinner } from "react-bootstrap";

type Props = {
  children: JSX.Element;
};

const PrivateRoute = ({ children }: Props) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const validate = async () => {
      let token = localStorage.getItem("access_token");

      // Si esta vencido, intenta refrescar
      if (!token || isExpired(token)) token = await refreshAccessToken();

      if (!token) {
        setIsAuth(false);
        return;
      }
      
      // Intenta acceder con el token válido
      try {
        const res = await authFetch("http://localhost:8000/users/profile");
        
        if (!res.ok) throw new Error();
        setIsAuth(true);
      } catch{
        setIsAuth(false)
      }
    };

    validate();
  }, []);

  if (isAuth === null) return <Spinner animation="border" size="sm" variant='light' />;

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
