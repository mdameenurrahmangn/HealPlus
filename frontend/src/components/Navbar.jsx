import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Heart, User, LogOut, Menu, X, Calendar } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass dark:bg-slate-900 shadow-sm border-b dark:border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary-500 rounded-lg p-2 group-hover:bg-primary-600 transition-colors">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">HealPlus</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors font-medium">Home</Link>
            {user && (
              <Link to={user.role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard'} className="text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors font-medium">Dashboard</Link>
            )}
            
            <ThemeToggle />

            {!user ? (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-5 py-2 text-slate-700 dark:text-slate-200 hover:text-primary-600 transition-colors font-medium">Login</Link>
                <Link to="/register" className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-md shadow-primary-500/20 transition-all active:scale-95">Register</Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors group">
                    <User className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-primary-500" />
                    <span className="font-medium text-slate-700 dark:text-slate-200">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 text-slate-500 hover:text-red-500 rounded-lg transition-colors active:scale-90">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
             <ThemeToggle />
             <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-2 overflow-hidden"
            >
                <Link to="/" className="block px-3 py-4 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary-500 border-b dark:border-slate-800" onClick={() => setIsOpen(false)}>Home</Link>
                {user && (
                    <Link to={user.role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard'} className="block px-3 py-4 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary-500 border-b dark:border-slate-800" onClick={() => setIsOpen(false)}>Dashboard</Link>
                )}
                {!user ? (
                    <div className="pt-4 flex flex-col gap-3">
                        <Link to="/login" className="px-3 py-4 text-center font-bold text-slate-700 dark:text-slate-200" onClick={() => setIsOpen(false)}>Login</Link>
                        <Link to="/register" className="px-3 py-4 bg-primary-600 text-white rounded-xl text-center font-bold" onClick={() => setIsOpen(false)}>Register</Link>
                    </div>
                ) : (
                    <div className="pt-4 flex flex-col gap-3">
                         <Link to="/profile" className="px-3 py-3 text-slate-700 dark:text-slate-200 font-medium" onClick={() => setIsOpen(false)}>Profile</Link>
                         <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-3 text-red-500 font-medium"> <LogOut className="w-5 h-5"/> Logout</button>
                    </div>
                )}
            </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
