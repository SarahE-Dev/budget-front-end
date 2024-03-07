import { useContext } from "react";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";

import { AuthContext } from "../../context/AuthContext";


function checkAuthCookie(){
    const {dispatch} = useContext(AuthContext);
    function checkIfCookieExists(){
        const cookie = Cookie.get('jwt-cookie');
        return cookie ? true : false
    }
    function logUserIn(){
        if(checkIfCookieExists()){
            const jwtDecoded = jwtDecode(Cookie.get('jwt-cookie'));
            dispatch({
                type: 'LOGIN',
                user: {
                        username: jwtDecoded.username,
                        email: jwtDecoded.email,
                        id: jwtDecoded.id
                }
                
            })
        }
    }
    return {checkIfCookieExists, logUserIn}
    
}

export default checkAuthCookie