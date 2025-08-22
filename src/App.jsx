import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chart } from "chart.js/auto"; // @tweakable Chart.js ESM alias (mapped to auto build via import map)
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/* @tweakable Font Awesome class for the Website/Portfolio icon on the About page */
const aboutWebsiteIconClass = "fas fa-globe";
/* @tweakable Font Awesome class for the WhatsApp icon on the About page */
const aboutWhatsAppIconClass = "fab fa-whatsapp";
/* @tweakable Font Awesome class for the Call/Phone icon on the About page */
const aboutPhoneIconClass = "fas fa-phone";
/* @tweakable Phone number used for WhatsApp and Call links (E.164 format preferred) */
const aboutPhoneNumber = "+263779496008";
/* @tweakable Default prefilled WhatsApp message */
const aboutWhatsAppMessage = "Hi Fidel, I'm interested in the Solar System Calculator.";

/* @tweakable CSS class that hides the horizontal nav links when hamburger is active */
const hideTopLinksClass = "hide-page-links-on-phones";

const App = () => {
    const [page, setPage] = useState('calculator');
    const [isCustomCalcOpen, setIsCustomCalcOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    const navClasses = "px-4 py-2 rounded-md hover:bg-blue-500 hover:text-white transition-colors duration-300 cursor-pointer";
    const activeNavClasses = "bg-blue-600 text-white";

    /* @tweakable Tailwind/CSS classes controlling hamburger visibility (phones ≤ 375px only) */
    const hamburgerVisibilityClasses = "show-hamburger-phones-only";
    /* @tweakable Icon size class for the hamburger button */
    const hamburgerIconSize = "fa-lg";
    /* @tweakable Width class for the dropdown menu */
    const hamburgerMenuWidthClass = "w-48";
    /* @tweakable Visibility classes for phone-only menu content (renders on < md) */
    const phoneMenuVisibility = "block md:hidden";
    /* @tweakable Visibility classes for tablet-only menu content (renders on md and < lg) */
    const tabletMenuVisibility = "hidden md:block lg:hidden";
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const IconNavLink = ({ href, iconClass, label, onClick }) => (
        <a href={href} onClick={onClick} className="icon-nav-item">
            <div className="icon"><i className={`fas ${iconClass} fa-lg`}></i></div>
            <span className="label font-semibold">{label}</span>
        </a>
    );

    const handleCalcClick = (e) => {
        e.preventDefault();
        document.getElementById('calculate-button')?.click();
    };

    const handleCommonSetupsClick = (e) => {
        e.preventDefault();
        const btn = document.getElementById('packages-cta');
        if (btn) btn.click();
        setTimeout(() => document.getElementById('common-setups')?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
             {/* Top Navbar for all screens */}
            <nav className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center w-full z-20 sticky top-0">
                <div className="flex items-center space-x-8 relative">
                    {/* Hamburger before logo */}
                    <button
                      className={`${hamburgerVisibilityClasses} items-center justify-center mr-2 text-gray-700 dark:text-gray-200`}
                      aria-label="Open navigation menu"
                      onClick={() => setIsMobileMenuOpen(v => !v)}
                    >
                      <i className={`fas fa-bars ${hamburgerIconSize}`}></i>
                    </button>
                    <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">SSC</h1>
                    <div className={`flex space-x-2 ${hideTopLinksClass}`}>
                        <button onClick={() => setPage('calculator')} className={`${navClasses} ${page === 'calculator' && activeNavClasses}`}>Calculator</button>
                        <button onClick={() => setPage('about')} className={`${navClasses} ${page === 'about' && activeNavClasses}`}>About</button>
                    </div>
                    {/* Mobile dropdown */}
                    {isMobileMenuOpen && (
                      <div className={`absolute top-full left-0 mt-2 ${hamburgerMenuWidthClass} bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden`}>
                        {page === 'about' ? (
                          <>
                            <button
                              onClick={() => { setPage('calculator'); setIsMobileMenuOpen(false); }}
                              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${page === 'calculator' ? 'font-semibold' : ''}`}
                            >
                              <i className="fas fa-calculator mr-2"></i> Calculator
                            </button>
                            <button
                              onClick={() => { setPage('about'); setIsMobileMenuOpen(false); }}
                              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${page === 'about' ? 'font-semibold' : ''}`}
                            >
                              <i className="fas fa-circle-info mr-2"></i> About
                            </button>
                          </>
                        ) : (
                          <>
                            {/* Phone: show horizontal (page) + vertical (section) links */}
                            <div className={phoneMenuVisibility}>
                              <button
                                onClick={() => { setPage('calculator'); setIsMobileMenuOpen(false); }}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${page === 'calculator' ? 'font-semibold' : ''}`}
                              >
                                <i className="fas fa-calculator mr-2"></i> Calculator
                              </button>
                              <button
                                onClick={() => { setPage('about'); setIsMobileMenuOpen(false); }}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${page === 'about' ? 'font-semibold' : ''}`}
                              >
                                <i className="fas fa-circle-info mr-2"></i> About
                              </button>
                              <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                              {/* Vertical (section) links */}
                              <button onClick={(e) => { handleCommonSetupsClick(e); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <i className="fas fa-layer-group mr-2"></i> {commonSetupsNavLabel}
                              </button>
                              <a href="#load-analysis" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"><i className="fas fa-bolt mr-2"></i> Load Analysis</a>
                              <a href="#inverter-sizing" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"><i className="fas fa-wave-square mr-2"></i> Inverter Sizing</a>
                              <a href="#battery-sizing" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"><i className="fas fa-car-battery mr-2"></i> Battery Sizing</a>
                              <a href="#solar-panel-sizing" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"><i className="fas fa-solar-panel mr-2"></i> Solar Panel Sizing</a>
                              <a href="#controller-sizing" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"><i className="fas fa-gamepad mr-2"></i> Charge Controller</a>
                              <button onClick={(e) => { handleCalcClick(e); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <i className="fas fa-calculator mr-2"></i> Calc System
                              </button>
                              <a href="#output-summary" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"><i className="fas fa-chart-pie mr-2"></i> Output Summary</a>
                            </div>
                            {/* Tablet: show only vertical (section) links */}
                            <div className={tabletMenuVisibility}>
                              <button onClick={(e) => { handleCommonSetupsClick(e); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <i className="fas fa-layer-group mr-2"></i> {commonSetupsNavLabel}
                              </button>
                              <a href="#load-analysis" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"><i className="fas fa-bolt mr-2"></i> Load Analysis</a>
                              <a href="#inverter-sizing" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"><i className="fas fa-wave-square mr-2"></i> Inverter Sizing</a>
                              <a href="#battery-sizing" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"><i className="fas fa-car-battery mr-2"></i> Battery Sizing</a>
                              <a href="#solar-panel-sizing" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"><i className="fas fa-solar-panel mr-2"></i> Solar Panel Sizing</a>
                              <a href="#controller-sizing" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"><i className="fas fa-gamepad mr-2"></i> Charge Controller</a>
                              <button onClick={(e) => { handleCalcClick(e); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <i className="fas fa-calculator mr-2"></i> Calc System
                              </button>
                              <a href="#output-summary" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"><i className="fas fa-chart-pie mr-2"></i> Output Summary</a>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <label className="theme-switch">
                        <input type="checkbox" checked={isDark} onChange={toggleTheme} />
                        <span className="slider"></span>
                    </label>
                </div>
            </nav>

            <div className="flex">
                 {/* Left Vertical Icon Navbar */}
                <aside className={`ssc-aside flex flex-col w-20 hover:w-64 transition-all duration-300 bg-white dark:bg-gray-800 p-4 shadow-lg flex-shrink-0 fixed top-0 h-full z-10 pt-20 ${page === 'about' && !showVerticalNavOnAbout ? 'hidden' : ''}`}>
                     <nav className="flex flex-col space-y-4 mb-8 mt-4">
                        {/* Page links removed from vertical nav */}
                    </nav>
                    {page === 'calculator' && (
                        <>
                            <h2 className="text-lg font-semibold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2 flex items-center justify-between">
                                <i className="fas fa-stream icon-only-label"></i>
                                <span className="label">Sections</span>
                            </h2>
                            <nav className="flex flex-col space-y-2">
                                <IconNavLink href="#common-setups" iconClass="fa-layer-group" label={commonSetupsNavLabel} onClick={handleCommonSetupsClick} />
                                <IconNavLink href="#load-analysis" iconClass="fa-bolt" label="Load Analysis" />
                                <IconNavLink href="#inverter-sizing" iconClass="fa-wave-square" label="Inverter Sizing" />
                                <IconNavLink href="#battery-sizing" iconClass="fa-car-battery" label="Battery Sizing" />
                                <IconNavLink href="#solar-panel-sizing" iconClass="fa-solar-panel" label="Solar Panel Sizing" />
                                <IconNavLink href="#controller-sizing" iconClass="fa-gamepad" label="Charge Controller" />
                                <IconNavLink href="#" onClick={handleCalcClick} iconClass="fa-calculator" label="Calc System" />
                                <IconNavLink href="#output-summary" iconClass="fa-chart-pie" label="Output Summary" />
                            </nav>
                        </>
                    )}
                </aside>

                {/* Main Content */}
                <main className="ssc-main flex-1 p-4 sm:p-6 md:p-10 ml-20">
                    {page === 'calculator' ? <CalculatorPage setIsCustomCalcOpen={setIsCustomCalcOpen} /> : <AboutPage />}
                </main>
            </div>
            <Footer />
            <CustomSystemCheckModal 
                isOpen={isCustomCalcOpen} 
                onClose={() => setIsCustomCalcOpen(false)}
                label="Close"
            />
        </div>
    );
};

const AboutPage = () => {
    return (
        <div id="about-page" className="space-y-8">
            <div className="about-card bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-4 border-b pb-2">How It Works</h2>
                <p className="mb-4">The Solar System Calculator (SSC) is designed to simplify the process of sizing a residential off-grid solar power system. It uses standard industry formulas to provide reliable estimates for your power needs.</p>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-semibold">1. Load Analysis</h3>
                        <p className="mb-1">We calculate your total daily energy consumption in Watt-hours (Wh). Formula: <code>Total Wh = Σ (Appliance Watts × Hours of Use)</code></p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">2. Inverter Sizing</h3>
                        <p className="mb-1">The inverter must handle the total simultaneous load. We add a 25% safety margin. Formula: <code>Inverter Size (W) = Total Watts × 1.25</code></p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">3. Battery Sizing</h3>
                        <p className="mb-1">Calculates the required battery bank capacity based on your energy needs, desired autonomy, and battery type efficiency. For example, for Lead-Acid: <code>Capacity (Wh) = (Total Wh × Days of Autonomy) / (0.8 efficiency × 0.5 DoD)</code></p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">4. Solar Panel Sizing</h3>
                        <p className="mb-1">Determines the solar array wattage needed to recharge your batteries daily. Formula: <code>Panel Watts = Required Battery Wh / Peak Sun Hours</code></p>
                    </div>
                </div>
            </div>
            
            <div className="about-card bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-4 border-b pb-2">Tutorial</h2>
                <ol className="list-decimal list-inside space-y-2">
                    <li><strong>Enter Your Loads:</strong> In the "Load Analysis" section, list all the electrical appliances you plan to use, their power rating in Watts, and how many hours per day you'll use them.</li>
                    <li><strong>Set System Parameters:</strong> Input your desired "Days of Autonomy" (how many cloudy days your system should survive) and the "Peak Sun Hours" for your location.</li>
                    <li><strong>Choose System Voltage:</strong> Select your preferred DC system voltage (12V, 24V, or 48V). Higher voltage is generally more efficient for larger systems.</li>
                    <li><strong>Calculate:</strong> Hit the "Calculate System Specs" button.</li>
                    <li><strong>Review Output:</strong> Scroll down to the "Output Summary" to see the recommended sizes for your inverter, battery bank, solar panels, and charge controller. Use the charts for a visual breakdown.</li>
                     <li><strong>Check Safe Specs:</strong> For extra reliability, especially in areas with frequent bad weather, click "Show Safe Specs" for oversized recommendations.</li>
                </ol>
            </div>
            
            <div className="about-card bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-4 border-b pb-2">About the Developer</h2>
                <p className="mb-4">This tool was created by a passionate developer dedicated to making renewable energy more accessible. The goal is to empower individuals to make informed decisions about their energy independence.</p>
                <div className="about-links flex space-x-6">
                    <a href="https://fidelmudzamba.vercel.app" target="_blank" className="text-blue-500 hover:underline text-lg"><i className={`${aboutWebsiteIconClass} mr-2`}></i>Website/Portfolio</a>
                    <a href="https://github.com" target="_blank" className="text-blue-500 hover:underline text-lg"><i className="fab fa-github mr-2"></i>GitHub</a>
                    <a href="https://www.linkedin.com/in/fidel-mudzamba-74b11215a" target="_blank" className="text-blue-500 hover:underline text-lg"><i className="fab fa-linkedin mr-2"></i>LinkedIn</a>
                    <a href="mailto:fidelmudzamba7@gmail.com" className="text-blue-500 hover:underline text-lg"><i className="fas fa-envelope mr-2"></i>Email</a>
                    {/* New WhatsApp and Call links */}
                    <a
                      href={`https://wa.me/${aboutPhoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(aboutWhatsAppMessage)}`}
                      target="_blank"
                      className="text-blue-500 hover:underline text-lg"
                    >
                      <i className={`${aboutWhatsAppIconClass} mr-2`}></i>WhatsApp
                    </a>
                    <a
                      href={`tel:${aboutPhoneNumber}`}
                      className="text-blue-500 hover:underline text-lg"
                    >
                      <i className={`${aboutPhoneIconClass} mr-2`}></i>Call Fidel Mudzamba
                    </a>
                </div>
            </div>
        </div>
    );
};

/* @tweakable Chart animation duration for all charts in ms (moved to charts module) */
const chartAnimationDuration = 800;

const ChartComponent = ({ type, data, options, title }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) chartInstance.current.destroy();
      const ctx = chartRef.current.getContext('2d');
      const chartOptions = { ...options, animation: { duration: chartAnimationDuration } };
      chartInstance.current = new Chart(ctx, { type, data, options: chartOptions });
    }
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [type, data, options, title]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

/* @tweakable Bubble radius scaling factor for device impact chart (moved to charts module) */
const deviceBubbleScaleFactor = 5;
/* @tweakable Pastel colors for bubble charts (moved to charts module) */
const pastelColors = [
  'rgba(255, 182, 193, 0.7)', 'rgba(173, 216, 230, 0.7)', 'rgba(144, 238, 144, 0.7)',
  'rgba(255, 255, 224, 0.7)', 'rgba(216, 191, 216, 0.7)', 'rgba(255, 218, 185, 0.7)',
  'rgba(175, 238, 238, 0.7)', 'rgba(240, 230, 140, 0.7)'
];

const BubbleChartSection = ({ output }) => {
  const { devices, solarPanelWatts, sunHours, batterySizing, batteryType } = output;

  const deviceImpactData = {
    datasets: devices.map((d, i) => ({
      label: d.name || `Device ${i + 1}`,
      data: [{
        x: (d.powerType === 'AC' ? d.power : (d.volts * d.amps)) * (d.dayHours + d.nightHours) * (d.quantity || 1),
        y: d.powerType === 'AC' ? d.power : (d.volts * d.amps),
        r: (d.dayHours + d.nightHours) * deviceBubbleScaleFactor
      }],
      backgroundColor: pastelColors[i % pastelColors.length]
    }))
  };

  /* @tweakable Factors for weather scenarios relative to user-input sun hours (moved to charts module) */
  const weatherScenariosFactors = { 'Sunny': 1, 'Partly Cloudy': 0.6, 'Overcast': 0.3 };

  const weatherImpactData = {
    datasets: Object.entries(weatherScenariosFactors).map(([label, factor], i) => {
      const scenarioSunHours = sunHours * factor;
      return {
        label,
        data: [{ x: scenarioSunHours, y: solarPanelWatts * scenarioSunHours, r: batterySizing[batteryType] / 50 }],
        backgroundColor: pastelColors[i % pastelColors.length]
      };
    })
  };

  const deviceImpactOptions = {
    scales: { x: { title: { display: true, text: 'Device Energy Usage (Wh/day)' } }, y: { title: { display: true, text: 'Device Power (Watts)' } } },
    plugins: { tooltip: { callbacks: { label: (ctx) => {
      const label = ctx.dataset.label || ''; const p = ctx.raw; return `${label}: ${p.x.toFixed(0)}Wh/day, ${p.y.toFixed(0)}W, ${(p.r / deviceBubbleScaleFactor).toFixed(1)}h`;
    } } } }
  };

  const weatherImpactOptions = {
    scales: { x: { title: { display: true, text: 'Sun Hours per Day' } }, y: { title: { display: true, text: 'Energy Generated (Wh)' } } },
    plugins: { tooltip: { callbacks: { label: (ctx) => {
      const label = ctx.dataset.label || ''; const p = ctx.raw; return `${label}: ${p.x.toFixed(1)} sun hours, ${p.y.toFixed(0)}Wh generated. Battery needed: ${batterySizing[batteryType].toFixed(0)}Wh`;
    } } } }
  };

  return (
    <div className="my-8">
      <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Impact Analysis</h3>
      <div className="flex border-b border-gray-300 dark:border-gray-600">
        {/* Tabs are simplified to two stacked charts to reduce app.jsx complexity */}
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-b-lg shadow-md grid grid-cols-1 gap-6">
        <ChartComponent type="bubble" data={deviceImpactData} options={deviceImpactOptions} title="Device Impact: Energy vs Power vs Usage Time" />
        <ChartComponent type="bubble" data={weatherImpactData} options={weatherImpactOptions} title="Weather Impact: Sun Hours vs Generation vs Storage" />
      </div>
    </div>
  );
};

const CollapsibleSection = ({ title, id, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <section id={id} className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <h2 onClick={() => setIsOpen(!isOpen)} className="text-xl font-semibold p-6 cursor-pointer flex justify-between items-center bg-gray-50 dark:bg-gray-700">
        {title}
        <i className={`fas fa-chevron-down transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
      </h2>
      <div className={`p-6 section-content ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </section>
  );
};


const CustomSystemCheckModal = ({ isOpen, onClose, label }) => {
  /* @tweakable Safeguard efficiency multiplier for custom calculations. 0.8 means 80% efficiency. */
  const customCalcSafeguard = 0.8;

  const [inverterW, setInverterW] = useState(1000);
  const [batteryAh, setBatteryAh] = useState(100);
  const [batteryV, setBatteryV] = useState(12);
  const [panelW, setPanelW] = useState(400);
  const [result, setResult] = useState(null);

  const dailyLoadWh = useMemo(() => parseFloat(localStorage.getItem('ssc_totalWattHours') || 0), [isOpen]);
  const sunHours = useMemo(() => parseFloat(localStorage.getItem('ssc_sunHours') || 5), [isOpen]);

  const batteryWh = batteryAh * batteryV;
  const safeBatteryWh = batteryWh * customCalcSafeguard;

  const calculateCustom = () => {
    const dailyChargeWh = panelW * sunHours;
    const netEnergy = dailyChargeWh - dailyLoadWh;
    const duration = safeBatteryWh / dailyLoadWh;
    let systemStatus;
    if (netEnergy >= 0) {
      systemStatus = " Sustainable: Your panels generate more energy than you consume daily. The system should run indefinitely under these conditions.";
    } else {
      const daysToDeplete = batteryWh / Math.abs(netEnergy);
      systemStatus = ` Not Sustainable: Your panels help, but can't keep up with the daily load. Your battery will be fully depleted in ~${daysToDeplete.toFixed(1)} days if not recharged by other means.`;
    }
    setResult({ duration, netEnergy, systemStatus });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(33, 150, 243); 
    doc.rect(0, 0, 210, 20, "F");
    doc.setTextColor(255, 255, 255); 
    doc.setFontSize(16);
    doc.text("Custom System Check Report", 105, 13, { align: "center" });
    doc.setTextColor(0, 0, 0); 
    doc.setFontSize(12);
    let y = 30;
    doc.setFont("helvetica", "bold"); 
    doc.text("System Specifications", 14, y); 
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`Inverter: ${inverterW} W`, 14, y); 
    y += 6;
    doc.text(`Solar Panels: ${panelW} W`, 14, y); 
    y += 6;
    doc.text(`Battery: ${batteryAh} Ah @ ${batteryV} V (${batteryWh} Wh)`, 14, y); 
    y += 6;
    doc.text(`Daily Load: ${dailyLoadWh.toFixed(0)} Wh`, 14, y); 
    y += 6;
    doc.text(`Sun Hours: ${sunHours} h`, 14, y); 
    y += 10;
    if (result) {
      doc.setFont("helvetica", "bold"); 
      doc.text("Calculation Results", 14, y); 
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(`System Autonomy: ${result.duration.toFixed(1)} days (${(result.duration * 24).toFixed(1)} hrs)`, 14, y); 
      y += 6;
      doc.text(`Daily Energy Balance: ${result.netEnergy.toFixed(0)} Wh`, 14, y); 
      y += 8;
      doc.setFontSize(10);
      const statusText = doc.splitTextToSize(`Status: ${result.systemStatus}`, 180);
      doc.text(statusText, 14, y); 
      y += statusText.length * 6;
      doc.setFontSize(10);
    }
    const footerHeight = 20; 
    const pageWidth = doc.internal.pageSize.getWidth(); 
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFillColor(33, 150, 243); 
    doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, "F");
    const footerText = "Generated by Solar System Calculator (webTool developed by Fidel M. Mudzamba. Click for more info)";
    const url = "https://fidelmudzamba.vercel.app";
    doc.setTextColor(255, 255, 255); 
    const textWidth = doc.getTextWidth(footerText);
    const x = (pageWidth - textWidth) / 2; 
    const footerTextY = pageHeight - footerHeight / 2 + 4; 
    doc.text(footerText, x, footerTextY); 
    doc.link(x, footerTextY - 7, textWidth, 10, { url });
    doc.save("custom-system-check.pdf");
  };

  if (!isOpen) return null;

  const modalMaxHeight = '90vh';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl overflow-y-auto"
        style={{ maxHeight: modalMaxHeight }}
      >
        <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 py-4 px-6 z-10 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold">Custom System Check</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center"
          >
            <i className="fas fa-times mr-2"></i> {label || 'Close'}
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block font-medium mb-1">Your Inverter (W)</label>
              <input
                type="number"
                value={inverterW}
                onChange={e => setInverterW(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Total Solar Panel (W)</label>
              <input
                type="number"
                value={panelW}
                onChange={e => setPanelW(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Battery Capacity (Ah)</label>
              <input
                type="number"
                value={batteryAh}
                onChange={e => setBatteryAh(parseFloat(e.target.value) || 0)}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Battery Voltage (V)</label>
              <select
                value={batteryV}
                onChange={e => setBatteryV(parseInt(e.target.value))}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700"
              >
                <option value="12">12V</option>
                <option value="24">24V</option>
                <option value="48">48V</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-gray-100 dark:bg-gray-900/30 rounded-md mb-6">
            <p>
              Daily Load: <span className="font-bold">{dailyLoadWh.toFixed(0)} Wh</span> (from calculator)
            </p>
            <p>
              Total Battery: <span className="font-bold">{batteryWh.toFixed(0)} Wh</span> ({batteryAh}Ah @ {batteryV}V)
            </p>
            <p>
              Sun Hours: <span className="font-bold">{sunHours} h</span> (from calculator)
            </p>
          </div>

          <button
            onClick={calculateCustom}
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
          >
            Check My System
          </button>

          {result && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg animate-fade-in">
              <h3 className="text-xl font-bold mb-2">Results</h3>
              <p>
                <strong>System Autonomy:</strong> Your battery can power your load for approximately{" "}
                <strong className="text-xl text-blue-600 dark:text-blue-400">
                  {result.duration.toFixed(1)} days ({(result.duration * 24).toFixed(1)} hours)
                </strong>{" "}
                from a full charge, with a {((1 - customCalcSafeguard) * 100).toFixed(0)}% safety buffer.
              </p>
              <p className="mt-2">
                <strong>Daily Energy Balance:</strong>{" "}
                <strong
                  className={`text-xl ${
                    result.netEnergy >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {result.netEnergy.toFixed(0)} Wh
                </strong>
                .
              </p>
              <p className="mt-2">
                <strong>Status:</strong> {result.systemStatus}
              </p>
            </div>
          )}
          {result && (
            <button
              onClick={downloadPDF}
              className="mt-6 w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
            >
              Download PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 p-4 text-center text-sm shadow-inner mt-auto">
      <p>&copy; {new Date().getFullYear()} Solar System Calculator (SSC). All Rights Reserved.</p>
      <p>Made with ❤️ to help you harness the power of the sun</p>
      <p>
        {footerAuthorPrefix}
        <a href={footerAuthorUrl} target="_blank" rel="noopener" className="text-blue-600 dark:text-blue-400 hover:underline">
          {footerAuthorName}
        </a>
      </p>
    </footer>
  );
};


/* @tweakable Colors for the battery capacity chart (moved to summary module) */
const batteryChartColors = ['#4ade80', '#fbbf24', '#60a5fa', '#f87171', '#c084fc', '#818cf8'];
/* @tweakable AC/DC donut cutout (moved to summary module) */
const acDcDonutCutout = '50%';
/* @tweakable AC/DC chart colors (moved to summary module) */
const acDcChartColors = ['#3b82f6', '#10b981'];
/* @tweakable Show legend on battery chart (moved to summary module) */
const showBatteryChartLegend = false;
/* @tweakable Night supply/demand polar colors (moved to summary module) */
const nightSupplyPolarBg = "rgba(0, 0, 255, 0.6)";
const nightDemandPolarBg = "rgba(128, 0, 128, 0.6)";
const polarChartBorderColor = "yellow";
/* @tweakable Background colors for energy polar chart (moved) */
const energyPolarChartBackgroundColors = ["rgba(0,255,0,0.6)", nightSupplyPolarBg, "rgba(255,0,0,0.6)", nightDemandPolarBg];
const energyPolarChartBorderColors = [polarChartBorderColor, polarChartBorderColor, polarChartBorderColor, polarChartBorderColor];
/* @tweakable Use Ah for battery in radar (moved) */
const useAhForBatteryInChart = true;
/* @tweakable Show the KPI tiles block (Total Consumption, Inverter Size, Panel Wattage, Controller Size) */
const showKpiSummaryTiles = true;
/* @tweakable Decimal precision for KPI values */
const kpiPrecision = 2;
/* @tweakable Show the restored charts block (Load per Device, Energy Supply vs Demand, System Balance Radar) */
const showRestoredCharts = true;
/* @tweakable Radar chart fill opacity (0 = no fill, 1 = solid) */
const radarFillOpacity = 0.2;
/* @tweakable Orientation of the 'Load per Device (Wh/day)' bar chart: true = vertical, false = horizontal */
const loadPerDeviceVertical = true;

const BatteryRecommendation = ({ requiredWh, systemVoltage, batteryType }) => {
  const batteryBankOptions = { '12V': [100, 150, 200, 250], '24V': [100, 150, 200], '48V': [100, 150] };
  const requiredAh = requiredWh / systemVoltage;
  const options = batteryBankOptions[`${systemVoltage}V`];
  if (!options) return null;
  return (
    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
      <h3 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-300">Battery Combination Guide ({batteryType})</h3>
      <p className="mb-4 text-gray-700 dark:text-gray-300">To achieve the required capacity of <strong>{requiredWh.toFixed(0)}Wh</strong> (approx. <strong>{requiredAh.toFixed(0)}Ah</strong> at {systemVoltage}V), here are some common {systemVoltage}V battery options.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {options.map(ah => {
          const count = Math.ceil(requiredAh / ah);
          const totalAh = count * ah;
          return (
            <div key={ah} className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
              <h4 className="font-bold text-lg">{ah}Ah Battery</h4>
              <div className="mt-2">
                <p className="font-semibold text-blue-600 dark:text-blue-400">{count} unit{count > 1 ? 's' : ''}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">({totalAh}Ah total)</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SolarPanelRecommendation = ({ solarPanelWatts, winterFactor, batteryType, totalWattHours, totalDayWh, totalNightWh }) => {
  const panelOptions = [100, 200, 250, 300, 390, 450, 500];
  const requiredWinterWatts = solarPanelWatts * winterFactor;
  return (
    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
      <h3 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-300">Solar Panel Combination Guide</h3>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Based on your daily usage (<strong>{totalDayWh.toFixed(0)}Wh</strong> day, <strong>{totalNightWh.toFixed(0)}Wh</strong> night) and a <strong>{batteryType}</strong> battery, you need <strong>{solarPanelWatts.toFixed(0)}W</strong> of solar panels in summer. For winter, we recommend <strong>{requiredWinterWatts.toFixed(0)}W</strong>.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {panelOptions.map(panel => {
          const summerCount = Math.ceil(solarPanelWatts / panel);
          const winterCount = Math.ceil(requiredWinterWatts / panel);
          return (
            <div key={panel} className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
              <h4 className="font-bold text-lg">{panel}W Panel</h4>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Summer:</p>
                <p className="font-semibold text-blue-600 dark:text-blue-400">{summerCount} panel{summerCount > 1 ? 's' : ''}</p>
              </div>
              <div className="mt-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Winter:</p>
                <p className="font-semibold text-indigo-600 dark:text-indigo-400">{winterCount} panel{winterCount > 1 ? 's' : ''}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OutputSummary = ({ output, showSafeSpecs, setShowSafeSpecs, handleDownloadPdf, winterFactor }) => {
  const { totalDayWh, totalNightWh, totalWattHours, totalACWatts, inverterSize, batterySizing, solarPanelWatts, controllerAmps, devices, sunHours, daysOfAutonomy, batteryType, systemVoltage, totalAcWh, totalDcWh } = output;

  const allBatteryTypes = Object.keys(batterySizing);
  const allBatteryValues = Object.values(batterySizing);
  const requiredWhForSelectedType = batterySizing[batteryType];
  const batteryValueForChart = useAhForBatteryInChart ? requiredWhForSelectedType / systemVoltage : requiredWhForSelectedType;
  const batteryLabelForChart = useAhForBatteryInChart ? `Battery (Ah)` : `Battery (Wh)`;

  const chartData = {
    loadPerDevice: {
      labels: devices.map(d => d.name || 'Unnamed'),
      datasets: [{ label: 'Watt-hours per device', data: devices.map(d => (d.powerType === 'AC' ? d.power : (d.volts * d.amps)) * (d.dayHours + d.nightHours) * (d.quantity || 1)), backgroundColor: batteryChartColors }]
    },
    dayNightLoad: {
      labels: ['Day Load (Wh)', 'Night Load (Wh)'],
      datasets: [{ label: 'Load Distribution', data: [totalDayWh, totalNightWh], backgroundColor: ['#fbbf24', '#4f46e5'] }]
    },
    acDcLoad: {
      labels: ['AC Load (Wh)', 'DC Load (Wh)'],
      datasets: [{ label: 'AC vs DC Load', data: [totalAcWh, totalDcWh], backgroundColor: acDcChartColors }]
    },
    energySupplyDemand: {
      labels: ["Day Supply (Wh)", "Night Supply (Wh)", "Day Demand (Wh)", "Night Demand (Wh)"],
      datasets: [{ label: "Energy Supply & Demand", data: [solarPanelWatts * sunHours, 0, totalDayWh, totalNightWh], backgroundColor: energyPolarChartBackgroundColors, borderColor: energyPolarChartBorderColors, borderWidth: 1 }]
    },
    batteryCapacityByType: {
      labels: allBatteryTypes,
      datasets: [{ label: 'Required Capacity (Wh)', data: allBatteryValues, backgroundColor: batteryChartColors }]
    },
    systemBalance: {
      labels: ['Load (W)', `Inverter (W)`, `Panels (W)`, `Controller (A)`, batteryLabelForChart],
      datasets: [{ label: 'System Components Rating', data: [totalACWatts, inverterSize, solarPanelWatts, controllerAmps, batteryValueForChart], backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgb(54, 162, 235)', pointBackgroundColor: 'rgb(54, 162, 235)' }]
    }
  };

  const safeSpecs = { days: 3, panelBuffer: 1.3, inverterBuffer: 1.3 };
  const safeBatteryWh = (totalWattHours * safeSpecs.days) / (0.8 * 0.5);
  const safePanelWatts = (safeBatteryWh / sunHours) * safeSpecs.panelBuffer;
  const safeInverterSize = totalACWatts * safeSpecs.inverterBuffer;

  return (
    <div id="output-summary" className="mt-10 p-4 sm:p-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg shadow-xl">
      <div className="flex justify-between items-center border-b-2 border-blue-500 pb-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Output Summary</h2>
        <button onClick={handleDownloadPdf} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"><i className="fas fa-file-pdf mr-2"></i>Download PDF</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-center">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-md font-semibold text-gray-500 dark:text-gray-400">Day Consumption</h3>
          <p className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">{totalDayWh.toFixed(2)} <span className="text-lg">Wh/day</span></p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-md font-semibold text-gray-500 dark:text-gray-400">Night Consumption</h3>
          <p className="text-2xl font-bold text-indigo-500 dark:text-indigo-400">{totalNightWh.toFixed(2)} <span className="text-lg">Wh/day</span></p>
        </div>
      </div>
      {showKpiSummaryTiles && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-center">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total Consumption</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalWattHours.toFixed(kpiPrecision)} <span className="text-lg">Wh/day</span></p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Inverter Size</h3>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{inverterSize.toFixed(kpiPrecision)} <span className="text-lg">W</span></p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Panel Wattage</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{solarPanelWatts.toFixed(kpiPrecision)} <span className="text-lg">W</span></p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Controller Size</h3>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{controllerAmps.toFixed(kpiPrecision)} <span className="text-lg">A</span></p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-center">
        <ChartComponent type="bar" data={chartData.systemBalance} title="System Component Balance" />
        <ChartComponent type="doughnut" data={chartData.acDcLoad} title="AC vs. DC Load Distribution" options={{ cutout: acDcDonutCutout }} />
        <ChartComponent type="pie" data={chartData.dayNightLoad} title="Day vs. Night Load Distribution" />
        <ChartComponent type="bar" data={chartData.batteryCapacityByType} title="Required Battery Capacity by Type (Wh)" options={{ indexAxis: 'y', responsive: true, plugins: { legend: { display: showBatteryChartLegend } }, scales: { x: { beginAtZero: true } } }} />
      </div>
      {showRestoredCharts && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold mb-4 text-center border-b pb-2">Restored Charts</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartComponent
              type="bar"
              data={chartData.loadPerDevice}
              title="Load per Device (Wh/day)"
              options={{ indexAxis: loadPerDeviceVertical ? 'x' : 'y', scales: { y: { beginAtZero: true } } }}
            />
            <ChartComponent type="polarArea" data={chartData.energySupplyDemand} title="Energy Supply vs Demand" />
            <ChartComponent type="radar" data={chartData.systemBalance} title="System Component Balance (Radar)" options={{ elements: { line: { backgroundColor: `rgba(54,162,235,${radarFillOpacity})` } } }} />
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4 text-center border-b pb-2">Battery Capacity for Night Load ({daysOfAutonomy} Day{daysOfAutonomy > 1 ? 's' : ''} Autonomy)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {Object.entries(batterySizing).map(([type, wh]) => (
            <div key={type}>
              <h4 className="text-lg font-semibold">{type}</h4>
              <p className="text-2xl font-bold text-orange-500 dark:text-orange-400">{wh.toFixed(2)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Wh</p>
              <p className="text-lg font-bold text-gray-600 dark:text-gray-300 mt-1">~{(wh / systemVoltage).toFixed(2)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ah @{systemVoltage}V</p>
            </div>
          ))}
        </div>
      </div>

      <SolarPanelRecommendation
        solarPanelWatts={solarPanelWatts}
        winterFactor={winterFactor}
        batteryType={batteryType}
        totalWattHours={totalWattHours}
        totalDayWh={totalDayWh}
        totalNightWh={totalNightWh}
      />

      <BatteryRecommendation requiredWh={requiredWhForSelectedType} systemVoltage={systemVoltage} batteryType={batteryType} />

      <BubbleChartSection output={output} />

      <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 rounded-lg">
        <h3 className="text-2xl font-bold mb-4 text-yellow-800 dark:text-yellow-300">Recommended Tips</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li><strong>Battery Protection:</strong> Never drain your batteries completely. The calculations account for safe Depth of Discharge (DoD).</li>
          <li><strong>Night Loads Matter:</strong> Night loads impact battery size most. Shift usage to daytime when possible.</li>
          <li><strong>Day Loads & Solar:</strong> Day loads can often be powered directly by solar panels.</li>
          <li><strong>AC vs DC:</strong> DC loads can avoid inverter conversion losses.</li>
          <li><strong>Winter Production:</strong> Expect fewer sun hours and consider increasing autonomy.</li>
        </ul>
      </div>
    </div>
  );
};

const PackagesTiles = ({ packages, expandedKey, onExpand, onOpenModal }) => (
  <section aria-label="Common 24-hour solar packages" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
    <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">Common 24-hour Solar Setups</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {packages.map((p, idx) => (
        <article key={p.key} className="package-card-anim bg-gray-50 dark:bg-gray-700 rounded-lg shadow hover:shadow-lg transition-shadow focus-within:ring-2 ring-blue-500 relative pb-14" style={{ animationDelay: `${idx * packageStaggerMs}ms` }}>
          <button
            onClick={() => onExpand(p.key)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onExpand(p.key); } }}
            aria-label={`View details for ${p.name} solar package.`}
            className="w-full text-left p-4 rounded-lg hover:bg-white/60 dark:hover:bg-gray-600/60 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <i className={`fas ${p.icon} text-blue-600 dark:text-blue-400`} aria-hidden="true"></i>
                <div>
                  <h4 className="text-lg font-semibold">{p.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{p.dailyWh} Wh/day (est.)</p>
                </div>
              </div>
              <i className={`fas fa-chevron-down transition-transform ${expandedKey === p.key ? 'rotate-180' : ''}`} aria-hidden="true"></i>
            </div>
          </button>
          {expandedKey === p.key && (
            <div className="px-4 pb-12">
              <ul className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
                <li><strong>PV:</strong> {p.specs.pv}</li>
                <li><strong>Battery (LiFePO₄):</strong> {p.specs.battery_lfp}</li>
                <li><strong>Battery (Lead-Acid):</strong> {p.specs.battery_la}</li>
                <li><strong>Inverter:</strong> {p.specs.inverter}</li>
                <li><strong>Controller:</strong> {p.specs.controller}</li>
              </ul>
              <p className="text-xs mt-2 text-gray-500 dark:text-gray-400"><strong>Runs:</strong> {p.specs.runs.join(', ')}</p>
            </div>
          )}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-3">
            <button onClick={() => onOpenModal(p)} className={tileCtaClasses}>{tileCtaLabel}</button>
          </div>
          {showTileDownloadWhenExpanded && expandedKey === p.key && (
            <button
              aria-label={`Download details for ${p.name}`}
              onClick={() => downloadPkg(p)}
              className={`absolute bottom-3 right-3 ${tileDownloadBtnSize} flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition`}
              title="Download"
            >
              <i className="fas fa-download text-gray-700 dark:text-gray-100"></i>
            </button>
          )}
        </article>
      ))}
    </div>
  </section>
);

const PackageDetailsModal = ({ pkg, onClose }) => {
  if (!pkg) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label={`${pkg.name} details`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg relative">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
          <h4 className="text-xl font-bold">{pkg.name}</h4>
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500">
            <i className="fas fa-times mr-1"></i> Close
          </button>
        </div>
        <div className="p-5 space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Estimated daily load:</strong> {pkg.dailyWh} Wh/day</p>
          <ul className="text-sm text-gray-800 dark:text-gray-100 space-y-1">
            <li><strong>PV Array:</strong> {pkg.specs.pv}</li>
            <li><strong>Battery (LiFePO4):</strong> {pkg.specs.battery_lfp}</li>
            <li><strong>Battery (Lead-Acid):</strong> {pkg.specs.battery_la}</li>
            <li><strong>Inverter:</strong> {pkg.specs.inverter}</li>
            <li><strong>Charge Controller:</strong> {pkg.specs.controller}</li>
          </ul>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Runs over 24h:</strong></p>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-200">
              {pkg.specs.runs.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        </div>
        <button
          aria-label={modalDownloadBtnTitle}
          title={modalDownloadBtnTitle}
          onClick={() => downloadPkg(pkg)}
          className={`${modalDownloadBtnClasses} ${modalDownloadBtnSize}`}
        >
          <i className="fas fa-download"></i>
        </button>
      </div>
    </div>
  );
};

/* Factors for weather scenarios relative to user-input sun hours */

/* @tweakable Package card animation stagger in ms */
const packageStaggerMs = 80;
/* @tweakable Duration of slide-down reveal in ms */
const packageRevealMs = 400;
/* @tweakable Label for the vertical nav link to the common setups section */
const commonSetupsNavLabel = "Common Setups";
/* @tweakable Label for the tile CTA button */
const tileCtaLabel = "View Details";
/* @tweakable Classes for the tile CTA button styling */
const tileCtaClasses = "px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm shadow";
/* @tweakable Whether to show the small download icon when a card is expanded */
const showTileDownloadWhenExpanded = true;
/* @tweakable Size classes for the small download icon button */
const tileDownloadBtnSize = "w-9 h-9";
/* @tweakable Tooltip/title for the modal download button */
const modalDownloadBtnTitle = "Download package details";
/* @tweakable Classes for the modal's bottom-right download icon button */
const modalDownloadBtnClasses = "absolute bottom-3 right-3 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-100 shadow";
/* @tweakable Size classes for the modal download icon button */
const modalDownloadBtnSize = "w-10 h-10";
/* @tweakable Filename prefix used when downloading package details */
const tileDownloadFilenamePrefix = "solar-package-";

const solarPackages = [
  {
    key: 'ecolite',
    name: 'EcoLite',
    dailyWh: 300,
    icon: 'fa-leaf',
    specs: {
      pv: '2 × 100W panels (200W)',
      battery_lfp: '12V 50Ah LiFePO₄ (600Wh)',
      battery_la: '12V 100Ah Lead-Acid (1200Wh, 50% usable)',
      inverter: '400W Pure Sine',
      controller: '20A MPPT',
      runs: ['2× LED bulbs', 'Phone charging', 'WiFi router', 'Small fan (few hours)']
    }
  },
  {
    key: 'ecobasic',
    name: 'EcoBasic',
    dailyWh: 600,
    icon: 'fa-sun',
    specs: {
      pv: '2 × 200W panels (400W)',
      battery_lfp: '12V 100Ah LiFePO₄ (1200Wh)',
      battery_la: '12V 200Ah Lead-Acid (2400Wh, 50% usable)',
      inverter: '800W Pure Sine',
      controller: '30A MPPT',
      runs: ['LED lighting', 'TV (2–3h)', 'Laptop', 'Router', 'USB chargers']
    }
  },
  {
    key: 'standard',
    name: 'Standard Home',
    dailyWh: 1200,
    icon: 'fa-house',
    specs: {
      pv: '3 × 300W panels (900W)',
      battery_lfp: '24V 100Ah LiFePO₄ (2400Wh)',
      battery_la: '24V 200Ah Lead-Acid (4800Wh, 50% usable)',
      inverter: '1500W Pure Sine',
      controller: '40–60A MPPT',
      runs: ['Lights', 'TV', 'Laptop', 'Fridge (efficient)', 'Phone/Router']
    }
  },
  {
    key: 'premium',
    name: 'Premium Power',
    dailyWh: 2500,
    icon: 'fa-bolt',
    specs: {
      pv: '4 × 450W panels (1800W)',
      battery_lfp: '48V 100Ah LiFePO₄ (4800Wh)',
      battery_la: '48V 300Ah Lead-Acid (14400Wh, 50% usable)',
      inverter: '3000W Pure Sine',
      controller: '80A MPPT',
      runs: ['Lights', 'Large fridge', 'TV', 'Computers', 'Small tools (short use)']
    }
  },
  {
    key: 'maxduty',
    name: 'MaxDuty',
    dailyWh: 4000,
    icon: 'fa-solar-panel',
    specs: {
      pv: '6 × 450W panels (2700W)',
      battery_lfp: '48V 150Ah LiFePO₄ (7200Wh)',
      battery_la: '48V 400Ah Lead-Acid (19200Wh, 50% usable)',
      inverter: '5000W Pure Sine',
      controller: '100A MPPT',
      runs: ['Full lighting', 'Large fridge/freezer', 'Multiple devices', 'Microwave/Tools (short)']
    }
  }
];

const CalculatorPage = ({ setIsCustomCalcOpen }) => {
  /* @tweakable Whether the package tiles are shown initially (moved to CalculatorPage) */
  const [showPackages, setShowPackages] = useState(false);
  /* @tweakable Auto-scroll to the packages section when revealed (moved to CalculatorPage) */
  const autoScrollToPackages = true;
  /* @tweakable Package key that starts expanded (use null for none) (moved) */
  const [expandedKey, setExpandedKey] = useState(null);
  /* @tweakable Currently selected package for modal (null means closed) (moved) */
  const [modalPackage, setModalPackage] = useState(null);

  const [systemVoltage, setSystemVoltage] = useState(12);
  const [batteryType, setBatteryType] = useState('Lithium');
  const defaultDeviceType = 'AC';
  const defaultTimeOfUse = 'Day';
  const defaultDeviceQuantity = 1;

  const initialDeviceState = { name: 'LED Bulb', powerType: 'AC', power: 10, volts: 0, amps: 0, hours: 5, type: defaultDeviceType, timeOfUse: defaultTimeOfUse, dayHours: 5, nightHours: 0, quantity: defaultDeviceQuantity };
  const [devices, setDevices] = useState([initialDeviceState]);
  const [daysOfAutonomy, setDaysOfAutonomy] = useState(1);
  /* @tweakable Default peak sun hours per day (moved) */
  const [sunHours, setSunHours] = useState(5);
  const [output, setOutput] = useState(null);
  const [showSafeSpecs, setShowSafeSpecs] = useState(false);
  const [isOutputVisible, setIsOutputVisible] = useState(false);
  const outputSummaryRef = useRef(null);
  /* @tweakable Winter efficiency factor. 1.5 means 50% more panels needed in winter. (moved) */
  const winterPanelFactor = 1.5;
  /* @tweakable Safety factor for inverter sizing (moved) */
  const inverterSafetyFactor = 1.25;
  /* @tweakable Safety factor for charge controller sizing (moved) */
  const controllerSafetyFactor = 1.25;

  const batteryCharacteristics = {
    'Lithium': { dod: 0.99, efficiency: 1.0 },
    'Flooded': { dod: 0.5, efficiency: 0.8 },
    'Gel': { dod: 0.6, efficiency: 0.85 },
    'AGM': { dod: 0.7, efficiency: 0.9 },
  };

  const inverterRecommendations = {
    '12V': { max: 1000 },
    '24V': { min: 1000, max: 2000 },
    '48V': { min: 2000, max: 4000 },
  };

  const deviceColSpans = { device: 2, qty: 2, timeOfUse: 2, power: 2, hours: 2, wattHours: 1, actions: 1 };

  const { totalDayWh, totalNightWh, totalWattHours, totalAcWh, totalDcWh } = useMemo(() => {
    let dayWh = 0, nightWh = 0, acWh = 0, dcWh = 0;
    devices.forEach(dev => {
      const deviceWatts = dev.powerType === 'AC' ? dev.power : (dev.volts * dev.amps);
      const quantity = dev.quantity || 1;
      const deviceDayWh = deviceWatts * dev.dayHours * quantity;
      const deviceNightWh = deviceWatts * dev.nightHours * quantity;
      dayWh += deviceDayWh; nightWh += deviceNightWh;
      if (dev.powerType === 'AC') acWh += deviceDayWh + deviceNightWh; else dcWh += deviceDayWh + deviceNightWh;
    });
    return { totalDayWh: dayWh, totalNightWh: nightWh, totalWattHours: dayWh + nightWh, totalAcWh: acWh, totalDcWh: dcWh };
  }, [devices]);

  const totalACWatts = useMemo(() => devices.reduce((acc, dev) => {
    if (dev.powerType === 'AC') {
      const quantity = dev.quantity || 1;
      return acc + (dev.power * quantity);
    }
    return acc;
  }, 0), [devices]);

  const addDevice = () => setDevices([...devices, { ...initialDeviceState, name: '', power: 0, hours: 0, dayHours: 0, nightHours: 0 }]);
  const removeDevice = (index) => setDevices(devices.filter((_, i) => i !== index));

  const updateDevice = (index, field, value) => {
    const newDevices = [...devices];
    const device = { ...newDevices[index] };
    let processedValue = value;
    if (['power', 'volts', 'amps', 'hours', 'dayHours', 'nightHours', 'quantity'].includes(field)) processedValue = parseFloat(value) || 0;
    device[field] = processedValue;
    if (field === 'powerType') { device.power = 0; device.volts = 0; device.amps = 0; }
    if (field === 'timeOfUse') {
      if (processedValue === 'Day') { device.dayHours = device.hours; device.nightHours = 0; }
      else if (processedValue === 'Night') { device.dayHours = 0; device.nightHours = device.hours; }
      else if (processedValue === 'Both') { const currentTotalHours = parseFloat(device.hours) || 0; device.dayHours = currentTotalHours / 2; device.nightHours = currentTotalHours / 2; }
    } else if (field === 'hours') {
      if (device.timeOfUse === 'Day') { device.dayHours = processedValue; device.nightHours = 0; }
      else if (device.timeOfUse === 'Night') { device.dayHours = 0; device.nightHours = processedValue; }
    } else if (field === 'dayHours' || field === 'nightHours') {
      device.hours = device.dayHours + device.nightHours;
    }
    if (field === 'quantity' && processedValue < 1) device.quantity = 1;
    newDevices[index] = device; setDevices(newDevices);
  };

  const calculate = () => {
    const inverterSize = totalACWatts * inverterSafetyFactor;
    const bChar = batteryCharacteristics[batteryType];
    const allBatterySizing = {};
    Object.keys(batteryCharacteristics).forEach(type => {
      const char = batteryCharacteristics[type];
      if (type === 'Lithium' || type === 'Flooded' || type === 'Gel' || type === 'AGM') {
        allBatterySizing[type] = (totalNightWh * daysOfAutonomy) / (char.efficiency * char.dod);
      }
    });
    const energyToRecharge = totalNightWh / bChar.efficiency;
    const totalEnergyFromPanels = totalDayWh + energyToRecharge;
    const solarPanelWatts = totalEnergyFromPanels / sunHours;
    const controllerAmps = (solarPanelWatts / systemVoltage) * controllerSafetyFactor;

    setOutput({
      totalDayWh, totalNightWh, totalWattHours, totalACWatts, inverterSize,
      batterySizing: allBatterySizing, solarPanelWatts, controllerAmps, devices,
      sunHours, daysOfAutonomy, batteryType, systemVoltage, totalAcWh, totalDcWh,
    });
    localStorage.setItem('ssc_totalWattHours', totalWattHours);
    localStorage.setItem('ssc_sunHours', sunHours);
    setTimeout(() => document.getElementById('output-summary')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  useEffect(() => {
    if (!output) return;
    const observer = new IntersectionObserver(([entry]) => { setIsOutputVisible(entry.isIntersecting); }, { threshold: 0.1 });
    const currentRef = outputSummaryRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [output]);

  const handleDownloadPdf = async () => {
    const summaryElement = document.getElementById('output-summary');
    if (!summaryElement) return;
    summaryElement.classList.add('export-mode');
    const canvas = await html2canvas(summaryElement, { scale: 1 });
    const imgWidth = canvas.width, imgHeight = canvas.height;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth(), pdfHeight = pdf.internal.pageSize.getHeight();
    const ratio = imgWidth / imgHeight; const pdfImgWidth = pdfWidth; const pxPerMm = imgWidth / pdfImgWidth;
    let heightLeft = imgHeight, position = 0;
    while (heightLeft > 0) {
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = imgWidth; pageCanvas.height = Math.min(pdfHeight * pxPerMm, heightLeft);
      const ctx = pageCanvas.getContext('2d');
      ctx.drawImage(canvas, 0, position, imgWidth, pageCanvas.height, 0, 0, imgWidth, pageCanvas.height);
      const imgData = pageCanvas.toDataURL('image/jpeg', 1.0);
      const pdfSliceHeight = pageCanvas.height / pxPerMm;
      if (position > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfSliceHeight);
      heightLeft -= pageCanvas.height; position += pageCanvas.height;
    }
    pdf.save('solar-system-summary.pdf');
    summaryElement.classList.remove('export-mode');
  };

  return (
    <>
      <div className="mb-4">
        <button
          id="packages-cta"
          onClick={() => setShowPackages(prev => {
            const next = !prev;
            if (!prev && autoScrollToPackages) setTimeout(() => document.getElementById('common-setups')?.scrollIntoView({ behavior: 'smooth' }), 100);
            return next;
          })}
          className="w-full py-3 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          aria-expanded={showPackages}
          aria-controls="common-setups"
        >
          <i className="fas fa-layer-group mr-2"></i> View Common Solar Setups
        </button>
        {showPackages && (
          <div id="common-setups" className="packages-enter" style={{ marginTop: `${12}px`, animationDuration: `${packageRevealMs}ms`, animationTimingFunction: 'ease' }}>
            <PackagesTiles
              packages={solarPackages}
              expandedKey={expandedKey}
              onExpand={key => setExpandedKey(prev => (prev === key ? null : key))}
              onOpenModal={pkg => setModalPackage(pkg)}
            />
          </div>
        )}
      </div>

      <CollapsibleSection title="1. Load Analysis" id="load-analysis">
        {/* Header Labels for wide screens */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
          <div className={`col-span-${deviceColSpans.device}`}>Device</div>
          <div className={`col-span-${deviceColSpans.qty}`}>Qty</div>
          <div className={`col-span-${deviceColSpans.timeOfUse}`}>Time of Use</div>
          <div className={`col-span-${deviceColSpans.power}`}>Power Details</div>
          <div className={`col-span-${deviceColSpans.hours}`}>Day/Night (h)</div>
          <div className={`col-span-${deviceColSpans.wattHours}`}>Watt Hours</div>
          <div className={`col-span-${deviceColSpans.actions} text-center`}>Actions</div>
        </div>

        {devices.map((device, index) => {
          const deviceWatts = device.powerType === 'AC' ? device.power : (device.volts * device.amps);
          const quantity = device.quantity || 1;
          const wattHours = deviceWatts * (device.dayHours + device.nightHours) * quantity;
          return (
            <div key={index} className="p-2 border-b dark:border-gray-700 md:border-b-2 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                {/* Device Name */}
                <div className={`col-span-1 md:col-span-${deviceColSpans.device}`}>
                  <label className="md:hidden text-xs">Device</label>
                  <input type="text" placeholder="Device Name" value={device.name} onChange={e => updateDevice(index, 'name', e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                </div>

                {/* Quantity */}
                <div className={`col-span-1 md:col-span-${deviceColSpans.qty}`}>
                  <label className="md:hidden text-xs">Quantity</label>
                  <div className="flex items-center">
                    <button onClick={() => updateDevice(index, 'quantity', device.quantity - 1)} className="px-2 py-1 border rounded-l bg-gray-200 dark:bg-gray-600 h-[42px]">-</button>
                    <input type="number" value={device.quantity} onChange={e => updateDevice(index, 'quantity', e.target.value)} className="w-16 p-2 border-t border-b text-center bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 h-[42px]" />
                    <button onClick={() => updateDevice(index, 'quantity', device.quantity + 1)} className="px-2 py-1 border rounded-r bg-gray-200 dark:bg-gray-600 h-[42px]">+</button>
                  </div>
                </div>

                {/* Time of Use */}
                <div className={`col-span-1 md:col-span-${deviceColSpans.timeOfUse}`}>
                  <label className="md:hidden text-xs">Time of Use</label>
                  <select value={device.timeOfUse} onChange={e => updateDevice(index, 'timeOfUse', e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 h-[42px]">
                    <option value="Day">Day</option>
                    <option value="Night">Night</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                {/* Power Details */}
                <div className={`col-span-1 md:col-span-${deviceColSpans.power}`}>
                  <label className="md:hidden text-xs">Power Details</label>
                  <div className="flex flex-col gap-2">
                    <select value={device.powerType} onChange={e => updateDevice(index, 'powerType', e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 h-[42px]">
                      <option value="AC">AC</option>
                      <option value="DC">DC</option>
                    </select>
                    {device.powerType === 'AC' ? (
                      <div className="flex flex-col w-full">
                        <label className="text-xs">Watts</label>
                        <input type="number" value={device.power} onChange={e => updateDevice(index, 'power', e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <div className="w-1/2">
                          <label className="text-xs">Volts</label>
                          <input type="number" value={device.volts} onChange={e => updateDevice(index, 'volts', e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                        </div>
                        <div className="w-1/2">
                          <label className="text-xs">Amps</label>
                          <input type="number" value={device.amps} onChange={e => updateDevice(index, 'amps', e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                        </div>
                      </div>
                    )}
                    {device.powerType === 'DC' && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">For DC devices, enter voltage and current (amps). Watts will be calculated automatically.</p>
                    )}
                  </div>
                </div>

                {/* Day/Night Hours */}
                <div className={`col-span-1 md:col-span-${deviceColSpans.hours}`}>
                  <label className="md:hidden text-xs">Day/Night (h)</label>
                  <div className="flex flex-col gap-2 md:flex-row">
                    <div className="w-full md:w-1/2">
                      <input type="number" value={device.dayHours} disabled={device.timeOfUse === 'Night'} onChange={e => updateDevice(index, 'dayHours', e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-600" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">Day(h)</p>
                    </div>
                    <div className="w-full md:w-1/2">
                      <input type="number" value={device.nightHours} disabled={device.timeOfUse === 'Day'} onChange={e => updateDevice(index, 'nightHours', e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-600" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">Night(h)</p>
                    </div>
                  </div>
                </div>

                {/* Watt Hours Display */}
                <div className={`col-span-1 md:col-span-${deviceColSpans.wattHours} flex items-center justify-center`}>
                  <label className="md:hidden text-xs mr-2">Watt Hours:</label>
                  <p className="p-2 font-medium whitespace-nowrap">{wattHours.toFixed(1)} Wh</p>
                </div>
                {/* Remove Button */}
                <div className={`col-span-1 md:col-span-${deviceColSpans.actions} flex flex-col items-center justify-center`}>
                  <button onClick={() => removeDevice(index)} className="text-red-500 hover:text-red-700">
                    <i className="fas fa-trash"></i>
                    <span className="text-xs block">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <button onClick={addDevice} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">+ Add Device</button>
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
          <p className="font-bold text-lg">Day Load: <span className="text-blue-600 dark:text-blue-400">{totalDayWh.toFixed(2)} Wh</span></p>
          <p className="font-bold text-lg">Night Load: <span className="text-indigo-600 dark:text-indigo-400">{totalNightWh.toFixed(2)} Wh</span></p>
          <p className="font-bold text-lg">Total Daily Load: <span className="text-green-600 dark:text-green-400">{totalWattHours.toFixed(2)} Wh</span></p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="2. Inverter Sizing" id="inverter-sizing">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg mb-2">Minimum Inverter Requirements</h4>
            <p>It is better to select a higher system voltage (e.g., 24V or 48V over 12V) because the required thickness of your cables depends on it. Higher voltage systems allow for thinner, less expensive cables.</p>
          </div>
          <div>
            <p>Look at your AC appliances. If you have a blender of 1000 watts, we recommend getting an inverter of at least <strong>{1000 * inverterSafetyFactor} watts</strong> (1000W * {inverterSafetyFactor}). This {inverterSafetyFactor - 1 > 0 && `${((inverterSafetyFactor - 1) * 100).toFixed(0)}%`} safety factor ensures the inverter doesn't run at 100% capacity all the time, which extends its lifespan. If you plan to run multiple AC appliances at the same time, you must add their wattage together to determine the total load.</p>
          </div>
          {totalACWatts > 0 && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
              <h4 className="font-bold text-lg text-green-800 dark:text-green-300">Inverter Recommendation</h4>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {(totalACWatts * inverterSafetyFactor).toFixed(2)} W
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Based on your {totalACWatts.toFixed(2)}W total AC load and a {((inverterSafetyFactor - 1) * 100).toFixed(0)}% safety factor.</p>
            </div>
          )}
          <div>
            <h4 className="font-semibold text-lg mb-2">Recommended Inverter Limits</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>12V system:</strong> Ideal for inverters below <strong>{inverterRecommendations['12V'].max}W</strong>.</li>
              <li><strong>24V system:</strong> Recommended for inverters from <strong>{inverterRecommendations['24V'].min}W</strong> to <strong>{inverterRecommendations['24V'].max}W</strong>.</li>
              <li><strong>48V system:</strong> Best for inverters from <strong>{inverterRecommendations['48V'].min}W</strong> to <strong>{inverterRecommendations['48V'].max}W</strong>.</li>
            </ul>
            <p className="mt-2">For systems requiring more power, you may need to run multiple inverters in parallel.</p>
          </div>
          <p className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700"><strong>Formula Used:</strong> <code>Inverter Size (W) = Total AC Watts * {inverterSafetyFactor}</code></p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="3. Battery Sizing" id="battery-sizing">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Days of Autonomy</label>
            <input type="number" value={daysOfAutonomy} onChange={e => setDaysOfAutonomy(parseFloat(e.target.value) || 1)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">How many days should the system run without any sun? (e.g., for rainy seasons)</p>
          </div>
          <div>
            <label className="block mb-2 font-medium">System Voltage (V)</label>
            <select value={systemVoltage} onChange={e => setSystemVoltage(parseInt(e.target.value))} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <option value="12">12V</option>
              <option value="24">24V</option>
              <option value="48">48V</option>
            </select>
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">This is the voltage of your battery bank. Higher is often better for larger systems.</p>
          </div>
        </div>
        <div className="mt-6">
          <label className="block mb-2 font-medium">Primary Battery Type for Calculations</label>
          <select value={batteryType} onChange={e => setBatteryType(e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
            {Object.keys(batteryCharacteristics).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">Select your preferred battery chemistry. This will affect solar panel and controller sizing.</p>
        </div>
        <p className="mt-4">Battery sizing is based on your <strong>night load</strong>, as this is when solar panels are not generating power. This ensures you have enough stored energy to last through the night for the specified days of autonomy.</p>
        <p className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700"><strong>Formula:</strong> <code>Capacity (Wh) = (Night Load Wh × Days of Autonomy) / (Efficiency × Depth of Discharge)</code></p>
      </CollapsibleSection>

      <CollapsibleSection title="4. Solar Panel Sizing" id="solar-panel-sizing">
        <div>
          <label className="block mb-2 font-medium">Peak Sun Hours / Day</label>
          <input type="number" value={sunHours} onChange={e => setSunHours(parseFloat(e.target.value) || 0)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">Average hours of direct sunlight your location gets. (e.g., 4-6 hours)</p>
        </div>
        <p className="mt-2">Solar panels need to power your daytime loads directly AND recharge the energy consumed by your nighttime loads.</p>
        <p className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700"><strong>Formula:</strong> <code>Panel Watts = (Day Load Wh + (Night Load Wh / Battery Efficiency)) / Sun Hours</code></p>
      </CollapsibleSection>

      <CollapsibleSection title="5. Charge Controller Sizing" id="controller-sizing">
        <div className="space-y-2">
          <p>A charge controller sits between your solar panels and your battery bank to prevent overcharging. Its size (in Amps) must be large enough to handle the current from your solar panels.</p>
          <p>The controller's rating is determined by the total wattage of your solar array and the voltage of your battery system. We include a <strong>{(controllerSafetyFactor * 100 - 100)}% safety margin</strong> to ensure it operates safely and efficiently.</p>
          <p className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <strong>Formula:</strong> <code>Controller Amps = (Total Panel Watts / System Voltage) * {controllerSafetyFactor}</code>
          </p>
        </div>
      </CollapsibleSection>

      <button id="calculate-button" onClick={calculate} className="w-full py-3 px-6 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors text-xl shadow-lg">
        <i className="fas fa-calculator mr-2"></i> Calculate System Specs
      </button>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center space-y-3">
        {output && !isOutputVisible && (
          <a href="#output-summary" className="py-3 px-4 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-colors shadow-lg animate-bounce flex items-center text-sm">
            <i className="fas fa-eye mr-2"></i> View Output
          </a>
        )}
        <button onClick={() => setIsCustomCalcOpen(true)} className="py-3 px-4 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-colors shadow-lg flex items-center text-sm">
          <i className="fas fa-tasks mr-2"></i> Custom System Check
        </button>
      </div>

      {output && <div ref={outputSummaryRef}><OutputSummary output={output} showSafeSpecs={showSafeSpecs} setShowSafeSpecs={setShowSafeSpecs} handleDownloadPdf={handleDownloadPdf} winterFactor={winterPanelFactor} /></div>}
      {modalPackage && <PackageDetailsModal pkg={modalPackage} onClose={() => setModalPackage(null)} />}
    </>
  );
};

function downloadPkg(pkg) {
  const lines = [
    `***************************************************************************`,
    `Common 24-hour Solar Setups`,
    `***************************************************************************`,
    ``,
    ``,
    `Package: ${pkg.name}`,
    `Estimated Daily Load: ${pkg.dailyWh} Wh/day`,
    `PV: ${pkg.specs.pv}`,
    `Battery (LiFePO4): ${pkg.specs.battery_lfp}`,
    `Battery (Lead-Acid): ${pkg.specs.battery_la}`,
    `Inverter: ${pkg.specs.inverter}`,
    `Controller: ${pkg.specs.controller}`,
    `Runs: ${pkg.specs.runs.join(', ')}`,
    ``,
    `===========================================================================`,
    `Generated by Solar System Calculator :`,
    `===========================================================================`,
    ``,
    `webTool developed by Fidel M. Mudzamba. `,
    ``,
    `For more info about Tool developer visit ${footerAuthorUrl}`,
    ``
  ].join('\n');
  const blob = new Blob([lines], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${tileDownloadFilenamePrefix}${pkg.key}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

/* @tweakable Hide the vertical sidebar on the About page */
const showVerticalNavOnAbout = false;

/* @tweakable Footer author display name */
const footerAuthorName = "Fidel M. Mudzamba";
/* @tweakable Footer author portfolio URL */
const footerAuthorUrl = "https://fidelmudzamba.vercel.app/";
/* @tweakable Text that precedes the author name in the footer */
const footerAuthorPrefix = "; By ";

export default App;