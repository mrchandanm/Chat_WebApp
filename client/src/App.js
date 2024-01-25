
import './App.css';
import { Route, Routes } from 'react-router-dom';
import RegistrationAndLoginPage from './Pages/RegistrationAndLoginPage';
import HomePage from './Pages/HomePage';
function App() {
  return (
    <>
      <Routes>
      <Route path="/" element={<RegistrationAndLoginPage/>}/>
      <Route path="/chat" element={<HomePage/>}/>
    </Routes>
    </>
  );
}

export default App;
