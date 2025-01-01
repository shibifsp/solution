import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Index from "./pages/Index";
import Calculation from "./pages/Calculation";
import MemberInfo from "./pages/MemberInfo";
import LogIn from "./pages/LogIn";
import supabase from "./Config/supabaseClient";
import { useState, useEffect } from "react";

function App() {

  // const [session, setSession] = useState(null);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session);
  //   });

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session);
  //   });

  //   return () => subscription.unsubscribe();
  // }, []);
  // if (!session) {
  //   return navigate('/logIn');
  // }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/memberInfo/:id" element={<MemberInfo />} />
        <Route path="/calculation/:id" element={<Calculation />} />
        <Route path="/logIn" element={<LogIn />} />
      </Routes>
    </Router>
  );
}

export default App;
