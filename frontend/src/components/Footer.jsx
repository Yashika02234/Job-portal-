import React from 'react'
import { FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-100 py-6 mt-10">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-gray-700">
                <p className="text-sm">© 2025 Carevo<strong>Portal.</strong> All rights reserved.</p>

                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FaTwitter className="h-6 w-6 transition-colors duration-300 hover:text-[#6A38C2]" />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebook className="h-6 w-6 transition-colors duration-300 hover:text-[#6A38C2]" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin className="h-6 w-6 transition-colors duration-300 hover:text-[#6A38C2]" />
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
