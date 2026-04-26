import { Toaster } from "sonner";
import {Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import GameDeatailPage from "./pages/GameDetailPage";
import UploadGamePage from "./pages/UploadGamePage";


function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />
      <Route
        path="/games"
        element={<GamePage />}
      />
      <Route path="/games/:id" element={<GameDeatailPage/>} />

      <Route
        path="/posts"
        element={<PostPage />}
      />
      <Route
        path="/uploadgame"
        element={<UploadGamePage />}
      />
      <Route
        path="/profile"
        element={<ProfilePage />}
      />
      <Route
        path="/dashboard"
        element={<DashboardPage />}
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
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default App;
