import { FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-[#0D021F] py-6 mt-10 border-t border-[#1f1b2e]">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-300">
                <p className="text-sm text-center md:text-left">
                    © 2025 <span className="font-semibold text-white">CarevoPortal</span>. All rights reserved.
                </p>

                <div className="flex gap-5 mt-4 md:mt-0">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <FaTwitter className="h-6 w-6 hover:text-[#7E3AF2] transition-all duration-300 hover:scale-110" />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <FaFacebook className="h-6 w-6 hover:text-[#7E3AF2] transition-all duration-300 hover:scale-110" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <FaLinkedin className="h-6 w-6 hover:text-[#7E3AF2] transition-all duration-300 hover:scale-110" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
