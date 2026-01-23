import { createContext, useState } from "react";

export const AuthContext=createContext(null)

export default function AuthProvider({children}){

    function logOut(){
        setToken(null)
        localStorage.removeItem('token')
    }

    const [token,setToken]=useState(localStorage.getItem('token') || null   )

    return <AuthContext.Provider value={{token,setToken , logOut}}>
     {children}
    </AuthContext.Provider>
}