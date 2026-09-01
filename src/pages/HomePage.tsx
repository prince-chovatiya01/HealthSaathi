import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Stethoscope, Calendar, FileText, Pill, Leaf,
  Shield, Globe, Star, ArrowRight, CheckCircle, Activity,
  Users, Clock
} from 'lucide-react';
import { useHealthSaathi } from '../context/HealthSaathiContext';

const features = [
  { icon: Stethoscope, title: 'Expert Doctors',       desc: 'Book consultations with verified, experienced specialists across all major medical fields.' },
  { icon: Calendar,    title: 'Easy Appointments',    desc: 'Schedule, manage and track your appointments with real-time availability and instant confirmation.' },
  { icon: FileText,    title: 'Health Records',       desc: 'Store prescriptions, lab reports, X-rays and all medical documents securely in one place.' },
  { icon: Pill,        title: 'Medicine Tracker',     desc: 'Never miss a dose. Track your medications, set reminders and monitor adherence.' },
  { icon: Leaf,        title: 'Wellness Hub',         desc: 'Mood tracking, water intake, wellness tips and personalized health insights.' },
  { icon: Activity,   title: 'Symptom Checker',      desc: 'Assess your symptoms with our intelligent checker and get guidance on next steps.' },
];

const stats = [
  { value: '50+',  label: 'Doctors',          icon: Stethoscope },
  { value: '5000+',label: 'Patients Served',  icon: Users },
  { value: '12+',  label: 'Specializations',  icon: Star },
  { value: '24/7', label: 'Support',          icon: Clock },
];

const testimonials = [
  { name: 'Priya Sharma',  role: 'Patient', text: 'HealthSaathi made it so easy to find a cardiologist and book an appointment the same day. The whole experience was seamless.', rating: 5 },
  { name: 'Rahul Mehta',   role: 'Patient', text: 'I love how I can track all my medications and get reminders. My health records are all in one place now.', rating: 5 },
  { name: 'Anita Patel',   role: 'Patient', text: 'The symptom checker helped me understand when I needed urgent care. The doctors are very professional and caring.', rating: 5 },
];

const HomePage = () => {
  const { isAuthenticated } = useHealthSaathi();

  return (
    <div className="w-full">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-warm" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-teal-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 text-white text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
                <Shield className="w-4 h-4" /> Trusted Healthcare Platform
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Your health,<br />
                <span className="text-teal-300">always first.</span>
              </h1>
              <p className="text-lg text-white/80 mb-8 leading-relaxed max-w-lg">
                HealthSaathi connects you to verified doctors, manages your medical history,
                and keeps you on top of your wellness — all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={isAuthenticated ? '/dashboard' : '/signup'}
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all text-base">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#services"
                  className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-8 py-3.5 rounded-2xl transition-all text-base backdrop-blur-sm">
                  See How It Works
                </a>
              </div>
              <div className="flex flex-wrap gap-6 mt-8">
                {['Free to join', 'Verified doctors', 'Private & secure'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-white/80 text-sm">
                    <CheckCircle className="w-4 h-4 text-teal-300" /> {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero stats */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-white">{value}</p>
                  <p className="text-white/70 text-sm font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats (mobile) ── */}
      <section className="lg:hidden bg-primary-700 py-8 px-4">
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center text-white">
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-white/70 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-2">What We Offer</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Everything for your health</h2>
            <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
              HealthSaathi provides comprehensive healthcare services designed to make quality care accessible to everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="hs-card p-6 group hover:shadow-card-md transition-all duration-200 hover:-translate-y-0.5">
                <div className="w-12 h-12 gradient-health rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-2">Simple & Fast</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">How HealthSaathi Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up in seconds with just your phone number. No paperwork required.' },
              { step: '02', title: 'Find Your Doctor', desc: 'Browse verified specialists by specialization, experience, and availability.' },
              { step: '03', title: 'Book & Consult',  desc: 'Schedule an appointment, get reminders, and rate your experience after.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 gradient-health rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-white font-bold text-xl">{step}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wide mb-2">Patient Stories</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Trusted by thousands</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, rating }) => (
              <div key={name} className="hs-card p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-health rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{name}</p>
                    <p className="text-slate-500 text-xs">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-warm" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-white" fill="white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to take control of your health?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join HealthSaathi today — free, fast, and trusted by patients across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-bold px-8 py-3.5 rounded-2xl shadow-lg transition-all text-base">
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-8 py-3.5 rounded-2xl transition-all text-base backdrop-blur-sm">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 gradient-health rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <div>
                <p className="font-bold text-white">HealthSaathi</p>
                <p className="text-slate-400 text-xs">Healthcare Portal</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
              <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
              <Link to="/signup" className="hover:text-white transition-colors">Register</Link>
              <Link to="/doctors" className="hover:text-white transition-colors">Find Doctors</Link>
            </div>
            <p className="text-slate-500 text-sm">© 2025 HealthSaathi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;