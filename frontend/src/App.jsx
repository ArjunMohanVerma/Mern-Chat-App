import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from './pages/ForgetPassword';
import ResetPasswordPage from './pages/ResetPasswordPage'
import EmailVerificationPage from "./pages/EmailVerifyPage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme} className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-auto">
      <Routes>
        <Route path="/" element={authUser ? authUser.isVerified ? <HomePage /> : <Navigate to="/verify-email" />: <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : !authUser.isVerified ? <Navigate to="/verify-email" />: <Navigate to="/" />} />
        <Route path='/verify-email' element={<EmailVerificationPage />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />}/>
        <Route path='/reset-password/:token' element={<ResetPasswordPage />}/>
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      </div>
      <Toaster />
    </div>
  );
};
export default App;
