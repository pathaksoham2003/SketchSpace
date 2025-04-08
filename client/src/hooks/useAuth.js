import Keycloak from "keycloak-js";
import { useEffect, useRef, useState } from "react";
export const client = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
});
const useAuth = () => {
    const isRun = useRef(false);
    const [isLogin, setIsLogin] = useState(false);
    useEffect(() => {
        if (isRun.current)
            return;
        isRun.current = true;
        client.init({ onLoad: "login-required" }).then((res) => setIsLogin(res));
        setIsLogin(true);
    }, []);
    return isLogin;
};
export default useAuth;
