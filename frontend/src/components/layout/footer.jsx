import React from "react";
import { Link } from "react-router-dom";
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  Facebook, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ArrowUpRight 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-8 lg:pt-24 pb-20 lg:pb-12 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Top Section: CTA & Logo */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-16 mb-8 lg:mb-24">
          <div className="max-w-xl">
            <Link to="/" className="flex items-center gap-1 group mb-6">
              <span className="text-2xl font-black tracking-tighter transition-colors group-hover:text-accent">PIXEL</span>
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse self-end mb-1.5"></span>
            </Link>
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter leading-tight mb-4 text-white">
                Redefining the digital boundary <span className="text-gray-700">/</span> 2026 Edition.
            </h2>
            <p className="text-gray-500 font-medium text-xs max-w-sm leading-relaxed">
                Precision hardware for the digital avant-garde. Engineered in the future, delivered today.
            </p>
          </div>

          <div className="w-full lg:w-96 hidden md:block">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Protocol News</h3>
            <div className="relative group">
                <input
                    type="email"
                    placeholder="Enter communication ID (Email)..."
                    className="w-full bg-gray-900/50 border border-gray-800 px-6 py-5 rounded-[2rem] outline-none focus:ring-4 focus:ring-accent/10 transition-all font-medium pr-32"
                />
                <button className="absolute right-2 top-2 bottom-2 px-6 bg-white text-black rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-black transition-all">
                    Subscribe
                </button>
            </div>
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-12 mb-8 lg:mb-24">
          <FooterSection title="Hardware Archives">
            <FooterLink to="/Product">Mobile Units</FooterLink>
            <FooterLink to="/Product">Wrist Interfaces</FooterLink>
            <FooterLink to="/Product">Audio Output</FooterLink>
            <FooterLink to="/Product">Gaming Modules</FooterLink>
          </FooterSection>

          <FooterSection title="Corporate Body" className="hidden md:block">
            <FooterLink to="/">About Nexus</FooterLink>
            <FooterLink to="/">Innovation Labs</FooterLink>
            <FooterLink to="/">Sustainability</FooterLink>
            <FooterLink to="/">Press Protocol</FooterLink>
          </FooterSection>

          <FooterSection title="Support Center" className="hidden md:block">
            <FooterLink to="/">Encryption Policy</FooterLink>
            <FooterLink to="/">Logistics Tracker</FooterLink>
            <FooterLink to="/">Legacy Returns</FooterLink>
            <FooterLink to="/">Maintenance</FooterLink>
          </FooterSection>

          <FooterSection title="Connect Interface">
            <div className="flex gap-4 pt-2">
                <SocialIcon icon={<Instagram size={20} />} />
                <SocialIcon icon={<Twitter size={20} />} />
                <SocialIcon icon={<Youtube size={20} />} />
                <SocialIcon icon={<Facebook size={20} />} />
            </div>
            <div className="mt-6 lg:mt-8 space-y-3">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} className="text-accent" /> Encrypted Support
                </p>
                <p className="text-[10px] font-black tracking-tight text-white hover:text-accent transition-colors cursor-pointer">
                    admin@pixelhardware.io
                </p>
            </div>
          </FooterSection>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 lg:pt-12 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">
            © 2026 PIXEL E-COMMERCE NODE. ALL SYSTEM RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Privacy Protocol</Link>
            <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Usage Terms</Link>
            <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Safety Guide</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({ title, children, className = "" }) {
  return (
    <div className={`space-y-4 lg:space-y-6 ${className}`}>
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{title}</h3>
      <div className="flex flex-col gap-3 lg:gap-4">
        {children}
      </div>
    </div>
  );
}

function FooterLink({ to, children }) {
    return (
        <Link to={to} className="text-gray-500 font-bold text-[11px] hover:text-white transition-all hover:translate-x-1 inline-flex items-center gap-2 group uppercase tracking-wider">
             {children} <ArrowUpRight size={10} className=" opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
    );
}

function SocialIcon({ icon }) {
    return (
        <a href="#" className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all hover:-translate-y-1">
            {icon}
        </a>
    );
}