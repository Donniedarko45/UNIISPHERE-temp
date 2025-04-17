import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfileEditSection.css";
import { FiEdit } from "react-icons/fi";
import image from "./Person.png"; // Fallback image
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import DesktopRight from "../DesktopRight/DesktopRight";
import DesktopLeftbottom from "../DesktopLeftbottom/DesktopLeftbottom.jsx";
import DesktopLeftTop from "../DesktopLeftTop/DesktopLeftTop.jsx";
import Background from "../Background/Background.jsx";
import DesktopNavbarr from "../DesktopNavbarr/DesktopNavbarr.jsx";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import MobileFooter from "../Mobilefooter/MobileFooter";

function ProfileEditSection() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePic, setProfilePic] = useState(image); // Default to fallback image
  const [collabs, setCollabs] = useState(10);
  const [connections, setConnections] = useState(50);
  const [name, setName] = useState("John Doe");
  const [title, setTitle] = useState("Building Uniisphere|Masters Union");
  const [address, setAddress] = useState("New York, USA");
  const [buttons, setButtons] = useState(["Message", "Connect"]);
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [education, setEducation] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [fullAboutText, setFullAboutText] = useState(
    "Passionate developer with experience in web and mobile development."
  );
  const [profilePicture, setProfilePicture] = useState(null);

  const hasAlerted = useRef(false);
  const hasFetched = useRef(false);
  const skillsRef = useRef(null);
  const interestsRef = useRef(null);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (hasFetched.current) {
        console.log("Data already fetched, skipping...");
        return;
      }
      hasFetched.current = true;

      console.log("Fetching user data...");
      try {
        const storedUserId = localStorage.getItem("userId");
        const authToken = localStorage.getItem("authToken");
        
        if (!storedUserId || !authToken) {
          throw new Error("User ID not found in localStorage.");
        }
        
        setUserId(storedUserId);
        console.log("Profile Edit Section The stored user ID is:", storedUserId);

        const response = await axios.get(
          `https://uniisphere-1.onrender.com/users/profile/${storedUserId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        console.log("API Response:", response.data);

        if (response.status === 200) {
          setUserData(response.data);
          logUserDetails(response.data);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        console.error("Error response:", err.response?.data);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  const logUserDetails = (data) => {
    const user = Array.isArray(data) ? data[0] : data;
    console.log("=== User Details ===");
    console.log("User ID:", user.userId || user._id);
    console.log("Username:", user.username);
    console.log("Email:", user.email);
    console.log("First Name:", user.firstName);
    console.log("Last Name:", user.lastName);
    console.log("Phone Number:", user.phoneNumber);
    console.log("Profile Picture URL:", user.profilePictureUrl);
    console.log("Headline:", user.headline);
    console.log("Location:", user.location);
    console.log("Gender:", user.Gender);
    console.log("Skills:", user.Skills || user.skills);
    console.log("Python:", user.python);
    console.log("About:", user.About || user.about);
    console.log("Interests:", user.Interests || user.interests);
    console.log("Work or Project:", user.workorProject);
    console.log("College:", user.college);
    console.log("Degree:", user.degree);
    console.log("Connections Count:", user._count?.connections1);
    console.log("===================");
  };

  // Update state when userData changes
  useEffect(() => {
    if (userData) {
      const user = Array.isArray(userData) ? userData[0] : userData;
      setProfilePic(user.profilePictureUrl || image); // Use profilePictureUrl
      setCollabs(user.collabs || 10);
      setConnections(user._count?.connections1 || 50); // Adjust based on API response
      setName(user.username || "John Doe");
      setTitle(user.headline || "Building Uniisphere|Masters Union");
      setAddress(user.location || "New York, USA");
      setSkills(user.Skills || user.skills || []);
      setInterests(user.Interests || user.interests || []);
      setEducation(user.education || []);
      setFullAboutText(user.About || user.about || "Passionate developer...");
      if (!hasAlerted.current) {
        hasAlerted.current = true;
        alert("Data loaded successfully!");
      }
    }
  }, [userData]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file.name, "Size:", file.size);
      setProfilePicture(file);
      
      try {
        const authToken = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");

        if (!authToken || !userId) {
          throw new Error("User not authenticated. Please log in.");
        }

        console.log("User ID for profile update:", userId);
        
        // Create FormData and append fields with correct case
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("profilePicture", file);

        // Log the exact contents being sent
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        // Ensure token has Bearer prefix
        const tokenWithBearer = authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
        
        console.log("Authorization header:", tokenWithBearer);
        
        const response = await axios.patch(
          "https://uniisphere-1.onrender.com/users/profile",
          formData,
          {
            headers: {
              'Authorization': tokenWithBearer,
              'Accept': 'application/json',
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
            // Log request configuration
            onUploadProgress: (progressEvent) => {
              console.log("Upload progress:", Math.round((progressEvent.loaded * 100) / progressEvent.total));
            }
          }
        );

        console.log("Profile picture update response:", response.data);
        if (response.status === 200) {
          setProfilePic(response.data.user.profilePictureUrl);
          alert("Profile picture updated successfully!");
        }
      } catch (err) {
        console.error("Error updating profile picture:", err);
        if (err.response) {
          console.error("Error response data:", err.response.data);
          console.error("Error response status:", err.response.status);
          console.error("Error response headers:", err.response.headers);
          console.error("Request config:", {
            url: err.config.url,
            method: err.config.method,
            headers: err.config.headers,
            data: err.config.data // Log the actual data being sent
          });
          
          if (err.response.status === 401) {
            console.error("Token used:", err.config.headers['Authorization']);
            // Log the FormData contents for debugging
            const formDataDebug = new FormData(err.config.data);
            for (let [key, value] of formDataDebug.entries()) {
              console.error(`FormData ${key}:`, value);
            }
            alert("Session expired or unauthorized. Please log in again.");
            localStorage.removeItem("authToken");
            localStorage.removeItem("userId");
            navigate("/login");
          } else {
            alert(`Failed to update profile picture: ${err.response.data.message || 'Please try again later.'}`);
          }
        } else if (err.request) {
          console.error("Network error details:", {
            readyState: err.request.readyState,
            status: err.request.status,
            statusText: err.request.statusText
          });
          alert("Connection error. Please check your internet connection and try again.");
        } else {
          alert("An error occurred while updating profile picture. Please try again.");
        }
      }
    }
  };

  // Scroll functions
  const scrollLeft = (ref) => {
    if (ref.current) ref.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = (ref) => {
    if (ref.current) ref.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  // About section toggle
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const maxLength = 100;
  const displayedText = isExpanded
    ? fullAboutText
    : fullAboutText.slice(0, maxLength) +
      (fullAboutText.length > maxLength ? "..." : "");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <DesktopNavbarr />
      <div className="ProfileEditSection-main-container">
        <Background />
        <div className="ProfileEditSectionll-left-main-container">
          <DesktopLeftTop />
          <DesktopLeftbottom />
        </div>
        <div className="ProfileEditSection-middle-main-container">
          <div className="Followers-middle-section-2-mainParent-public">
            <div className="Followers-middle-section-2-middle-container-public">
              <div className="Followers-middle-section-2-middle-section-public">
                <div className="Followers-middle-section-2-top-nav-Icon">
                  <IoArrowBackCircleOutline 
                    className="Followers-middle-section-2-backLogo" 
                    onClick={() => navigate(-1)}
                  />
                </div>

                {/* Profile Details */}
                <div className="Followers-middle-section-2-profile-header-public">
                  <div className="Followers-middle-section-2-imageContainer-public">
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="Followers-middle-section-2-profile-pic-public"
                    />
                    <label className="profile-picture-edit-label">
                      <FiEdit className="edit-icon" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                  <div className="Followers-middle-section-2-collabsDetails-public">
                    <h4>Collabs</h4> <span>{collabs}</span>
                  </div>
                  <div className="Followers-middle-section-2-connectionsDetails-public">
                    <h4>Connections</h4> <span>{connections}</span>
                  </div>
                </div>

                {/* Name and Details */}
                <div className="Followers-middle-section-2-profile-info-public">
                  <div className="Followers-middle-section-2-nameAndEdit-public">
                    <Link to={`/PersonalInfoUpdate/${userId}`}>
                      <FiEdit className="Followers-middle-section-2-icon-public" />
                    </Link>
                    <p>{name}</p>
                  </div>
                  <p>{title}</p>
                  <p>{address}</p>
                </div>

                <div className="Followers-middle-section-2-profile-buttons-public">
                  {buttons.map((btn, index) => (
                    <button
                      key={index}
                      className="Followers-middle-section-2-btn-public"
                    >
                      {btn}
                    </button>
                  ))}
                </div>

                {/* About Section */}
                <div className="Followers-middle-section-2-about-section-public">
                  <h3>About</h3>
                  <p>
                    {displayedText}
                    {fullAboutText.length > maxLength && (
                      <button
                        className="Followers-middle-section-2-about-button-public"
                        onClick={toggleExpand}
                      >
                        {isExpanded ? "See Less" : "See More"}
                      </button>
                    )}
                  </p>
                </div>

                {/* Upload Section */}
                <div className="Followers-middle-section-2-upload-section-public">
                  <div className="Followers-middle-section-2-headingAndEdit-public">
                    <p>Upload</p>
                    <Link to={`/uploadsection/${userId}`}>
                      <FiEdit className="Followers-middle-section-2-icon-public" />
                    </Link>
                  </div>
                  <h6>No Upload yet.</h6>
                </div>

                {/* Experience Section */}
                <div className="Followers-middle-section-2-upload-section-public">
                  <div className="Followers-middle-section-2-headingAndEdit-public">
                    <p>Experience</p>
                    <Link to={`/AboutAndExperiance/${userId}`}>
                      <FiEdit className="Followers-middle-section-2-icon-public" />
                    </Link>
                  </div>
                  <h6>No Experience yet.</h6>
                </div>

                {/* Skills Section */}
                <div className="Followers-middle-section-2-skills-section-public">
                  <div className="Followers-middle-section-2-headingAndIcons-public">
                    <h3>Skills</h3>
                    <Link to={`/Skill/${userId}`}>
                      <FiEdit className="Followers-middle-section-2-icon-public" />
                    </Link>
                  </div>
                  <div className="Followers-middle-section-2-scroll-container">
                    <button
                      className="Followers-middle-section-2-scroll-btn"
                      onClick={() => scrollLeft(skillsRef)}
                    >
                      <IoIosArrowBack />
                    </button>
                    <div
                      className="Followers-middle-section-2-skill-list-public"
                      ref={skillsRef}
                    >
                      {skills.map((val, index) => (
                        <div
                          key={index}
                          className="Followers-middle-section-2-skillsMiniDiv-public"
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                    <button
                      className="Followers-middle-section-2-scroll-btn"
                      onClick={() => scrollRight(skillsRef)}
                    >
                      <IoIosArrowForward />
                    </button>
                  </div>
                </div>

                {/* Collabs Section */}
                <div className="Followers-middle-section-2-upload-section-public">
                  <div className="Followers-middle-section-2-headingAndEdit-public">
                    <p>Collabs</p>
                    <Link to={`/Collab/${userId}`}>
                      <FiEdit className="Followers-middle-section-2-icon-public" />
                    </Link>
                  </div>
                  <h6>No Collab yet.</h6>
                </div>

                {/* Interests Section */}
                <div className="Followers-middle-section-2-skills-section-public">
                  <div className="Followers-middle-section-2-headingAndIcons-public">
                    <h3>Interests</h3>
                    <Link to={`/Interset/${userId}`}>
                      <FiEdit className="Followers-middle-section-2-icon-public" />
                    </Link>
                  </div>
                  <div className="Followers-middle-section-2-scroll-container">
                    <button
                      className="Followers-middle-section-2-scroll-btn"
                      onClick={() => scrollLeft(interestsRef)}
                    >
                      <IoIosArrowBack />
                    </button>
                    <div
                      className="Followers-middle-section-2-skill-list-public"
                      ref={interestsRef}
                    >
                      {interests.map((val, index) => (
                        <div
                          key={index}
                          className="Followers-middle-section-2-skillsMiniDiv-public"
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                    <button
                      className="Followers-middle-section-2-scroll-btn"
                      onClick={() => scrollRight(interestsRef)}
                    >
                      <IoIosArrowForward />
                    </button>
                  </div>
                </div>

                {/* Education Section */}
                <div className="Followers-middle-section-2-main-education-public">
                  <div className="Followers-middle-section-2-education-headingAndEdit-public">
                    <h3>Education</h3>
                    <Link to={`/Collab/${userId}`}>
                      <FiEdit className="Followers-middle-section-2-icon-public" />
                    </Link>
                  </div>
                  <div className="Followers-middle-section-2-buttons-section-public">
                    <button className="mit">MIT</button>
                    <button className="harvard">Harvard</button>
                    <button className="tenth">10th</button>
                    <button className="twelfth">12th</button>
                    {isMobile && <MobileFooter />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ProfileEditSection-right-main-container">
          <DesktopRight />
        </div>
      </div>
    </div>
  );
}

export default ProfileEditSection;