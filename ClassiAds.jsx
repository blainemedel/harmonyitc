import React, { useState } from 'react';

/**
 * ClassiAds &mdash; Exact Replicated Website Design
 * Replicates layout, structure, and visual aesthetic using React and Tailwind CSS.
 * Strictly adheres to all exact strings and spelling from the reference design.
 */

export default function ClassiAds() {
  const [activeTab, setActiveTab] = useState('Categories > Proper');
  const [searchValue, setSearchValue] = useState('');

  // Sub-Navigation Tabs exact strings
  const subNavTabs = [
    { name: 'Categories > Proper', hasDropdown: true },
    { name: 'Extraut', hasDropdown: false },
    { name: 'Freticads', hasDropdown: false },
    { name: 'Nashines', hasDropdown: false },
  ];

  // Sidebar circular avatars & icons
  const sidebarTopAvatars = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=120&q=80',
  ];

  const sidebarBottomAvatars = [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80',
  ];

  return (
    <div className="min-h-screen bg-[#edf3f8] text-[#172a3a] font-sans antialiased relative overflow-x-hidden p-2 sm:p-6 md:p-10 flex items-center justify-center">
      {/* Organic Dappled Sunlight & Leaf Shadow Overlay Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: `radial-gradient(ellipse at 20% 10%, rgba(255,255,255,0.9) 0%, transparent 60%),
                            radial-gradient(circle at 80% 30%, rgba(186, 203, 222, 0.4) 0%, transparent 50%),
                            radial-gradient(circle at 10% 80%, rgba(170, 190, 212, 0.35) 0%, transparent 45%)`
        }}
      />

      {/* Decorative Organic Soft Shapes in Background */}
      <svg className="fixed bottom-0 right-0 w-[55vw] max-w-[850px] pointer-events-none opacity-30 z-0" viewBox="0 0 800 600" fill="none">
        <path d="M150 600C300 450 400 520 600 350C750 220 820 100 850 0V600H150Z" fill="url(#waveGrad)" />
        <defs>
          <linearGradient id="waveGrad" x1="200" y1="200" x2="800" y2="600" gradientUnits="userSpaceOnUse">
            <stop stopColor="#94b2d1" stopOpacity="0.4" />
            <stop offset="1" stopColor="#dce8f5" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Main Glassmorphic Panel Container */}
      <div className="relative z-10 w-full max-w-[1280px] bg-white/85 backdrop-blur-2xl rounded-[32px] sm:rounded-[44px] shadow-[0_20px_60px_rgba(15,35,55,0.08),0_1px_3px_rgba(15,35,55,0.03)] border border-white/90 p-4 sm:p-8 md:p-12 transition-all">
        
        {/* ------------------------------------------------------------------ */}
        {/* 1. Header Navigation                                               */}
        {/* ------------------------------------------------------------------ */}
        <header className="flex items-center justify-between gap-4 pb-8 flex-wrap">
          {/* Header Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-[#fab818] shadow-[0_2px_10px_rgba(250,184,24,0.45)] flex items-center justify-center text-slate-950 font-black text-lg border border-white/60">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="9" fill="#172a3a" />
                <path d="M12 6C8.686 6 6 8.686 6 12C6 15.314 8.686 18 12 18C13.5 18 15 17 15.8 15.5L12.5 13.5L15 10H10V8H16C16.8 9.5 17 11 17 12C17 13.2 16.6 14.3 16 15.2" stroke="#fab818" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#172a3a]">ClassiAds</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-semibold text-slate-600">
            <a href="#categories" className="hover:text-[#fab818] transition-colors">Categories</a>
            <a href="#hobs" className="hover:text-[#fab818] transition-colors">Hobs</a>
            <a href="#post" className="hover:text-[#fab818] transition-colors inline-flex items-center gap-1">
              Post <span className="text-[10px] text-slate-400">▾</span>
            </a>
            <a href="#adiat" className="hover:text-[#fab818] transition-colors inline-flex items-center gap-1">
              Adiat <span className="text-[10px] text-slate-400">▾</span>
            </a>
            <a href="#pews" className="hover:text-[#fab818] transition-colors">Pews</a>
            <a href="#wrotle" className="hover:text-[#fab818] transition-colors">Wrotle</a>
            <button aria-label="Search" className="text-slate-500 hover:text-slate-800 transition">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </nav>

          {/* Login Button */}
          <button className="bg-[#fab818] hover:bg-[#e5a710] text-[#172a3a] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-[0_4px_16px_rgba(250,184,24,0.38)] border border-white/50 transition-all hover:scale-105 active:scale-95">
            Login in
          </button>
        </header>

        {/* ------------------------------------------------------------------ */}
        {/* 2. Hero Section                                                    */}
        {/* ------------------------------------------------------------------ */}
        <section className="text-center pt-2 pb-8 max-w-3xl mx-auto px-2">
          {/* Hero Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-[46px] font-black text-[#172a3a] leading-[1.15] tracking-tight">
            Classified Ads<br />Classificational Website
          </h1>

          {/* Hero Subtext */}
          <p className="text-xs sm:text-[13px] text-slate-500 max-w-xl mx-auto mt-3.5 leading-relaxed font-medium">
            Shaire tasrted ie tespore with your durnitng repoit uhan is merit carting encolffly our der deal fildity.
          </p>

          {/* Search Input Box */}
          <div className="mt-7 max-w-lg mx-auto relative">
            <div className="bg-[#f0f4f9] rounded-full p-1.5 pl-6 flex items-center justify-between border border-white/80 shadow-[inset_3px_3px_7px_#dbe4ee,inset_-3px_-3px_7px_#ffffff]">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Cateyvories | Asanyad"
                className="bg-transparent w-full text-xs sm:text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none pr-3"
              />
              <button 
                aria-label="Search Submit"
                className="w-10 h-10 rounded-full bg-[#fab818] hover:bg-[#e5a710] text-slate-900 flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(250,184,24,0.4)] border border-white/40 transition-transform hover:scale-105 active:scale-95"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 3. Sub-Navigation Tabs Bar                                         */}
        {/* ------------------------------------------------------------------ */}
        <div className="relative mt-2 mb-8 max-w-4xl mx-auto">
          {/* Centered Decorative Blue Floating Dots Indicator */}
          <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-full shadow-sm border border-slate-100 z-10">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span className="w-1 h-1 rounded-full bg-blue-300"></span>
          </div>

          <div className="bg-[#f0f4f9]/80 rounded-full p-2 px-3 sm:px-6 flex items-center justify-between border border-white/80 shadow-[inset_2px_2px_6px_#dbe4ee,inset_-2px_-2px_6px_#ffffff] text-xs sm:text-sm font-bold text-slate-600 overflow-x-auto gap-2">
            {/* Number Pill */}
            <div className="w-7 h-7 rounded-full bg-white text-slate-700 shadow-sm flex items-center justify-center text-xs font-black border border-slate-100 flex-shrink-0">
              1)
            </div>

            {/* Sub-Nav Items */}
            <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
              {subNavTabs.map((tab) => {
                const isActive = activeTab === tab.name;
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                      isActive 
                        ? 'text-[#fab818] font-black' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{tab.name}</span>
                    {tab.hasDropdown && <span className="text-[10px]">▾</span>}
                  </button>
                );
              })}
            </div>

            {/* Right arrow */}
            <button className="text-slate-400 hover:text-slate-700 px-2 text-base font-bold flex-shrink-0">
              &gt;
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 4. Main Body: Left Sidebar Ribbon + Content Cards Grid             */}
        {/* ------------------------------------------------------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-[68px_1fr] gap-6 sm:gap-8 items-start pt-2">
          
          {/* Floating Left Vertical Sidebar Ribbon */}
          <aside className="hidden md:flex flex-col items-center gap-5 bg-white/70 backdrop-blur-md rounded-full py-5 px-2 border border-white/80 shadow-[4px_6px_20px_rgba(15,35,55,0.04),-3px_-3px_12px_#ffffff]">
            {/* Home Tag */}
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-tighter">
              &bull; Home
            </span>

            {/* Stacked Circular Profile Avatars Group 1 */}
            <div className="flex flex-col items-center gap-2.5">
              {sidebarTopAvatars.map((src, idx) => (
                <div key={idx} className="relative group cursor-pointer">
                  <img
                    src={src}
                    alt={`User Avatar ${idx + 1}`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm transition-transform group-hover:scale-110"
                  />
                  {idx === 0 && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#fab818] border border-white"></span>
                  )}
                </div>
              ))}
            </div>

            {/* Section Divider / Daskbard Tag */}
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-tighter mt-1">
              &bull; Daskbard
            </span>

            {/* Stacked Circular Profile Avatars Group 2 */}
            <div className="flex flex-col items-center gap-2.5">
              {sidebarBottomAvatars.map((src, idx) => (
                <div key={idx} className="relative group cursor-pointer">
                  <img
                    src={src}
                    alt={`Dashboard Item ${idx + 1}`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm transition-transform group-hover:scale-110"
                  />
                </div>
              ))}
            </div>

            {/* Vertical Calm Blue Dots Navigation Indicator */}
            <div className="flex flex-col items-center gap-1.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.7)]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            </div>

            {/* Bottom Floating Item Accent */}
            <div className="w-8 h-8 rounded-full bg-[#eaf2fb] flex items-center justify-center text-blue-600 shadow-inner">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="space-y-10">

            {/* ============================================================== */}
            {/* SECTION 1: Whstereating Hettes                                */}
            {/* ============================================================== */}
            <div>
              {/* Section 1 Header */}
              <div className="flex items-center justify-between pb-4 flex-wrap gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-[#172a3a] tracking-tight">
                  Whstereating Hettes
                </h2>
                
                {/* Right Filter Chips */}
                <div className="flex items-center gap-2">
                  <div className="bg-white/90 rounded-full py-1 px-3 border border-slate-100 shadow-sm flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-[#fab818] flex items-center justify-center text-[9px] font-black text-slate-900">&lambda;</span>
                    <span>Co Floiunnents</span>
                  </div>
                  <div className="bg-white/90 rounded-full py-1 px-3 border border-slate-100 shadow-sm flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <span className="w-4 h-4 rounded-full bg-[#fab818] flex items-center justify-center text-[9px] font-black text-slate-900">X</span>
                    <span>Resticod</span>
                  </div>
                </div>
              </div>

              {/* Section 1 Card Layout: Main Feature Card (Left) + 2 Cards (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
                
                {/* 1. Main Feature Card: Bback Fleadood: Frace ovn */}
                <div className="bg-white/90 backdrop-blur-md rounded-[28px] p-4 sm:p-5 border border-white shadow-[0_10px_30px_rgba(15,35,55,0.05)] flex flex-col justify-between hover:shadow-[0_16px_40px_rgba(15,35,55,0.08)] transition-all">
                  {/* Highly Rounded Image Container with Modern Vehicle */}
                  <div className="relative rounded-[22px] sm:rounded-[26px] overflow-hidden bg-slate-100 h-64 sm:h-72">
                    <img 
                      src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=80" 
                      alt="Modern silver electric commercial truck" 
                      className="w-full h-full object-cover"
                    />

                    {/* Calm Blue Indicator Light Icon Button (Top Right) */}
                    <div className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-[#38bdf8]/85 backdrop-blur-md text-white flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                        <path d="M12 2a10 10 0 0 1 10 10"></path>
                      </svg>
                    </div>

                    {/* Inset Badge (Bottom Left) */}
                    <div className="absolute bottom-3 left-3 bg-[#172a3a]/75 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      <span>&bull; v.lw</span>
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="pt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>Atleast this colons procen / verify our neat</span>
                      <span className="font-extrabold text-[#172a3a] text-sm bg-slate-100 px-2.5 py-0.5 rounded-full">$35/39 🏷️</span>
                    </div>

                    {/* Main Feature Card Title */}
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#172a3a] tracking-tight">
                      Bback Fleadood: Frace ovn
                    </h3>

                    {/* Author Profile Row */}
                    <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <img 
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" 
                          alt="Profile author"
                          className="w-6 h-6 rounded-full object-cover border border-white"
                        />
                        <span className="bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full text-[11px]">
                          &bull; Profile
                        </span>
                      </div>
                      <span className="text-slate-400 text-xs">👤 ▾</span>
                    </div>

                    {/* Footer Interactions Strip */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span className="flex items-center gap-1">Lenice &bull; 💬</span>
                      <span className="text-[#fab818] flex items-center gap-1 font-extrabold">
                        🔄 35
                      </span>
                      <span className="flex items-center gap-1">Tirest 🌐</span>
                      <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full text-slate-700">
                        👥 90
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column Stack: 2 Cards */}
                <div className="space-y-6 flex flex-col justify-between">
                  
                  {/* 2. Right Top Card: Our ling Ever Youali Priote */}
                  <div className="bg-white/90 backdrop-blur-md rounded-[28px] p-4 border border-white shadow-[0_10px_30px_rgba(15,35,55,0.05)] hover:shadow-[0_16px_40px_rgba(15,35,55,0.08)] transition-all">
                    <div className="relative rounded-[20px] overflow-hidden bg-slate-100 h-36">
                      <img 
                        src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=700&q=80" 
                        alt="Clean workspace with desk and chair" 
                        className="w-full h-full object-cover"
                      />
                      {/* Calm Blue Indicator Badge */}
                      <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#38bdf8]/85 backdrop-blur-md text-white flex items-center justify-center text-xs shadow-md">
                        &bull;
                      </div>
                      {/* Price Pill */}
                      <span className="absolute bottom-2.5 left-2.5 bg-[#172a3a]/80 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">
                        $110
                      </span>
                    </div>

                    <div className="pt-3">
                      {/* Right Top Card Title */}
                      <h4 className="font-extrabold text-[#172a3a] text-sm sm:text-base leading-snug">
                        Our ling Ever Youali Priote
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Dissuaside vetting roours</p>
                      <div className="text-[10px] text-slate-400 font-bold mt-1">Banne - 12:20</div>
                    </div>
                  </div>

                  {/* 3. Right Middle Card: You car Caasse Carlifiy */}
                  <div className="bg-white/90 backdrop-blur-md rounded-[28px] p-4 border border-white shadow-[0_10px_30px_rgba(15,35,55,0.05)] hover:shadow-[0_16px_40px_rgba(15,35,55,0.08)] transition-all">
                    <div className="relative rounded-[20px] overflow-hidden bg-slate-100 h-36">
                      <img 
                        src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=700&q=80" 
                        alt="Living room interior with blue sofa and armchair" 
                        className="w-full h-full object-cover"
                      />
                      {/* Price Pill */}
                      <span className="absolute bottom-2.5 left-2.5 bg-[#172a3a]/80 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">
                        $75
                      </span>
                    </div>

                    <div className="pt-3">
                      {/* Right Middle Card Title */}
                      <h4 className="font-extrabold text-[#172a3a] text-sm sm:text-base leading-snug">
                        You car Caasse Carlifiy
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium line-clamp-1">
                        Venenat colkofi tiey ensembt sedos ulenceu uyt calfeup yroit
                      </p>
                      <div className="text-[10px] text-slate-400 font-bold mt-1">Banne - 21:30</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* SECTION 2: Lesskev Tokls                                      */}
            {/* ============================================================== */}
            <div>
              {/* Section 2 Header */}
              <div className="flex items-center justify-between pb-4 flex-wrap gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-[#172a3a] tracking-tight">
                  Lesskev Tokls
                </h2>
                
                {/* Control Action Badges */}
                <div className="flex items-center gap-1.5 text-slate-400">
                  <button className="w-7 h-7 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center text-xs hover:text-slate-700">
                    ⊞
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center text-xs hover:text-slate-700">
                    ⊟
                  </button>
                </div>
              </div>

              {/* Section 2 Card Layout: 2 Equal-Width Bottom Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 4. Bottom Left Card: Find Flot UK You Ivery */}
                <div className="bg-white/90 backdrop-blur-md rounded-[28px] p-4 sm:p-5 border border-white shadow-[0_10px_30px_rgba(15,35,55,0.05)] hover:shadow-[0_16px_40px_rgba(15,35,55,0.08)] transition-all flex flex-col justify-between">
                  <div className="relative rounded-[22px] overflow-hidden bg-slate-100 h-48 sm:h-52">
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=700&q=80" 
                      alt="Modern collaborative workspace team" 
                      className="w-full h-full object-cover"
                    />
                    {/* Badge */}
                    <span className="absolute bottom-3 left-3 bg-[#172a3a]/80 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      &bull; 2000
                    </span>
                  </div>

                  <div className="pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      {/* Bottom Left Card Title */}
                      <h3 className="font-extrabold text-[#172a3a] text-base sm:text-lg tracking-tight">
                        Find Flot UK You Ivery
                      </h3>
                      <span className="font-black text-[#172a3a] text-xs sm:text-sm bg-slate-100 px-2.5 py-0.5 rounded-full">$300 🏷️</span>
                    </div>

                    <p className="text-xs text-slate-400 font-medium line-clamp-2">
                      Bsur cord anettietues pfiens can cropty Cattion indorr poltur
                    </p>

                    {/* Footer Row */}
                    <div className="flex items-center justify-between pt-2 text-xs text-slate-500 font-bold border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" 
                          alt="Author"
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="w-4 h-4 rounded-full bg-[#fab818] flex items-center justify-center text-[9px] font-black text-slate-900">3</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">600 v4 ▾</span>
                    </div>
                  </div>
                </div>

                {/* 5. Bottom Right Card: Our Balaey Tratarine! */}
                <div className="bg-white/90 backdrop-blur-md rounded-[28px] p-4 sm:p-5 border border-white shadow-[0_10px_30px_rgba(15,35,55,0.05)] hover:shadow-[0_16px_40px_rgba(15,35,55,0.08)] transition-all flex flex-col justify-between">
                  <div className="relative rounded-[22px] overflow-hidden bg-slate-100 h-48 sm:h-52">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80" 
                      alt="Young professional holding laptop device" 
                      className="w-full h-full object-cover"
                    />
                    {/* Calm Blue Indicator Light (Top Right) */}
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#38bdf8]/85 backdrop-blur-md text-white flex items-center justify-center shadow-md">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    {/* Bottom Right Card Title */}
                    <h3 className="font-extrabold text-[#172a3a] text-base sm:text-lg tracking-tight">
                      Our Balaey Tratarine!
                    </h3>

                    <p className="text-xs text-slate-400 font-medium line-clamp-2">
                      Pinte negurttubater fwealas for process tumosidie miaccrettt
                    </p>

                    <div className="text-[10px] text-slate-400 font-bold">Banne - 1:00</div>

                    {/* Bright Sunny Yellow Accent Action Button */}
                    <div className="pt-2">
                      <button className="w-full sm:w-auto bg-[#fab818] hover:bg-[#e5a710] text-[#172a3a] font-black text-xs px-6 py-2 rounded-full shadow-[0_4px_14px_rgba(250,184,24,0.35)] border border-white/50 transition-all hover:scale-105 active:scale-95">
                        Chalerterd
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
