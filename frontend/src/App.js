import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Videollamada from "./pages/Videollamada";
import "./style.scss";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {

  const {currentUser} = useContext(AuthContext)

  const ProtectedRoute =({children}) => {
    if (!currentUser){
      return <Navigate to="/login"/>
    }
    return children;
  };
  
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/">
            <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="videollamada" element={<Videollamada />} />
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// //<Register/>
//     //<Login/>
//     //<Home/>

    
//     <Routes>
//       <Route path="/" element={<Login />} />
//       <Route path="/home" element={<Home />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//     </Routes>