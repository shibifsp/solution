
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import Calculation from './pages/Calculation';
import MemberInfo from './pages/MemberInfo';
import LogIn from './pages/LogIn';



function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Index />} />  
        <Route path='/memberInfo/:id' element={<MemberInfo />} />
        <Route path='/calculation/:id' element={<Calculation />} />
        <Route path='/logIn' element={<LogIn />} /> 
      </Routes>
    </Router>
  );
}

export default App;
