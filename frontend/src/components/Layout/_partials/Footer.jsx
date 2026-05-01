import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="text-gray-600 text-sm text-center md:text-left mb-2 md:mb-0">
          <p>&copy; {new Date().getFullYear()} GeoProcess - Symfony + React Dashboard</p>
          <p className="text-xs text-gray-500 mt-1">
            MariaDB 12.0.2 • Redis • Python Workers • TailwindCSS
          </p>
        </div>
        <div className="flex justify-center md:justify-end space-x-4">
          <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
            Documentation
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
            Support
          </a>
          <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;