
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { ShoppingBagIcon, HeartIcon, UserIcon, MenuIcon, XIcon } from './Icons';
import Logo from './Logo';

const Header: React.FC = () => {
  const { cart, user, openLoginModal, logout, purchasedCall } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isCallRejoinable = purchasedCall &&
    location.pathname !== '/waiting-room' &&
    Date.now() < (purchasedCall.purchaseTime + purchasedCall.product.duration * 60 * 1000);
  
  const hasFavorites = user?.favorites?.length > 0;
  const hasUnreadNotifications = user?.notifications?.some(n => !n.read);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsDropdownOpen(false);
  }
  
  const handleAuthAction = (action: () => void) => {
      if (user) {
          action();
      } else {
          openLoginModal();
      }
  }
  
  const NavLink: React.FC<{ to: string, children: React.ReactNode, isMobile?: boolean }> = ({ to, children, isMobile = false }) => (
    <Link 
      to={to} 
      className={isMobile 
        ? "block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100 hover:text-brand-pink transition-colors duration-300 uppercase"
        : "text-gray-600 hover:text-brand-pink transition-colors duration-300 uppercase font-medium"
      }
      onClick={() => isMobile && setIsMobileMenuOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <header className="fixed top-[2.25rem] left-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-xl border-b border-gray-200">
      <div className="relative">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-8">
              <Link to="/" className="group">
                <Logo />
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/catalog">Gallery</NavLink>
                  <NavLink to="/community">Community</NavLink>
                  <NavLink to="/about">About</NavLink>
              </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isCallRejoinable && (
                <button
                    onClick={() => navigate('/waiting-room')}
                    className="bg-brand-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center gap-2 shadow-lg text-sm sm:text-base uppercase"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    LIVE
                </button>
            )}
            
            <div className="flex items-center space-x-2 sm:space-x-4">
                <button onClick={() => handleAuthAction(() => navigate('/favorites'))} className="text-brand-text-dark hover:text-brand-pink transition duration-300 p-1">
                    <HeartIcon filled={hasFavorites} className="h-7 w-7" />
                </button>
                <button onClick={() => handleAuthAction(() => navigate('/checkout'))} className="relative text-brand-text-dark hover:text-brand-pink transition duration-300 p-1">
                    <ShoppingBagIcon />
                    {cart && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-pink text-xs font-bold text-white">
                        1
                    </span>
                    )}
                </button>
            </div>

            <div className="hidden md:block">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="relative flex items-center space-x-2 rounded-full p-1 hover:bg-gray-200 transition">
                    {user.profilePic ? (
                      <img src={user.profilePic} alt={user.name} className="w-8 h-8 rounded-full object-cover border-2 border-brand-pink" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-pink text-white flex items-center justify-center font-bold border-2 border-brand-pink-hover">
                          {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {hasUnreadNotifications && (
                        <span className="absolute top-0.5 right-0.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                    )}
                    <span className="hidden sm:inline font-medium text-gray-700 uppercase">{user.name}</span>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <button onClick={() => handleNavigate('/profile')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-brand-pink uppercase">My Profile</button>
                      <button onClick={() => handleNavigate('/notifications')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-brand-pink uppercase">Notifications</button>
                      <button onClick={() => handleNavigate('/favorites')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-brand-pink uppercase">My Favorites</button>
                      <button onClick={() => handleNavigate('/purchases')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-brand-pink uppercase">My Purchases</button>
                      <button onClick={() => { logout(); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-brand-pink uppercase">Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                    onClick={openLoginModal}
                    className="flex items-center space-x-2 text-gray-600 hover:text-brand-pink transition-colors duration-300"
                  >
                    <UserIcon className="w-8 h-8" />
                    <div className="text-sm text-left hidden sm:block">
                      <p>Welcome :)</p>
                      <p className="font-semibold">Login or sign up</p>
                    </div>
                </button>
              )}
            </div>
            
            <div className="md:hidden flex items-center">
                 <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1 text-brand-text-dark hover:text-brand-pink transition-colors">
                    {isMobileMenuOpen ? <XIcon className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
                 </button>
            </div>

          </div>
        </nav>

        {isMobileMenuOpen && (
            <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 border-t border-gray-200">
                <div className="px-2 py-4 flex flex-col space-y-2">
                    <NavLink to="/" isMobile>Home</NavLink>
                    <NavLink to="/catalog" isMobile>Gallery</NavLink>
                    <NavLink to="/community" isMobile>Community</NavLink>
                    <NavLink to="/about" isMobile>About</NavLink>
                    <div className="border-t border-gray-200 my-2"></div>
                    {user ? (
                        <>
                            <NavLink to="/profile" isMobile>My Profile</NavLink>
                            <NavLink to="/notifications" isMobile>Notifications</NavLink>
                            <NavLink to="/purchases" isMobile>My Purchases</NavLink>
                            <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="block text-left px-4 py-2 text-lg text-gray-700 hover:bg-gray-100 hover:text-brand-pink uppercase">
                                Logout
                            </button>
                        </>
                    ) : (
                        <button onClick={() => { openLoginModal(); setIsMobileMenuOpen(false); }} className="block text-left px-4 py-2 text-lg text-gray-700 hover:bg-gray-100 hover:text-brand-pink uppercase">
                            Login / Sign Up
                        </button>
                    )}
                </div>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;
