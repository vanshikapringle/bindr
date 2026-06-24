"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

// Reusable Floating Label Input Component
const FloatingInput = ({ 
  id, label, type, required = true, showToggle, onToggle, value, onChange
}: { 
  id: string, label: string, type: string, required?: boolean, showToggle?: boolean, onToggle?: () => void, value: any, onChange: any 
}) => (
  <div className="relative mb-6">
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="block w-full px-4 pb-3 pt-6 text-sm text-foreground bg-transparent border border-border rounded-xl appearance-none focus:outline-none focus:ring-0 focus:border-accent peer transition-colors"
      placeholder=" "
      required={required}
    />
    <label
      htmlFor={id}
      className="absolute text-sm text-muted duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-accent pointer-events-none"
    >
      {label}
    </label>
    {showToggle && (
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
      >
        {type === "password" ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
    )}
  </div>
);

export default function Register() {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "login") setIsLogin(true);
    }
  }, []);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: `${formData.firstName} ${formData.lastName}`.trim(), email: formData.email, password: formData.password };

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data || "Authentication failed");

      if (isLogin) {
        setSuccess("Successfully logged in! Redirecting...");
        localStorage.setItem("bindr_token", data.token);
        setTimeout(() => window.location.href = "/dashboard", 1000);
      } else {
        setSuccess("Successfully registered! Redirecting to setup...");
        // Auto-login after registration
        const loginRes = await fetch("http://localhost:5000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          localStorage.setItem("bindr_token", loginData.token);
          setTimeout(() => window.location.href = "/onboarding", 1000);
        } else {
          setTimeout(() => { setIsLogin(true); setSuccess(""); }, 1500);
        }
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--background)] font-sans selection:bg-accent selection:text-white">
      
      {/* Left Side: Editorial Branding & Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--accent)] overflow-hidden flex-col justify-between p-16">
        {/* SVG Noise Grain Overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        
        <div className="relative z-10">
          <Link href="/" className="font-serif text-3xl font-bold text-[var(--color-cherry)]">
            Bindr.
          </Link>
        </div>

        <div className="relative z-10 max-w-lg mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="font-serif text-5xl leading-[1.1] text-[var(--color-cherry)] mb-6">
              Every book deserves another chapter.
            </h1>
            <p className="text-xl text-[var(--color-cherry)]/80 leading-relaxed font-light">
              Join a community of readers exchanging stories, discoveries, and well-loved books.
            </p>
          </motion.div>
        </div>

        {/* Floating Book Abstract Illustration */}
        <div className="absolute -bottom-20 -right-10 w-[500px] h-[500px] z-0 perspective-1000 opacity-90">
           <motion.div 
            initial={{ opacity: 0, rotate: -10, y: 50 }}
            animate={{ opacity: 1, rotate: -5, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="absolute top-10 right-20 w-48 h-72 rounded-r-2xl rounded-l-md shadow-2xl border-l-[12px] border-black/20 p-6 flex flex-col justify-between z-20 bg-[#C58A55]"
            style={{ backgroundImage: `url(https://covers.openlibrary.org/b/isbn/9781400031702-L.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, rotate: 15, x: 50 }}
            animate={{ opacity: 1, rotate: 10, x: 0 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="absolute bottom-20 right-40 w-56 h-80 rounded-r-2xl rounded-l-md shadow-2xl border-l-[14px] border-black/20 p-6 flex flex-col justify-between z-10 bg-[#4A5D4E]"
             style={{ backgroundImage: `url(https://covers.openlibrary.org/b/isbn/9781400079278-L.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
          </motion.div>
        </div>

        <div className="relative z-10 mt-auto pt-20">
          <p className="text-sm text-foreground/60 font-medium">© {new Date().getFullYear()} Bindr. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 relative">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="font-serif text-2xl font-bold text-foreground">
            Bindr.
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="font-serif text-4xl text-foreground mb-3">{isLogin ? "Welcome Back" : "Create an Account"}</h2>
            <p className="text-muted text-sm sm:text-base">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-accent hover:text-accent-hover transition-colors underline underline-offset-4">
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-4 text-center">{success}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingInput id="firstName" label="First Name" type="text" value={formData.firstName} onChange={handleInputChange} />
                <FloatingInput id="lastName" label="Last Name" type="text" value={formData.lastName} onChange={handleInputChange} />
              </div>
            )}
            
            <FloatingInput id="email" label="Email Address" type="email" value={formData.email} onChange={handleInputChange} />

            <FloatingInput 
              id="password" 
              label="Password" 
              type={showPassword ? "text" : "password"} 
              showToggle 
              onToggle={() => setShowPassword(!showPassword)}
              value={formData.password}
              onChange={handleInputChange}
            />

            {!isLogin && (
              <FloatingInput 
                id="confirmPassword" 
                label="Confirm Password" 
                type={showConfirmPassword ? "text" : "password"} 
                showToggle 
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            )}

            {/* Account Type Selection */}
            {!isLogin && (
              <div className="pt-2 pb-6">
                <p className="text-sm font-medium text-foreground mb-3">Account Type</p>
                <div className="flex gap-4">
                  <label className="flex-1 relative cursor-pointer">
                    <input type="radio" name="accountType" value="reader" className="peer sr-only" defaultChecked />
                    <div className="w-full p-4 text-center border border-border rounded-xl text-muted peer-checked:border-accent peer-checked:bg-[var(--accent)]/30 peer-checked:text-accent transition-all hover:bg-gray-50">
                      <span className="font-medium text-sm">Reader</span>
                    </div>
                  </label>
                  <label className="flex-1 relative cursor-pointer">
                    <input type="radio" name="accountType" value="admin" className="peer sr-only" />
                    <div className="w-full p-4 text-center border border-border rounded-xl text-muted peer-checked:border-accent peer-checked:bg-[var(--accent)]/30 peer-checked:text-accent transition-all hover:bg-gray-50">
                      <span className="font-medium text-sm">Admin</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-foreground text-white py-4 px-6 rounded-xl font-medium text-sm transition-all duration-300 hover:bg-[#2C382E] shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
            
            <p className="mt-6 text-center text-xs text-muted leading-relaxed">
              By continuing, you agree to our <a href="#" className="underline hover:text-foreground">Terms of Service</a> and <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
            </p>
          </form>
        </motion.div>
      </div>
      
    </div>
  );
}
