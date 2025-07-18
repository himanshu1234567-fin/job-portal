"use client";

import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  LinearProgress,
  Alert,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const blankEducation = {
  board10: "",
  percentage10: "",
  board12: "",
  percentage12: "",
  college: "",
  collegeDegree: "",
  branch: "",
  passingYear: "",
  cgpa: "",
};

const defaultProfile = {
  fullName: "",
  email: "",
  dob: "",
  phone: "",
  education: [],
  skills: "",
  experience: "",
  desirableJob: "",
  resume: "",
  image: "/user.png",
};

const Profile = () => {
  const [user, setUser] = useState(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [candidateId, setCandidateId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You are not logged in. Please log in to view your profile.");
        setLoading(false);
        return;
      }
      try {
        const userIdRes = await axios.get("http://localhost:5000/api/candidates/user-id", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedUserId = userIdRes.data.userId;
        if (isMounted) setCurrentUserId(fetchedUserId);

        const meRes = await axios.get("http://localhost:5000/api/candidates/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!isMounted) return;

        const candidateData = meRes.data;
        setCandidateId(candidateData._id);

        const mergedData = {
          ...defaultProfile,
          ...candidateData,
          education: Array.isArray(candidateData.education) && candidateData.education.length > 0
            ? candidateData.education
            : [blankEducation],
          skills: Array.isArray(candidateData.skills)
            ? candidateData.skills.join(", ")
            : "",
          dob: candidateData.dob ? new Date(candidateData.dob).toISOString().split("T")[0] : "",
        };

        setUser(mergedData);
        setEditing(false);
      } catch (err) {
        if (isMounted) {
          if (err.response?.status === 404) {
            setError("No candidate profile found. Please create your profile.");
            setUser({ ...defaultProfile, education: [blankEducation] });
            setEditing(true);
          } else {
            setError(err.response?.data?.message || err.message || "Failed to load profile.");
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => { isMounted = false; };
  }, []);

  const calculateCompletion = () => {
    const anyEducationComplete = user.education.some(edu =>
      edu.college && edu.collegeDegree && edu.passingYear && edu.cgpa
    );
    const fields = [
      user.fullName,
      user.email,
      user.dob,
      user.phone,
      anyEducationComplete,
      user.skills,
      user.experience,
      user.desirableJob,
    ];
    user.education.forEach(edu => {
      fields.push(edu.board10, edu.percentage10, edu.board12, edu.percentage12);
    });
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && !/^\d{0,10}$/.test(value)) return;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducation = user.education.map((edu, i) =>
      i === index ? { ...edu, [name]: value } : edu
    );
    setUser(prev => ({ ...prev, education: updatedEducation }));
  };

  const addEducation = () => {
    setUser(prev => ({
      ...prev,
      education: [...prev.education, { ...blankEducation }],
    }));
  };

  const removeEducation = (index) => {
    setUser(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const removeResume = () => {
    setUser(prev => ({ ...prev, resume: "" }));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser(prev => ({ ...prev, resume: file.name }));
    }
  };

  const saveProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found. Please sign in.");
      return;
    }

    if (!user.fullName || !user.email || !user.phone || !user.dob || !user.desirableJob) {
      setError("Please fill in all required fields.");
      return;
    }

    const isEducationValid = user.education.every(edu =>
      edu.college && edu.collegeDegree && edu.passingYear && edu.cgpa &&
      edu.board10 && edu.percentage10 !== "" && edu.board12 && edu.percentage12 !== ""
    );

    if (editing && !isEducationValid) {
      setError("Please complete all education fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const preparedEducationArray = user.education.map(edu => ({
        ...edu,
        percentage10: Number(edu.percentage10) || 0,
        percentage12: Number(edu.percentage12) || 0,
        passingYear: Number(edu.passingYear) || 0,
        cgpa: Number(edu.cgpa) || 0,
      }));

      const preparedUser = {
        fullName: user.fullName,
        email: user.email,
        dob: user.dob,
        phone: user.phone,
        education: preparedEducationArray,
        skills: user.skills.split(",").map(s => s.trim()).filter(Boolean),
        experience: Number(user.experience) || 0,
        desirableJob: user.desirableJob,
      };

      let res;
      if (candidateId) {
        res = await axios.put(`http://localhost:5000/api/candidates/${candidateId}`, preparedUser, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } else {
        if (!currentUserId) {
          setError("User ID missing. Please log in again.");
          setLoading(false);
          return;
        }
        res = await axios.post("http://localhost:5000/api/candidates", { ...preparedUser, userId: currentUserId }, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setCandidateId(res.data.candidate._id);
      }

      const updatedUser = {
        ...(res.data.candidate || res.data),
        skills: (res.data.candidate?.skills || res.data.skills)?.join(", ") || "",
        dob: new Date(res.data.candidate?.dob || res.data.dob).toISOString().split("T")[0],
        education: res.data.candidate?.education || res.data.education || [blankEducation],
      };

      setUser(updatedUser);
      const progress = calculateCompletion();
      localStorage.setItem("profileComplete", JSON.stringify(progress === 100));
      localStorage.setItem("profileProgress", JSON.stringify(progress));
      setEditing(false);
      setError("Profile saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      setError(err.response?.data?.message || err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><Typography>Loading...</Typography></Box>;
  }

  return <></>; // Render code not shown for brevity
};

export default Profile;
