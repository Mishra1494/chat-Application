import {createContext , useContext,useState} from 'react';
const AuthContext = createContext(null);
export const  AuthProvider = ({children}) =>{
    const [User,setUser] = useState(null);
    return (
        <AuthContext.Provider value={{User,setUser}}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = ()=>useContext(AuthContext);