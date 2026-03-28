import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, LogOut, Camera, ShieldCheck, Activity, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl border dark:border-slate-700 overflow-hidden relative"
            >
                <div className="h-48 bg-gradient-to-r from-primary-600 to-primary-700 relative flex items-center justify-center group overflow-hidden">
                    <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/30 blur-3xl animate-pulse" />
                      <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-white/20 blur-3xl animate-pulse delay-700" />
                    </div>
                </div>
                
                <div className="px-8 pb-12 relative">
                    <div className="flex flex-col items-center -mt-24 space-y-6">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary-500 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
                            <img 
                                src={user.profilePic || `https://ui-avatars.com/api/?name=${user.name}&background=0ea5e9&color=fff`} 
                                className="w-48 h-48 rounded-[2.5rem] object-cover border-8 border-white dark:border-slate-800 shadow-2xl relative z-10 hover:scale-105 transition-transform duration-500" 
                                alt=""
                            />
                            <button className="absolute bottom-2 right-2 p-3 bg-primary-600 text-white rounded-2xl shadow-xl hover:bg-primary-700 transition-colors z-20 active:scale-90">
                                <Camera className="w-5 h-5"/>
                            </button>
                        </div>
                        <div className="text-center space-y-2">
                           <h2 className="text-4xl font-black text-slate-900 dark:text-white">{user.name}</h2>
                           <div className="flex items-center justify-center gap-2">
                               <ShieldCheck className="w-5 h-5 text-secondary-500" />
                               <span className="text-secondary-600 dark:text-secondary-400 font-bold uppercase tracking-widest text-xs">{user.role} Account</span>
                           </div>
                        </div>
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border dark:border-slate-700 space-y-4 hover:shadow-lg transition-all group">
                            <div className="flex items-center gap-4 text-slate-400 group-hover:text-primary-500 transition-colors">
                                <Mail className="w-5 h-5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Email Address</span>
                            </div>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{user.email}</p>
                         </div>
                         <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border dark:border-slate-700 space-y-4 hover:shadow-lg transition-all group">
                            <div className="flex items-center gap-4 text-slate-400 group-hover:text-primary-500 transition-colors">
                                <Shield className="w-5 h-5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Security Level</span>
                            </div>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">High Protection</p>
                         </div>
                    </div>

                    <div className="mt-12 space-y-4">
                        <div className="flex items-center gap-5 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border dark:border-slate-700 group hover:border-primary-500/50 transition-colors cursor-pointer">
                            <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 flex items-center justify-center">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h5 className="font-bold dark:text-white">Health Statistics</h5>
                                <p className="text-sm text-slate-500 dark:text-slate-400">View your medical logs and data points.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border dark:border-slate-700 group hover:border-primary-500/50 transition-colors cursor-pointer">
                            <div className="w-12 h-12 rounded-2xl bg-secondary-100 dark:bg-secondary-900/40 text-secondary-600 flex items-center justify-center">
                                <Award className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h5 className="font-bold dark:text-white">Trust Badges</h5>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Earned achievements for preventative health.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-12 border-t dark:border-slate-700 flex flex-col sm:flex-row gap-4">
                         <button onClick={logout} className="flex-1 py-5 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-3xl font-black text-lg hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-red-500/5 active:scale-95 flex items-center justify-center gap-3">
                            <LogOut className="w-6 h-6" /> Logout Session
                         </button>
                         <button className="flex-1 py-5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-3xl font-black text-lg hover:bg-primary-600 hover:text-white transition-all shadow-xl shadow-black/10 active:scale-95">
                            Edit Profile Details
                         </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
