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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/post" element={<PostForm />} />
        <Route path="/post/:postId/edit" element={<PostForm />} />
        <Route path="/detail/:postId" element={<PostDetail />} />
        <Route path="/album" element={<Album />} />
        <Route path="/favorites" element={<FavoriteRecipes />} />
        <Route path="/ingredients" element={<Ingredients />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
