import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import DoctorCard from '../components/DoctorCard';
import { Search, Filter, Calendar, CheckCircle, Clock, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const PatientDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    const specializations = ['General', 'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics'];

    useEffect(() => {
        fetchDoctors();
        fetchAppointments();
    }, []);

    const fetchDoctors = async (spec = '') => {
        try {
            const { data } = await api.get(`/doctors?specialization=${spec}`);
            setDoctors(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAppointments = async () => {
        try {
            const { data } = await api.get('/appointments/my-patient');
            setAppointments(data);
        } catch (error) {
            console.error(error);
        }
    };

    const filteredDoctors = doctors.filter(doc => 
        doc.user.name.toLowerCase().includes(search.toLowerCase()) || 
        doc.specialization.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
            
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b dark:border-slate-800">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Hello, <span className="text-primary-600">{user.name}</span></h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">Welcome to your patient portal. Stay on top of your health.</p>
                </div>
                <div className="flex bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border dark:border-slate-700 min-w-0 md:min-w-[400px]">
                    <Search className="w-5 h-5 text-slate-400 m-3" />
                    <input 
                        type="text" 
                        placeholder="Search for doctors, specializations..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 w-full py-3 dark:text-white"
                    />
                    <button className="bg-primary-600 p-3 rounded-xl text-white hover:bg-primary-700 transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </header>

                <section>
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-primary-500/10">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                            <Clock className="w-6 h-6 text-primary-500" /> Recent Appointments
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {appointments.slice(0, 6).map((appt) => (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={appt._id}
                                className={`p-6 rounded-3xl shadow-xl relative overflow-hidden group ${appt.status === 'completed' ? 'bg-white dark:bg-slate-800 border-2 border-primary-500/20' : 'bg-gradient-to-br from-primary-600 to-primary-700 text-white'}`}
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-500">
                                   <Calendar className={`w-24 h-24 ${appt.status === 'completed' ? 'text-primary-500' : 'text-white'}`} />
                                </div>
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${appt.status === 'completed' ? 'bg-primary-50 text-primary-600 border-primary-100' : 'bg-white/20 backdrop-blur-md border-white/30'}`}>
                                        <Calendar className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className={`${appt.status === 'completed' ? 'text-slate-400' : 'text-primary-100'} font-bold text-xs uppercase tracking-widest`}>{new Date(appt.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                        <p className={`text-xl font-extrabold ${appt.status === 'completed' ? 'text-slate-900 dark:text-white' : ''}`}>{appt.slot}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/10 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden shadow-lg">
                                            <img src={appt.doctor.user.profilePic || `https://ui-avatars.com/api/?name=${appt.doctor.user.name}&background=fff&color=0ea5e9`} alt="" className="w-full h-full object-cover"/>
                                        </div>
                                        <span className={`font-bold ${appt.status === 'completed' ? 'text-slate-700 dark:text-slate-200' : ''}`}>Dr. {appt.doctor.user.name}</span>
                                    </div>
                                    <span className={`px-3 py-1 backdrop-blur-md text-xs font-bold rounded-lg uppercase ${appt.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-white/20'}`}>
                                        {appt.status}
                                    </span>
                                </div>

                                {appt.status === 'completed' && !appt.rating && (
                                    <div className="mt-6 space-y-3 relative z-10">
                                        <p className="text-sm font-bold text-primary-600">How was your visit?</p>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button 
                                                    key={star} 
                                                    onClick={async () => {
                                                        const feedback = prompt("Leave a brief feedback (optional):");
                                                        try {
                                                            await api.put(`/appointments/${appt._id}/rate`, { rating: star, feedback });
                                                            toast.success("Thank you for your rating!");
                                                            fetchAppointments();
                                                        } catch (err) {
                                                            toast.error("Failed to submit rating");
                                                        }
                                                    }}
                                                    className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 text-slate-400 hover:text-amber-500 rounded-xl transition-all"
                                                >
                                                    <Star className="w-5 h-5" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {appt.rating && (
                                     <div className="mt-6 flex items-center gap-2 relative z-10 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-2xl w-max">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        <span className="text-sm font-bold text-amber-700 dark:text-amber-400">You rated: {appt.rating}/5</span>
                                     </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>

            {/* Specializations Quick Filter */}
            <section>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Expert Specializations</h3>
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => fetchDoctors('')}
                        className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200 hover:border-primary-500 hover:text-primary-500 active:scale-95 transition-all shadow-sm"
                    >
                        All Experts
                    </button>
                    {specializations.map(spec => (
                        <button 
                            key={spec}
                            onClick={() => fetchDoctors(spec)}
                            className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200 hover:border-primary-500 hover:text-primary-500 active:scale-95 transition-all shadow-sm"
                        >
                            {spec}
                        </button>
                    ))}
                </div>
            </section>

            {/* Doctor Feed */}
            <section>
                <div className="flex items-center justify-between mb-10 pb-4 border-b dark:border-slate-800">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Professional Doctors</h2>
                    <p className="hidden md:block text-slate-500 dark:text-slate-400 font-medium">Over {doctors.length} results found for you.</p>
                </div>
                
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredDoctors.map(doctor => (
                                <motion.div key={doctor._id} layout initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                                    <DoctorCard doctor={doctor} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </section>
        </div>
    );
};

export default PatientDashboard;
