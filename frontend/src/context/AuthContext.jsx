import {createContext , useContext,useEffect,useState} from 'react';
import API from "../api/axious";
const AuthContext = createContext(null);
export const  AuthProvider = ({children}) =>{
    const [user,setUser] = useState(null);
      useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/user/me", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);
    return (
        <AuthContext.Provider value={{user,setUser}}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = ()=>useContext(AuthContext);