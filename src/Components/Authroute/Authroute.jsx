import { useContext } from "react";
import { AuthContext } from "../../Context/Auth.context";
import { Navigate } from "react-router";


export default function Authroute({children}) {
    const {token}=useContext(AuthContext)

    if(token){
        return <Navigate to='/'></Navigate>
    } else{
        return children
    }
}