import { Routes, Route } from "react-router-dom";
import UploadPage from "./UploadPage";
import ViewPage from "./ViewPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/view/:id" element={<ViewPage />} />
    </Routes>
  );
}

export default App;
