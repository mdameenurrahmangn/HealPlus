import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const { data } = await api.post('/auth/google', { token: credentialResponse.credential });
            login(data);
            toast.success(`Welcome, ${data.name}!`);
            navigate(data.role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
        } catch (error) {
            toast.error('Google login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data);
            toast.success(`Welcome back, ${data.name}!`);
            navigate(data.role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-20">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border dark:border-slate-700"
            >
                <div className="text-center mb-8 space-y-2">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
                    <p className="text-slate-500 dark:text-slate-400">Log in to manage your appointments.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-1">
                        <Link to="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">Forgot Password?</Link>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/25 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Logging in...' : <><LogIn className="w-5 h-5" /> Sign In</>}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t dark:border-slate-700"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="px-3 bg-white dark:bg-slate-800 text-slate-500 font-bold tracking-widest">Or Continue With</span></div>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin 
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error('Google Sign-In failed')}
                            theme="filled_blue"
                            shape="pill"
                            width="100%"
                        />
                    </div>
                </form>

                <div className="mt-8 text-center border-t dark:border-slate-700 pt-6">
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Don't have an account? <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold ml-1 inline-flex items-center gap-1 group">Register Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
