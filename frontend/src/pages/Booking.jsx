import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../services/api';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Info, ArrowLeft, ArrowRight, ShieldCheck, Heart, User, MapPin } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import MockPaymentModal from '../components/MockPaymentModal';

const Booking = () => {
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [date, setDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const navigate = useNavigate();

    const slots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
        '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', 
        '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ];

    useEffect(() => {
        fetchDoctor();
    }, [doctorId]);

    const fetchDoctor = async () => {
        try {
            const { data } = await api.get(`/doctors/${doctorId}`);
            setDoctor(data);
        } catch (error) {
            toast.error('Doctor not found');
            navigate('/patient/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const { user } = React.useContext(AuthContext);

    const handleBooking = async () => {
        if (!selectedSlot) return toast.warning('Please select a time slot');
        setLoading(true);

        try {
            // 1. Create Mock Order
            const { data: order } = await api.post('/payments/order', {
                doctorId,
                fees: doctor.fees
            });

            setOrderData(order);
            setIsPaymentModalOpen(true);
            setLoading(false); // Stop loading for main UI since modal is open

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to initiate mock payment');
            setLoading(false);
        }
    };

    const handleMockPaymentSuccess = async (response) => {
        try {
            const verifyData = {
                mock_order_id: response.mock_order_id,
                mock_payment_id: response.mock_payment_id,
                mock_signature: response.mock_signature,
                appointmentData: {
                    doctorId,
                    date: date.toISOString(),
                    slot: selectedSlot,
                    notes,
                    symptoms: notes
                }
            };

            // Verify Mock Payment on Backend
            const { data } = await api.post('/payments/verify', verifyData);

            if (data.status === 'success') {
                setTimeout(() => { // Small delay to let success animation show in modal
                    setIsPaymentModalOpen(false);
                    toast.success('Mock Payment successful! Appointment confirmed.');
                    navigate('/patient/dashboard');
                }, 2000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Mock payment verification failed');
            setIsPaymentModalOpen(false);
        }
    };

    if (loading && !doctor) return <div className="h-screen flex items-center justify-center text-primary-600 font-bold animate-pulse text-2xl">Preparing Consultation...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
            <MockPaymentModal 
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                amount={doctor?.fees}
                orderId={orderData?.id}
                onPaymentComplete={handleMockPaymentSuccess}
            />
            
            <div className="flex items-center gap-4 mb-10 pb-4 border-b dark:border-slate-800">
                <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-sm hover:text-primary-600 transition-colors">
                    <ArrowLeft className="w-5 h-5"/>
                </button>
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Schedule Appointment</h1>
                  <p className="text-slate-500 font-medium dark:text-slate-400">Review availability and confirm your session with Dr. {doctor?.user.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left: Doctor Info */}
                <div className="lg:col-span-1 space-y-8">
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border dark:border-slate-700 relative overflow-hidden group"
                     >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                           <Heart className="w-40 h-40" />
                        </div>
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <img src={doctor.user.profilePic || `https://ui-avatars.com/api/?name=${doctor.user.name}&background=0ea5e9&color=fff`} className="w-32 h-32 rounded-[2rem] object-cover ring-8 ring-slate-50 dark:ring-slate-900 shadow-2xl mb-6" alt=""/>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Dr. {doctor.user.name}</h2>
                            <p className="text-primary-600 font-bold text-sm bg-primary-50 dark:bg-primary-900/40 px-3 py-1 rounded-lg uppercase tracking-widest mb-2">{doctor.specialization}</p>
                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${doctor.isOnline ? 'bg-secondary-100 text-secondary-600' : 'bg-slate-100 text-slate-500'}`}>
                                 {doctor.isOnline ? 'Available Online' : 'Currently Offline'}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 w-full mt-8">
                                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">EXP</h5>
                                    <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{doctor.experience}+ yrs</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-700">
                                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">RATING</h5>
                                    <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{doctor.ratings || 4.9}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4 relative z-10">
                            <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-sm">
                                <ShieldCheck className="w-5 h-5 text-secondary-500" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Verified Professional</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-sm">
                                <Clock className="w-5 h-5 text-primary-500" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Avg 15m Wait Time</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-sm">
                                <MapPin className="w-5 h-5 text-red-500" />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{doctor.consultationAddress || doctor.location}</span>
                            </div>
                        </div>
                     </motion.div>

                     <div className="p-6 bg-primary-600 text-white rounded-3xl shadow-xl shadow-primary-500/30 flex items-center justify-between">
                        <div className="space-y-1">
                            <h4 className="text-white/70 text-[10px] font-bold uppercase tracking-widest leading-none">Consultation Fee</h4>
                            <p className="text-3xl font-black leading-none">₹{doctor.fees}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <Info className="w-6 h-6" />
                        </div>
                     </div>
                </div>

                {/* Right: Booking */}
                <div className="lg:col-span-2 space-y-10">
                    <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border dark:border-slate-700">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3 group">
                           <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 text-primary-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">1</div> 
                           Select Appointment Date
                        </h3>
                        <div className="mx-auto flex justify-center booking-calendar-custom bg-slate-50 dark:bg-slate-900 rounded-3xl p-4 overflow-hidden shadow-inner border dark:border-slate-800">
                             <Calendar 
                                 onChange={setDate} 
                                 value={date} 
                                 minDate={new Date()}
                                 className="dark-theme-calendar border-none shadow-none bg-transparent" 
                             />
                        </div>
                    </section>

                    <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border dark:border-slate-700">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3 group">
                           <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 text-primary-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">2</div> 
                           Choose Available Slot
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {slots.map(s => (
                                <button 
                                    key={s} 
                                    onClick={() => setSelectedSlot(s)}
                                    className={`py-6 rounded-3xl font-bold transition-all border shadow-sm active:scale-95 ${selectedSlot === s ? 'bg-primary-600 text-white border-primary-600 shadow-primary-500/30 shadow-xl -translate-y-1' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-500/50 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border dark:border-slate-700">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3 group">
                           <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 text-primary-600 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">3</div> 
                           Symptoms & Details (Optional)
                        </h3>
                        <textarea 
                            value={notes} 
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Briefly describe your health concerns or any symptoms..."
                            className="w-full h-40 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all dark:text-white placeholder-slate-400"
                        />
                         <button 
                            disabled={loading}
                            onClick={handleBooking}
                            className="w-full mt-10 py-5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-[2rem] font-bold text-xl shadow-2xl hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 dark:hover:text-white transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
                        >
                            {loading ? 'Processing...' : 'Pay & Confirm Booking'} <div className="w-10 h-10 bg-white/20 dark:bg-black/10 rounded-full flex items-center justify-center"> <ArrowRight className="w-5 h-5" /> </div>
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Booking;
