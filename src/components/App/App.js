import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../Home/Home";
import Register from "../Register/Register";
import Login from "../Login/Login";
import Navbar from "../Navbar/Navbar";
import IndividualRecipe from "../IndividualRecipe/IndividualRecipe";
import Profile from "../Profile/Profile";
import EditProfile from "../EditProfile/EditProfile";
import SearchPage from "../SearchPage/SearchPage";
import SavedGallery from "../SavedGallery/SavedGallery";
import apiClient from "../../services/apiClient";
import PublicProfile from "../PublicProfile/PublicProfile";
import Generator from "../Generator/Generator";
import SearchFilter from "../SearchFilter/SearchFilter";
import FilterResults from "../SearchFilter/FilterResults/FilterResults";
import ProfileResults from "../ProfileResults/ProfileResults";
// import Community from "../Community/Community";
// import CommunityEdit from "../CommunityEdit/CommunityEdit";
import AboutUs from "../About/About";
import ContactUs from "../Contact/Contact";
import Footer from "../Footer/Footer";

import { useDataLayerValue } from "../../context/DataLayer";

import "./App.css";
function App() {
  const [user, setUser] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [profile, setProfile] = useState({});
  const [allProfiles, setAllProfiles] = useState([]);
  const [saved, setSaved] = useState([]);
  const [changeSave, setChangeSave] = useState(false);

  const [{ colors }, dispatch] = useDataLayerValue();

  // console.log("On App.js component, colors is: ", colors);

  // Remain logged in
  useEffect(() => {
    const token = localStorage.getItem("recipath_token");
    const fetchUser = async () => {
      const { data, error } = await apiClient.getUser();
      if (data) {
        setUser(data.user);
      }

      if (error) {
        console.log(`${error} ----------- App.js`);
      }
    };

    const tokenValid = async () => {
      if (token) {
        apiClient.setToken(token);
        await fetchUser();
      }
    };
    tokenValid();
  }, []);

  //  Fetch homepage recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await apiClient.fetchAllRecipes();

      if (data) {
        setRecipes(data.recipes);
      }

      if (error) {
        alert(error.message);
      }
    };
    fetchRecipes();
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await apiClient.fetchProfile();
      if (data) {
        setProfile(data);
      }
      if (error) {
        console.log(error, "Profile.js");
      }
    };

    if (user.email) {
      fetchProfile();
    }
  }, [user]);


  // Fetch all users & profiles
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await apiClient.fetchAllProfiles();
      if (data) {
        setAllProfiles(data);
      }
      if (error) {
        console.log(error, "ProfileResults.js");
      }
    };

    if (user.email) {
      fetchProfile();
    }
  }, [user]);

  // Fetch saved recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await apiClient.fetchSavedRecipes();
      if (data) {
        setSaved(data.savedRecipes);
      }

      if (error) {
        console.log(error, "fetch saved recipes");
      }
    };

    if (user.email) {
      fetchRecipes();
    }
  }, [user, changeSave]);

  // Handle save recipe
  const handleSave = async (r) => {
    const { data, error } = await apiClient.saveRecipe(r);

    if (data) {
      setChangeSave(!changeSave);
      console.log("Save: ", data);
    }

    if (error) {
      alert(error);
    }
  };

  // Handle unsave recipe
  const handleUnsave = async (r) => {
    const { data, error } = await apiClient.unsaveRecipe(r);

    if (data) {
      setChangeSave(!changeSave);
      console.log("Unsave: ", data);
    }

    if (error) {
      alert(error);
    }
  };

  const handleUpdateUser = async (user) => {
    setUser(user);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar
          user={user}
          setUser={setUser}
          setSearchTerm={setSearchTerm}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                user={user}
                recipes={recipes}
                handleSave={handleSave}
                handleUnsave={handleUnsave}
              />
            }
          />
          <Route
            path="/register"
            element={<Register user={user} setUser={setUser} />}
          />
          <Route
            path="/login"
            element={<Login user={user} setUser={setUser} />}
          />
          <Route
            path="/recipes/:recipeId"
            element={<IndividualRecipe user={user} />}
          />

          <Route 
            path="/wheel" 
            element={<Generator user={user}/>}
          />

          <Route
            path="/profile"
            element={
              <Profile 
                user={user} 
              />
            }
          />

          <Route
            path="/profile/:username"
            element={
              <Profile 
                user={user}
              />
            }
          />

          <Route
            path="/profile/edit"
            element={
              <EditProfile
                user={user}
                handleUpdateUser={handleUpdateUser}
                profile={profile}
              />
            }
          />

          <Route 
            path="/profileResults"
            element={
              <ProfileResults
                user={user}
                profile={profile}
                allProfiles={allProfiles}
              />
            }
          />

          <Route
            path="/publicProfile/:user_id_here"
            element={<PublicProfile />}
          />

          <Route
            path="/saved"
            element={
              <SavedGallery
                user={user}
                saved={saved}
                handleSave={handleSave}
                handleUnsave={handleUnsave}
              />
            }
          />

          <Route
            path="/search"
            element={
              <SearchFilter
                user={user}
              />
            }
          />

          <Route
            path="/search/:categoryType"
            element={
              <FilterResults
                user={user}
                recipes={recipes}
                handleSave={handleSave}
                handleUnsave={handleUnsave}
              />
            }
          />

          <Route
            path="/searchResults"
            element={
              <SearchPage
                searchTerm={searchTerm}
                recipes={recipes}
                user={user}
                handleSave={handleSave}
                handleUnsave={handleUnsave}
              />
            }
          />

          {/*     <Route
            path="/community"
            element={
              <Community
                user={user}
                style={style}
                flavorOptions={flavorOptions}
              />
            }
          />

          <Route
            path="/community/edit/:postId"
            element={
              <CommunityEdit
                user={user}
                style={style}
                flavorOptions={flavorOptions}
              />
            }
          />*/}

          <Route path="/about" element={<AboutUs />} />

          <Route path="/contact" element={<ContactUs />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
