import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // create user @ Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: username });
            console.log("User created:", userCredential.user);
            // store User @ Firestore DB
            await setDoc(doc(db, "Users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                name: username,
                email: email,
            });
            navigate("/");
        } catch (error) {
            console.error("Error signing up:", error);
        }
    };

    return (
        <div className="container">
            <Header />
            <div className="main">
                <Sidebar />
                <div className="content signup-container">
                        <div className="signup-box">
                            <h1>Create Your Account</h1>
                            <p>Join our community and start showcasing your art today.</p>
                            <form onSubmit={handleSubmit}>
                                <input type="text" placeholder="Enter your name" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <input type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <button type="submit" className="signup-button">Sign Up</button>
                            </form>
                            <button className="back-button button-redirect">
                                <Link className="button-link" to="/signup">TO LOG IN</Link>
                            </button>
                            <button className="back-button" onClick={() => navigate("/")}>Back to Home</button>
                        </div>
                </div>
            </div>
        </div>

    );
};



export default Signup;
