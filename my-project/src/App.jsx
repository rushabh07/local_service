import { Routes, Route } from "react-router-dom";
import Homepage from "./Homepage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import './App.css'

function App() {

  return (

    <Routes>

      <Route path="/" element={<Homepage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* <Route path="/" Component={Home} />
      <Route path="/register" Component={Register} />
      <Route path="/login"Component={Login} /> */}

    </Routes>

  )

}

export default App;