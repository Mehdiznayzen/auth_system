import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage, ProfilePage, RegisterPage} from "./pages"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={"/login"} replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  )
}

export default App