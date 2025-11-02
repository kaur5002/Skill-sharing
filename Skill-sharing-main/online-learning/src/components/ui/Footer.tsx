import React from 'react';
import { FaFacebookF, FaTwitter, FaTiktok, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">SkillShare</h3>
            <ul>
              <li className="mb-2"><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
              <li className="mb-2"><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
              <li className="mb-2"><a href="#" className="hover:text-indigo-400 transition-colors">Press</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Community</h3>
            <ul>
              <li className="mb-2"><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
              <li className="mb-2"><a href="#" className="hover:text-indigo-400 transition-colors">Events</a></li>
              <li className="mb-2"><a href="#" className="hover:text-indigo-400 transition-colors">Affiliates</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul>
              <li className="mb-2"><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
              <li className="mb-2"><a href="#" className="hover:text-indigo-400 transition-colors">Contact Us</a></li>
              <li className="mb-2"><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-indigo-400 transition-colors" aria-label="Facebook">
                <FaFacebookF className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors" aria-label="Twitter">
                <FaTwitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors" aria-label="TikTok">
                <FaTiktok className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-indigo-400 transition-colors" aria-label="Instagram">
                <FaInstagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Skill Share, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
