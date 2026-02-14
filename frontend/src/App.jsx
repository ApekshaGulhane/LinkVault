import { Routes, Route } from "react-router-dom";
import UploadPage from "./UploadPage";
import ViewPage from "./ViewPage";

function App() {
  return (
    <Routes>
  <Route path="/" element={<UploadPage />} />
  <Route path="/view/:id" element={<ViewPage />} />
</Routes>

  );
}

export default App;
