import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
// import { R } from "node_modules/react-router/dist/development/browser-D-3-U2Jj.mjs";
import GameDeatailPage from "./pages/GameDetailPage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />
      <Route
        path="/signup"
        element={<SignUp />}
      />
      <Route
        path="/signin"
        element={<SignIn />}
      />
      <Route
        path="/games"
        element={<GamePage />}
      />
      <Route path="/games/:id" element={<GameDeatailPage/>} />
      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default App;
