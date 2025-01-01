import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import supabase from "../Config/supabaseClient";

const AuthContext = createContext({ user: null });
export const useAuth = () => {
  return useContext(AuthContext);
};
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session.user);
      setLoading(false);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  },[]);

  return <AuthContext.Provider value={{user}}  >
    {!loading ? children : `<div> Loading... <div/>`}
  </AuthContext.Provider>
};

export default AuthProvider;
