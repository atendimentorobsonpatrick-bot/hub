
import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-6 py-8 text-center text-gray-500">
        <div className="flex justify-center space-x-6 mb-6">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-pink transition-colors duration-300">
                <InstagramIcon className="w-7 h-7" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-pink transition-colors duration-300">
                <FacebookIcon className="w-7 h-7" />
            </a>
        </div>
        <p className="font-bold text-lg text-brand-text-dark mb-2 uppercase">AURA</p>
        <div className="flex justify-center space-x-6 mb-4 lowercase">
          <a href="#" className="hover:text-brand-pink transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-brand-pink transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-brand-pink transition-colors">Contact Us</a>
        </div>
        <p className="lowercase">&copy; {new Date().getFullYear()} AURA. All rights reserved. | <Link to="/admin/reviews" className="hover:text-brand-pink text-xs">Manage Reviews</Link></p>
        <p className="text-xs mt-4 lowercase">
          this platform is intended for users 18 years of age and older.
        </p>
      </div>
    </footer>
  );
};

export default Footer;