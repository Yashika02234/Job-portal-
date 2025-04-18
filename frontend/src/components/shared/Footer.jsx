import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Facebook, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900/80 border-t border-slate-800 py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-bold text-lg mb-4">Job Portal</h3>
            <p className="text-gray-400 mb-4">
              Find your dream job or the perfect candidate for your company. 
              Our platform connects talented professionals with the right opportunities.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Twitter className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Linkedin className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Github className="h-5 w-5" />} />
              <SocialLink href="#" icon={<Facebook className="h-5 w-5" />} />
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">For Companies</h4>
            <ul className="space-y-2">
              <FooterLink href="/admin/jobs">Manage Jobs</FooterLink>
              <FooterLink href="/admin/analytics">Analytics</FooterLink>
              <FooterLink href="/admin/companies">Companies</FooterLink>
              <FooterLink href="/admin/jobs/create">Post a Job</FooterLink>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">For Job Seekers</h4>
            <ul className="space-y-2">
              <FooterLink href="/jobs">Find Jobs</FooterLink>
              <FooterLink href="/browse">Browse Categories</FooterLink>
              <FooterLink href="/profile">Your Profile</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
            </ul>
          </div>
        </div>
        
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Job Portal. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white">Contact Us</a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-gray-500 text-xs flex items-center justify-center">
          Made with <Heart className="h-3 w-3 text-red-500 mx-1" /> by Job Portal Team
        </div>
      </div>
    </footer>
  );
};

const SocialLink = ({ href, icon }) => (
  <a 
    href={href} 
    className="bg-slate-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-slate-700 transition-colors"
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </a>
);

const FooterLink = ({ href, children }) => (
  <li>
    <Link
      to={href}
      className="text-gray-400 hover:text-white transition-colors"
    >
      {children}
    </Link>
  </li>
);

export default Footer;
