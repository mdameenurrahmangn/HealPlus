import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Briefcase, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border dark:border-slate-700 hover:shadow-xl hover:border-primary-500/30 transition-all group"
    >
        <div className="flex items-start gap-5">
            <div className="relative">
                <img 
                    src={doctor.user?.profilePic || `https://ui-avatars.com/api/?name=${doctor.user?.name}&background=0ea5e9&color=fff`} 
                    alt={doctor.user?.name}
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-50 dark:ring-slate-900 shadow-lg"
                />
                <div className={`absolute -bottom-2 -right-2 ${doctor.isOnline ? 'bg-secondary-500' : 'bg-slate-500'} text-white text-[10px] font-bold px-2 py-1 rounded-lg border-2 border-white dark:border-slate-800`}>
                    {doctor.isOnline ? 'Online' : 'Offline'}
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 text-[10px] font-bold rounded-lg uppercase tracking-wider border dark:border-primary-800">
                        {doctor.specialization}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs ml-auto bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 fill-current" /> {doctor.ratings || '4.8'}
                    </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">Dr. {doctor.user?.name}</h3>
                <div className="flex flex-col gap-1 text-slate-500 dark:text-slate-400 text-sm mt-3">
                    <span className="flex items-center gap-2 font-medium italic"><Briefcase className="w-4 h-4 text-primary-500" /> {doctor.experience}+ yrs Experience</span>
                    <span className="flex items-center gap-2 font-medium"><MapPin className="w-4 h-4 text-primary-500" /> {doctor.consultationAddress || doctor.location}</span>
                </div>
            </div>
        </div>

        <div className="mt-6 pt-6 border-t dark:border-slate-700 flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">Consultation Fee</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">₹{doctor.fees} <span className="text-xs font-normal text-slate-500">/ session</span></span>
            </div>
            <Link 
                to={`/booking/${doctor._id}`}
                className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-2xl font-bold text-sm group-hover:bg-primary-600 group-hover:text-white transition-all shadow-lg active:scale-95"
            >
                Book Visit <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    </motion.div>
  );
};

export default DoctorCard;
