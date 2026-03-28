import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Calendar, Search, Star, Clock, UserCheck } from 'lucide-react';
import heroImg from '../assets/hero.png';

const Landing = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const features = [
        { icon: <Search className="w-6 h-6" />, title: 'Find Doctors', desc: 'Browse from hundreds of specialized healthcare professionals.' },
        { icon: <Calendar className="w-6 h-6" />, title: 'Instant Booking', desc: 'Book appointments instantly at your convenience with live slots.' },
        { icon: <Star className="w-6 h-6" />, title: 'Top Rated', desc: 'Our platform features only the most experienced and rated doctors.' },
        { icon: <Clock className="w-6 h-6" />, title: '24/7 Support', desc: 'Need help? Our dedicated support team is available round the clock.' }
    ];

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-10 pb-20 md:pt-16 md:pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            variants={fadeIn}
                            className="flex-1 text-center md:text-left space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold text-sm">
                                <ShieldCheck className="w-4 h-4" /> Trusted Healthcare Platform
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                Your Health is Our <span className="text-primary-600">Priority.</span>
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto md:mx-0">
                                Seamlessly connect with the best doctors across multiple specializations. Book, manage, and track your healthcare appointments with ease.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                                <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-xl shadow-primary-500/25 transition-all hover:-translate-y-1">Get Started Today</Link>
                                <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">Sign In</Link>
                            </div>
                            <div className="flex items-center gap-6 pt-6 justify-center md:justify-start">
                                <div>
                                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">10k+</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Patients</p>
                                </div>
                                <div className="w-[1px] h-10 bg-slate-200 dark:bg-slate-800" />
                                <div>
                                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">500+</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Doctors</p>
                                </div>
                                <div className="w-[1px] h-10 bg-slate-200 dark:bg-slate-800" />
                                <div>
                                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">50k+</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Bookings</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="flex-1 relative"
                        >
                            <div className="absolute -inset-4 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
                            <img 
                                src={heroImg} 
                                alt="Healthcare" 
                                className="relative w-full h-auto rounded-[2rem] shadow-2xl border-8 border-white dark:border-slate-800 object-cover aspect-square"
                            />
                            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border dark:border-slate-700">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-900/40 flex items-center justify-center text-secondary-600">
                                        <UserCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase">Available Now</p>
                                        <h5 className="font-bold text-slate-900 dark:text-white">Find Expert Doctors</h5>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-slate-100/50 dark:bg-slate-800/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                   <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Why Choose HealPlus?</h2>
                        <p className="text-slate-600 dark:text-slate-400">We offer a simplified, modern, and reliable way to handle your healthcare needs from start to finish.</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((f, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-8 bg-white dark:bg-slate-800 rounded-3xl border dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-primary-500/50 transition-all group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center mb-6 border dark:border-primary-800 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                   </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
