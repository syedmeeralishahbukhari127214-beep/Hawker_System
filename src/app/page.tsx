"use client";
import React, { ReactNode } from "react";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaMobileAlt,
  FaChartPie,
  FaRocket,
  FaStore,
  FaQrcode,
  FaTruck,
  FaUserPlus,
  FaSignInAlt,
  FaLightbulb,
  FaShieldAlt,
  FaSmileBeam,
  FaClock,
  FaSatellite,
  FaCogs,
  FaSignal,
} from "react-icons/fa";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  desc: string;
}

const FeatureCard = ({ icon, title, desc }: FeatureCardProps) => (
  <div className="animate-fadeUp bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-2xl transition-all duration-500 hover:border-pink-500/50 hover:bg-gray-800/50 hover:-translate-y-2 group">
    <div className="text-pink-500 text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 bg-pink-500/10 w-fit p-3 rounded-xl">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
  </div>
);

const BenefitItem = ({ icon, title, text }: { icon: ReactNode; title: string; text: string }) => (
  <div className="flex gap-4 p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300 animate-fadeUp">
    <div className="text-pink-500 text-2xl mt-1">{icon}</div>
    <div>
      <h4 className="text-white font-bold mb-1">{title}</h4>
      <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
    </div>
  </div>
);

export default function LandingPage() {
  return (
    <div className="relative bg-black min-h-screen text-gray-200 selection:bg-pink-500 selection:text-white overflow-x-hidden">

      {/* Animated Glow Blobs */}
      <div className="absolute w-[8000px] h-[600px] bg-pink-600/20 rounded-full blur-3xl animate-pulse -top-40 -left-40"></div>
      <div className="absolute w-[8000px] h-[600px] bg-purple-700/20 rounded-full blur-3xl animate-pulse bottom-0 right-0"></div>

      {/* Top Navigation */}
      <nav className="absolute top-0 w-full z-50 px-6 py-6 animate-fadeDown">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-black italic tracking-tighter text-white">
            STREET<span className="text-pink-500">HAWKER</span>
          </div>
          <Link
            href="/login"
            className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 pt-40 pb-20 text-center animate-fadeUp">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-pink-500/20 rounded-full bg-pink-500/5 text-pink-400 text-xs font-bold uppercase tracking-[0.2em]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
          </span>
          System Online
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter italic">
          STREET
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-pink-500 to-purple-700 animate-gradientMove">
            HAWKER
          </span>
        </h1>

        <h2 className="text-2xl md:text-3xl font-medium text-gray-400 mb-8 tracking-tight max-w-3xl mx-auto">
          The Operating System for the <span className="text-white">Modern Street Vendor.</span>
        </h2>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-20">
          <Link
            href="/signup"
            className="bg-pink-600 hover:bg-pink-500 text-white px-10 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_20px_rgba(219,39,119,0.4)] hover:scale-105 active:scale-95"
          >
            <FaUserPlus /> Register Now
          </Link>

          <Link
            href="/login"
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-10 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all backdrop-blur-md hover:scale-105"
          >
            <FaSignInAlt className="text-pink-500" /> Login
          </Link>
        </div>
      </section>

      {/* Visual Gallery */}
      <section className="pb-32 px-4 animate-fadeUp">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[ "photo-1555396273-367ea4eb4db5","photo-1565123409695-7b5ef63a2efb","photo-1533900298318-6b8da08a523e","photo-1504674900247-0877df9cc836","photo-1498654896293-37aacf113fd9","photo-1512132411229-c30391241dd8" ].map((id, i) => (
            <div
              key={i}
              className={`h-48 rounded-2xl overflow-hidden border border-gray-800 hover:scale-105 transition-transform duration-500 ${i % 2 !== 0 ? "mt-8" : ""}`}
            >
              <img
                src={`https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=400`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                alt="Gallery"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Core Technology */}
 <section className="max-w-7xl mx-auto px-4 py-32 animate-fadeUp bg-gray-900/30 rounded-3xl border border-gray-800">        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-2 italic tracking-tighter uppercase">
            Core Technology
          </h2>
          <div className="h-1 w-20 bg-pink-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<FaMapMarkerAlt />}
            title="Dynamic Geo-fencing"
            desc="Broadcast your live location to customers nearby only when you&apos;re ready to sell."
          />
          <FeatureCard
            icon={<FaQrcode />}
            title="Digital Payments"
            desc="Integrated QR payments for quick, secure, cashless transactions."
          />
          <FeatureCard
            icon={<FaChartPie />}
            title="Hustle Analytics"
            desc="Track earnings and discover high-traffic zones to maximize revenue."
          />
        </div>
      </section>

      {/* Benefits Section */}
 <section className="max-w-7xl mx-auto px-4 py-32 animate-fadeUp bg-gray-900/30 rounded-3xl border border-gray-800">        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-2 italic tracking-tighter uppercase">
              Why Choose StreetHawker?
            </h2>
            <div className="h-1 w-20 bg-pink-600 mx-auto mb-6"></div>
            <p className="text-gray-400 max-w-2xl mx-auto italic">
              Boost your sales, stay visible, and manage your hustle efficiently.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BenefitItem icon={<FaClock />} title="Save Time" text="Receive instant notifications when customers are nearby." />
            <BenefitItem icon={<FaShieldAlt />} title="Secure Payments" text="Digital transactions settle safely to your account." />
            <BenefitItem icon={<FaLightbulb />} title="Smart Insights" text="Get analytics for best-selling items and peak hours." />
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="max-w-7xl mx-auto px-4 py-32 animate-fadeUp bg-gray-900/30 rounded-3xl border border-gray-800">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-2 italic tracking-tighter uppercase">
            About StreetHawker
          </h2>
          <div className="h-1 w-20 bg-pink-600 mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-3xl mx-auto italic">
            StreetHawker is a comprehensive operating system designed for modern street vendors. Our platform empowers hawkers to manage their products, track orders, optimize their location, and connect with customers—all from a single dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl hover:bg-gray-800/50 hover:border-pink-500/50 transition-all duration-300 animate-fadeUp">
            <h3 className="text-pink-500 text-xl font-bold mb-2">Efficient Product Management</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Add, update, or remove products in real-time. Manage inventory seamlessly to keep your business running smoothly.
            </p>
          </div>
          <div className="p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl hover:bg-gray-800/50 hover:border-pink-500/50 transition-all duration-300 animate-fadeUp">
            <h3 className="text-pink-500 text-xl font-bold mb-2">Smart Location Tracking</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Let customers know your live location when you&apos;re ready to sell. Optimize your spot to attract more nearby buyers.
            </p>
          </div>
          <div className="p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl hover:bg-gray-800/50 hover:border-pink-500/50 transition-all duration-300 animate-fadeUp">
            <h3 className="text-pink-500 text-xl font-bold mb-2">Integrated Payments & Analytics</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Receive cashless payments instantly and analyze your sales performance. Make data-driven decisions to increase revenue.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
 <section className="max-w-7xl mx-auto px-4 py-32 animate-fadeUp bg-gray-900/30 rounded-3xl border border-gray-800">        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-2 italic tracking-tighter uppercase">
            Meet the Team
          </h2>
          <div className="h-1 w-20 bg-pink-600 mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto italic">
            The brilliant minds behind StreetHawker.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {["Meer Ali", "Muhammad Omar", "Sami Abbasi", "Shad Muhammad"].map((name, i) => (
            <div key={i} className="p-6 bg-gray-900/40 rounded-2xl hover:bg-gray-800/50 transition-all duration-300 animate-fadeUp">
              <div className="text-pink-500 text-4xl mb-4">👤</div>
              <h3 className="text-white font-bold text-xl">{name}</h3>
              <p className="text-gray-400 mt-1">Team Member</p>
            </div>
          ))}
        </div>
      </section>
      {/* Developer Message Section */}
<section className="max-w-7xl mx-auto px-4 py-32 animate-fadeUp bg-gray-900/30 rounded-3xl border border-gray-800">        <div className="text-center mb-16">
    <h2 className="text-4xl font-bold text-white mb-6 italic tracking-tighter uppercase">
      A Message From The Developer Team
    </h2>
    <div className="h-1 w-20 bg-pink-600 mx-auto mb-10"></div>

    <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto mb-6">
      StreetHawker was built with one simple mission — to digitally empower street vendors 
      and make it easier for customers to discover and connect with them in real time.
    </p>

    <div className="grid md:grid-cols-2 gap-8 mt-12 text-left">
      
      {/* For Customers */}
      <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-pink-500/40 transition-all">
        <h3 className="text-pink-500 font-bold text-xl mb-3">For Customers</h3>
        <ul className="text-gray-400 text-sm space-y-3">
          <li>• Find nearby street vendors instantly with live location updates.</li>
          <li>• Chat directly with hawkers before visiting.</li>
          <li>• Make secure digital payments with ease.</li>
          <li>• Save time by knowing exactly where your favorite vendor is.</li>
        </ul>
      </div>

      {/* For Hawkers */}
      <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 hover:border-pink-500/40 transition-all">
        <h3 className="text-pink-500 font-bold text-xl mb-3">For Hawkers</h3>
        <ul className="text-gray-400 text-sm space-y-3">
          <li>• Broadcast your location only when you&apos;re ready to sell.</li>
          <li>• Manage products and prices easily from your dashboard.</li>
          <li>• Track earnings and business performance with analytics.</li>
          <li>• Build customer trust through digital interaction.</li>
        </ul>
      </div>
    </div>

    <p className="text-gray-400 mt-12 italic">
      — Built with passion to modernize street businesses and support local entrepreneurship.
    </p>
  </div>
</section>


      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-4 py-32 text-center animate-fadeUp">
        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 italic">
          READY TO HUSTLE?
        </h2>
        <p className="text-gray-400 mb-12 max-w-xl mx-auto text-lg italic">
          Join 1,200+ vendors transforming their street business.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 bg-[length:200%_200%] animate-gradientMove text-white px-12 py-5 rounded-2xl font-black transition-all uppercase tracking-tighter text-xl hover:scale-105"
        >
          Get Started For Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-900 text-center">
        <p className="text-gray-600 text-sm italic">
          © 2026 StreetHawker System. All Rights Reserved.
        </p>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-fadeUp { animation: fadeUp 1s ease-out forwards; }
        .animate-fadeDown { animation: fadeDown 0.8s ease-out forwards; }
        .animate-gradientMove { animation: gradientMove 6s ease infinite; }
      `}</style>
    </div>
  );
}
