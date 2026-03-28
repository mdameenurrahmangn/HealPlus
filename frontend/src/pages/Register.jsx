import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Stethoscope, Briefcase, MapPin, DollarSign, ArrowLeft } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
    const [role, setRole] = useState('patient');
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', 
        specialization: '', experience: '', location: '', fees: ''
    });
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const { data } = await api.post('/auth/google', { 
                token: credentialResponse.credential,
                role: role 
            });
            login(data);
            toast.success(`Welcome, ${data.name}!`);
            navigate(data.role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
        } catch (error) {
            toast.error('Google registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData, role };
            const { data } = await api.post('/auth/register', payload);
            login(data);
            toast.success(`Account created! Welcome, ${data.name}.`);
            navigate(role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12 md:py-20 lg:py-24">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border dark:border-slate-700"
            >
                <div className="text-center mb-8 space-y-2">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Create Account</h2>
                    <p className="text-slate-500 dark:text-slate-400">Join our modern healthcare ecosystem.</p>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl mb-8 relative">
                    <button 
                        onClick={() => setRole('patient')}
                        className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all relative z-10 ${role === 'patient' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        I'm a Patient
                    </button>
                    <button 
                        onClick={() => setRole('doctor')}
                        className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all relative z-10 ${role === 'doctor' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        I'm a Doctor
                    </button>
                    <motion.div 
                        animate={{ x: role === 'patient' ? 0 : '100%' }}
                        className="absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                <input 
                                    name="name" required
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                <input 
                                    name="email" type="email" required
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                <input 
                                    name="password" type="password" required
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                />
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {role === 'doctor' && (
                                <motion.div 
                                    key="doctor-fields"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden pt-2"
                                >
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Specialization</label>
                                        <div className="relative group">
                                            <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                            <input 
                                                name="specialization" required
                                                onChange={handleChange}
                                                placeholder="e.g. Cardiology"
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Experience (Years)</label>
                                        <div className="relative group">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                            <input 
                                                name="experience" type="number" required
                                                onChange={handleChange}
                                                placeholder="e.g. 5"
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Practice Location</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                            <input 
                                                name="location" required
                                                onChange={handleChange}
                                                placeholder="Enter city or clinic"
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Consultaion Fees ($)</label>
                                        <div className="relative group">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                                            <input 
                                                name="fees" type="number" required
                                                onChange={handleChange}
                                                placeholder="e.g. 100"
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 px-1">
                        By signing up, you agree to our Terms of Service and Privacy Policy. We value your data security.
                    </p>

                    <button 
                        disabled={loading}
                        className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/25 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Creating Account...' : 'Continue'}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t dark:border-slate-700"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="px-3 bg-white dark:bg-slate-800 text-slate-500 font-bold tracking-widest"> Or Register With </span></div>
                    </div>

                    <div className="flex justify-center">
                        <GoogleLogin 
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error('Google registration failed')}
                            theme="filled_blue"
                            shape="pill"
                            width="100%"
                        />
                    </div>
                </form>

                <div className="mt-8 text-center border-t dark:border-slate-700 pt-6">
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Already have an account? <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold ml-1 inline-flex items-center gap-1 group"> <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Login instead </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
