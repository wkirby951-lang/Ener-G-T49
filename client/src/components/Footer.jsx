import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Ener-G-T-49</h3>
            <p className="text-sm">Your unified wellness companion. Science-backed techniques for anxiety relief, trauma processing, and emotional regulation.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Modalities</h4>
            <ul className="space-y-2 text-sm">
              <li>EMDR</li><li>EFT Tapping</li><li>Faster EFT</li><li>TFT Tapping</li>
              <li>Silva Mind Control</li><li>Havening</li><li>Deep Breathing</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>Privacy Policy</li><li>Terms of Service</li><li>Contact Us</li>
              <li>FAQ</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs">
          &copy; 2026 Ener-G-T-49. For educational purposes only. Not a substitute for professional care.
        </div>
      </div>
    </footer>
  );
}