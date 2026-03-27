import { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './auth.css'; // Import the custom sliding panel CSS

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    
    // Determine active panel based on URL
    const [isRegisterActive, setIsRegisterActive] = useState(location.pathname === '/register');

    // Login State
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');

    // Register State
    const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });
    const [registerLoading, setRegisterLoading] = useState(false);
    const [registerError, setRegisterError] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState('');

    // Update state if URL changes (e.g. user clicks a Link to /login when on /register)
    useEffect(() => {
        setIsRegisterActive(location.pathname === '/register');
    }, [location.pathname]);

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginSuccess('');
        setLoginLoading(true);
        
        try {
            const res = await API.post('/login', loginData);
            
            if (res.data.success) {
                setLoginSuccess(res.data.message);
                login({
                    token: res.data.token,
                    role: res.data.role,
                    username: res.data.username
                });

                try {
                    const guestCart = localStorage.getItem("guestCart");
                    if (guestCart) {
                        const items = JSON.parse(guestCart);
                        if (items && items.length > 0) {
                            await API.post('/cart/merge', { items });
                        }
                    }
                } catch (error) {
                    console.error("Failed to merge cart:", error);
                } finally {
                    localStorage.removeItem("guestCart");
                }

                setTimeout(() => {
                    if (res.data.role?.toLowerCase() === 'admin') {
                        navigate("/admin/dashboard");
                    } else {
                        const from = location.state?.from || "/";
                        navigate(from);
                    }
                }, 1000);
            } else {
                setLoginError(res.data.message || 'Login failed');
            }
        } catch (err) {
            setLoginError(err.response?.data?.message || err.message || 'An error occurred during login.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setRegisterError('');
        setRegisterSuccess('');
        setRegisterLoading(true);
        
        try {
            const res = await API.post('/register', registerData);
            
            if (res.data.success) {
                setRegisterSuccess(res.data.message);
                login({
                    token: res.data.token,
                    role: res.data.role,
                    username: res.data.username
                });
                
                try {
                    const guestCart = localStorage.getItem("guestCart");
                    if (guestCart) {
                        const items = JSON.parse(guestCart);
                        if (items && items.length > 0) {
                            await API.post('/cart/merge', { items });
                        }
                    }
                } catch (error) {
                    console.error("Failed to merge cart:", error);
                } finally {
                    localStorage.removeItem("guestCart");
                }

                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                setRegisterError(res.data.message || 'Registration failed');
            }
        } catch (err) {
            setRegisterError(err.response?.data?.message || err.message || 'An error occurred during registration.');
        } finally {
            setRegisterLoading(false);
        }
    };

    const switchToRegister = () => {
        setIsRegisterActive(true);
        navigate('/register');
        // Clear errors
        setLoginError('');
        setLoginSuccess('');
    };

    const switchToLogin = () => {
        setIsRegisterActive(false);
        navigate('/login');
        // Clear errors
        setRegisterError('');
        setRegisterSuccess('');
    };

    return (
        <div className="auth-page-container">
            <div className={`auth-wrapper ${isRegisterActive ? 'panel-active' : ''}`} id="authWrapper">
                
                {/* Register Form */}
                <div className="auth-form-box register-form-box">
                    <form onSubmit={handleRegisterSubmit}>
                        <h1 className="text-gray-800">Create Account</h1>
                        
                        {registerError && <div className="bg-red-50 text-red-600 p-2 rounded-md my-2 text-center text-sm w-full">{registerError}</div>}   
                        {registerSuccess && <div className="bg-green-50 text-green-600 p-2 rounded-md my-2 text-center text-sm w-full">{registerSuccess}</div>}   

                        <input type="text" name="username" placeholder="Full Name" value={registerData.username} onChange={handleRegisterChange} required />
                        <input type="email" name="email" placeholder="Email Address" value={registerData.email} onChange={handleRegisterChange} required />
                        <input type="password" name="password" placeholder="Password" value={registerData.password} onChange={handleRegisterChange} required />
                        <button type="submit" disabled={registerLoading} style={registerLoading ? {opacity: 0.7} : {}}>
                            {registerLoading ? "Signing Up..." : "Sign Up"}
                        </button>
                        
                        <div className="mobile-switch">
                            <p>Already have an account?</p>
                            <button type="button" id="mobileLoginBtn" onClick={switchToLogin}>Sign In</button>
                        </div>
                    </form>
                </div>

                {/* Login Form */}
                <div className="auth-form-box login-form-box">
                    <form onSubmit={handleLoginSubmit}>
                        <h1 className="text-gray-800">Sign In</h1>

                        {loginError && <div className="bg-red-50 text-red-600 p-2 rounded-md my-2 text-center text-sm w-full">{loginError}</div>}   
                        {loginSuccess && <div className="bg-green-50 text-green-600 p-2 rounded-md my-2 text-center text-sm w-full">{loginSuccess}</div>}   

                        <input type="email" name="email" placeholder="Email Address" value={loginData.email} onChange={handleLoginChange} required />
                        <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} required />
                        <a href="#">Forgot your password?</a>
                        <button type="submit" disabled={loginLoading} style={loginLoading ? {opacity: 0.7} : {}}>
                            {loginLoading ? "Signing In..." : "Sign In"}
                        </button>
                        
                        <div className="mobile-switch">
                            <p>Don't have an account?</p>
                            <button type="button" id="mobileRegisterBtn" onClick={switchToRegister}>Sign Up</button>
                        </div>
                    </form>
                </div>

                {/* Sliding Panel */}
                <div className="slide-panel-wrapper">
                    <div className="slide-panel">
                        <div className="panel-content panel-content-left">
                            <h1>Welcome Back!</h1>
                            <p>Stay connected by logging in with your credentials and continue your experience</p>
                            <button type="button" className="transparent-btn" id="loginBtn" onClick={switchToLogin}>Sign In</button>
                        </div>
                        <div className="panel-content panel-content-right">
                            <h1>Hey There!</h1>
                            <p>Begin your amazing journey by creating an account with us today</p>
                            <button type="button" className="transparent-btn" id="registerBtn" onClick={switchToRegister}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
