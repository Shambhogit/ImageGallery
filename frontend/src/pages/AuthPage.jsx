import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

function AuthPage() {
  const [mode, setMode] = useState("login");
  const [token, setToken] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);
    console.log(savedToken);
    if (savedToken) {
      navigate("/home");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="max-w-md w-full bg-gray-850/70 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-8"
      >
        <Header mode={mode} setMode={setMode} />

        <div className="mt-6">
          {mode === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </motion.div>
    </div>
  );
}

function Header({ mode, setMode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11s1.343 3 3 3 3-1.343 3-3zM21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-white text-xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-gray-400">
            {mode === "login" ? "Sign in to continue" : "Create your account"}
          </p>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <ToggleBtn active={mode === "login"} onClick={() => setMode("login")}>
          Login
        </ToggleBtn>
        <ToggleBtn
          active={mode === "register"}
          onClick={() => setMode("register")}
        >
          Register
        </ToggleBtn>
      </div>
    </div>
  );
}

function ToggleBtn({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-white text-black shadow-md"
          : "text-gray-300 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post("http://localhost:5000/api/auth/login", { email, password })
      .then((res) => {
        toast.success(res.data.message);
        localStorage.setItem("token", res.data.accessToken);
        setEmail("");
        setPassword("");
        navigate('/home');
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  };

  return (
    <form className="space-y-4">
      <Input
        value={email}
        setFunc={setEmail}
        label="Email"
        type="email"
        name="email"
        placeholder="you@domain.com"
      />
      <Input
        value={password}
        setFunc={setPassword}
        label="Password"
        type="password"
        name="password"
        placeholder="Your secure password"
      />

      <button type="button" className="text-sm text-pink-400 hover:underline">
        Forgot Password?
      </button>

      <button
        onClick={(e) => handleSubmit(e)}
        className="w-full py-2 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-semibold shadow-md hover:opacity-95"
      >
        Sign In
      </button>
    </form>
  );
}

function RegisterForm() {
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [otpField, setOtpField] = useState(false);

  const handleGetOtp = async (e) => {
    e.preventDefault();

    await axios
      .post("http://localhost:5000/api/auth/get-otp", { email })
      .then((res) => {
        toast.success(res.data.message);
        setOtpField(true);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Some error in getting OTP");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post("http://localhost:5000/api/auth/register", {
        user_name: user,
        email,
        password,
      })
      .then((res) => {
        toast.success(res.data.message);
        localStorage.setItem("token", res.data.accessToken);
        navigate('/home');

        setEmail("");
        setPassword("");
        setUser("");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Some error in Creating account");
      });
  };

  return (
    <form className="space-y-4">
      <Input
        value={user}
        setFunc={setUser}
        label="User Name"
        name="user_name"
        placeholder="user_name (ex. john_1223)"
      />

      <Input
        value={email}
        setFunc={setEmail}
        label="Email"
        type="email"
        name="email"
        placeholder="you@domain.com"
      />
      {isVerified && (
        <Input
          value={password}
          setFunc={setPassword}
          label="Password"
          type="password"
          name="password"
          placeholder="Choose a strong password"
        />
      )}
      {isVerified && (
        <Input
          label="Confirm"
          type="password"
          name="confirm"
          placeholder="Repeat password"
        />
      )}

      {otpField && (
        <OtpForm
          email={email}
          setOtpField={setOtpField}
          setIsVerified={setIsVerified}
        />
      )}

      {isVerified ? (
        <button
          onClick={(e) => handleSubmit(e)}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow-md hover:opacity-95"
        >
          Create account
        </button>
      ) : (
        <button
          onClick={(e) => handleGetOtp(e)}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow-md hover:opacity-95"
        >
          Verify Email
        </button>
      )}
    </form>
  );
}

function Input({ label, type = "text", name, placeholder, value, setFunc }) {
  return (
    <label className="block text-sm">
      <span className="text-gray-300 text-xs mb-1 block">{label}</span>
      <input
        value={value} // controlled input
        onChange={(e) => setFunc(e.target.value)}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-lg bg-transparent border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
    </label>
  );
}

function OtpForm({ email, setOtpField, setIsVerified }) {
  const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // auto focus next input
      if (value && index < 8) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const strOtp = otp.join("");
    await axios
      .post("http://localhost:5000/api/auth/verify-otp", { email, otp: strOtp })
      .then((res) => {
        toast.success(res.data.message);
        setOtpField(false);
        setIsVerified(true);
      })
      .catch((err) => {
        toast.error("Error in Verifying OTP");
        console.log(err);
      });
  };

  return (
    <div className="w-full bg-gray-900 text-white flex flex-col items-center justify-center p-3 gap-4 relative rounded-2xl shadow-lg">
      {/* OTP Inputs */}
      <div className="flex gap-1">
        {otp.map((digit, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="text"
            value={digit}
            maxLength={1}
            required
            onChange={(e) => handleChange(e.target.value, i)}
            className="w-10 h-10 text-center rounded-md bg-gray-800 text-white font-semibold outline-none focus:ring-2 focus:ring-pink-500"
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        onClick={handleSubmit}
        className="w-full h-9 bg-pink-600 hover:bg-pink-500 rounded-lg font-semibold transition"
      >
        Verify
      </button>
    </div>
  );
}

export default AuthPage;
