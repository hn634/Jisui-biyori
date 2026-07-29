import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import PostForm from "./pages/PostForm";
import PostDetail from "./pages/PostDetail";
import Album from "./pages/Album";
import FavoriteRecipes from "./pages/FavoriteRecipes";
import Ingredients from "./pages/Ingredients";
import Community from "./pages/Community";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post"
          element={
            <ProtectedRoute>
              <PostForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/:postId/edit"
          element={
            <ProtectedRoute>
              <PostForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail/:postId"
          element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/album"
          element={
            <ProtectedRoute>
              <Album />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoriteRecipes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ingredients"
          element={
            <ProtectedRoute>
              <Ingredients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
