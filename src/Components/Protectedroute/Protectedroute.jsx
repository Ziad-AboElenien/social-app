import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../../Context/Auth.context";


export default function Protectedroute({children}){
    const {token}=useContext(AuthContext)

    if(token){
        return children
    } else{
        return <Navigate to='/login'></Navigate>
    }
}