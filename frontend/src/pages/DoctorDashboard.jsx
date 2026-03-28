import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Users, Calendar, CheckCircle, XCircle, Clock, Trash2, UserPlus, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctorProfile, setDoctorProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchAppointments();
        fetchDoctorProfile();
    }, []);

    const fetchDoctorProfile = async () => {
        try {
            const { data } = await api.get('/doctors/profile/me');
            setDoctorProfile(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAppointments = async () => {
        try {
            const { data } = await api.get('/appointments/my-doctor');
            setAppointments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatus = async (id, status) => {
        try {
            await api.put(`/appointments/${id}`, { status });
            toast.success(`Appointment ${status}!`);
            fetchAppointments();
        } catch (error) {
            toast.error('Action failed');
        }
    };

    const toggleOnlineStatus = async () => {
        try {
            const { data } = await api.put('/doctors/profile', { isOnline: !doctorProfile.isOnline });
            setDoctorProfile(data);
            toast.success(`You are now ${data.isOnline ? 'Online' : 'Offline'}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const updateAvailability = async () => {
        const slotsInput = prompt("Enter time slots separated by commas (e.g., 09:00 AM, 10:00 AM):", 
            doctorProfile?.availability?.[0]?.slots.join(', ') || "");
        if (slotsInput === null) return;

        const newSlots = slotsInput.split(',').map(s => s.trim()).filter(s => s);
        try {
            const availability = [{ day: 'Monday', slots: newSlots }]; // Simplified for demo
            const { data } = await api.put('/doctors/profile', { availability });
            setDoctorProfile(data);
            toast.success('Availability updated!');
        } catch (err) {
            toast.error('Failed to update availability');
        }
    };

    const stats = [
        { label: 'Total Patients', value: new Set(appointments.map(a => a.patient._id)).size, icon: <Users className="w-6 h-6" />, color: 'bg-primary-500' },
        { label: 'Upcoming', value: appointments.filter(a => (a.status === 'pending' || a.status === 'confirmed')).length, icon: <Calendar className="w-6 h-6" />, color: 'bg-secondary-500' },
        { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: <CheckCircle className="w-6 h-6" />, color: 'bg-blue-500' },
        { label: 'Ratings', value: doctorProfile?.ratings?.toFixed(1) || 'N/A', icon: <Star className="w-6 h-6" />, color: 'bg-amber-500' }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
            
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b dark:border-slate-800">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Doctor Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">Welcome, Dr. {user.name}. You are currently {doctorProfile?.isOnline ? 'Online' : 'Offline'}.</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={toggleOnlineStatus}
                        className={`px-6 py-3 font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2 ${doctorProfile?.isOnline ? 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {doctorProfile?.isOnline ? 'Go Offline' : 'Go Online'}
                    </button>
                    <button 
                        onClick={updateAvailability}
                        className="px-6 py-3 bg-primary-600 text-white font-bold rounded-2xl shadow-lg hover:bg-primary-700 transition-all flex items-center gap-2"
                    >
                        <UserPlus className="w-5 h-5"/> Update Availability
                    </button>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((s, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={s.label}
                        className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border dark:border-slate-700 hover:shadow-xl hover:border-primary-500/30 transition-all group"
                    >
                        <div className={`w-14 h-14 rounded-2xl ${s.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-primary-500/10 transition-transform group-hover:scale-110`}>
                            {s.icon}
                        </div>
                        <h4 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">{s.value}</h4>
                        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Appointments */}
            <section className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border dark:border-slate-700 overflow-hidden">
                <div className="px-8 py-8 border-b dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                        <Clock className="w-6 h-6 text-primary-500" /> Patient List & Symptoms
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                <th className="px-8 py-5 border-b dark:border-slate-700 first:rounded-tl-2xl">Patient Info</th>
                                <th className="px-8 py-5 border-b dark:border-slate-700">Symptoms</th>
                                <th className="px-8 py-5 border-b dark:border-slate-700">Date & Slot</th>
                                <th className="px-8 py-5 border-b dark:border-slate-700 uppercase tracking-widest">Status / Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-slate-700">
                            {appointments.map((appt) => (
                                <tr key={appt._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors text-sm">
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-bold text-primary-700">
                                                {appt.patient.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 dark:text-white font-bold">{appt.patient.name}</span>
                                                <span className="text-slate-500 dark:text-slate-400 text-xs">{appt.patient.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7 max-w-xs">
                                        <p className="text-slate-600 dark:text-slate-300 italic font-medium line-clamp-2">
                                            {appt.symptoms || appt.notes || "No symptoms described"}
                                        </p>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-slate-700 dark:text-slate-200 font-bold">{new Date(appt.date).toLocaleDateString()}</span>
                                            <span className="text-primary-600 dark:text-primary-400 font-bold text-xs bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded-lg w-max">{appt.slot}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase mr-4 ${
                                                appt.status === 'confirmed' ? 'bg-secondary-100 text-secondary-600' : 
                                                appt.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                                                appt.status === 'completed' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                                {appt.status}
                                            </span>
                                            {appt.status === 'pending' && (
                                                <button onClick={() => handleStatus(appt._id, 'confirmed')} className="p-2.5 bg-secondary-100 text-secondary-600 rounded-xl hover:bg-secondary-600 hover:text-white transition-all">
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                            {appt.status === 'confirmed' && (
                                                <button onClick={() => handleStatus(appt._id, 'completed')} className="p-2.5 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                            {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                                                <button onClick={() => handleStatus(appt._id, 'cancelled')} className="p-2.5 bg-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {appointments.length === 0 && (
                        <div className="py-24 flex flex-col items-center justify-center text-slate-400 italic">
                             <Calendar className="w-16 h-16 opacity-20 mb-4" />
                             No appointments scheduled yet.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default DoctorDashboard;
