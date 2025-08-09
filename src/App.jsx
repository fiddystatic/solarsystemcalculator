import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Chart } from "chart.js/auto";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
             {/* Top Navbar for all screens */}
            <nav className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center w-full z-20 sticky top-0">
                <div className="flex items-center space-x-8">
                    <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">SSC</h1>
                    <div className="flex space-x-2">
                        <button onClick={() => setPage('calculator')} className={`${navClasses} ${page === 'calculator' && activeNavClasses}`}>Calculator</button>
                        <button onClick={() => setPage('about')} className={`${navClasses} ${page === 'about' && activeNavClasses}`}>About</button>
                    </div>
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
                <aside className="flex flex-col w-20 hover:w-64 transition-all duration-300 bg-white dark:bg-gray-800 p-4 shadow-lg flex-shrink-0 fixed top-0 h-full z-10 pt-20">
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
                <main className="flex-1 p-4 sm:p-6 md:p-10 ml-20">
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

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 p-4 text-center text-sm shadow-inner mt-auto">
            <p>&copy; {new Date().getFullYear()} Solar System Calculator (SSC). All Rights Reserved.</p>
            <p>Made with ❤️ to help you harness the power of the sun.</p>
        </footer>
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

const CalculatorPage = ({ setIsCustomCalcOpen }) => {
    /* @tweakable Default system voltage for calculations */
    const [systemVoltage, setSystemVoltage] = useState(12);
    /* @tweakable Default battery type for main calculations */
    const [batteryType, setBatteryType] = useState('Lithium');
    /* @tweakable Default type for a new device. Options: 'AC' or 'DC'. */
    const defaultDeviceType = 'AC';
    /* @tweakable Default time of use for a new device. Options: 'Day', 'Night', 'Both'. */
    const defaultTimeOfUse = 'Day';
    /* @tweakable Default quantity for a new device. */
    const defaultDeviceQuantity = 1;
    /* @tweakable Default state for a new device, including power type and values. */
    const initialDeviceState = { name: 'LED Bulb', powerType: 'AC', power: 10, volts: 0, amps: 0, hours: 5, type: defaultDeviceType, timeOfUse: defaultTimeOfUse, dayHours: 5, nightHours: 0, quantity: defaultDeviceQuantity };
    const [devices, setDevices] = useState([initialDeviceState]);
    const [daysOfAutonomy, setDaysOfAutonomy] = useState(1);
    /* @tweakable Default peak sun hours per day */
    const [sunHours, setSunHours] = useState(5);
    const [output, setOutput] = useState(null);
    const [showSafeSpecs, setShowSafeSpecs] = useState(false);
    const [isOutputVisible, setIsOutputVisible] = useState(false);
    const outputSummaryRef = useRef(null);
    /* @tweakable Winter efficiency factor. 1.5 means 50% more panels needed in winter. */
    const winterPanelFactor = 1.5;

    /* @tweakable Safety factor for inverter sizing. Default is 1.25 (25% buffer). */
    const inverterSafetyFactor = 1.25;
    /* @tweakable Safety factor for charge controller sizing. Default is 1.25 (25% buffer). */
    const controllerSafetyFactor = 1.25;
    
    /* @tweakable Battery characteristics for sizing calculations. DoD is Depth of Discharge. */
    const batteryCharacteristics = {
        'Lithium':    { dod: 0.99, efficiency: 1.0 },
        'Flooded':    { dod: 0.5, efficiency: 0.8 },
        'Gel':        { dod: 0.6, efficiency: 0.85 },
        'AGM':        { dod: 0.7, efficiency: 0.9 },
    };

    /* @tweakable Recommended inverter power limits based on system voltage. */
    const inverterRecommendations = {
        '12V': { max: 1000 },
        '24V': { min: 1000, max: 2000 },
        '48V': { min: 2000, max: 4000 },
    };

    const { totalDayWh, totalNightWh, totalWattHours, totalAcWh, totalDcWh } = useMemo(() => {
        let dayWh = 0;
        let nightWh = 0;
        let acWh = 0;
        let dcWh = 0;
        devices.forEach(dev => {
            const deviceWatts = dev.powerType === 'AC' ? dev.power : (dev.volts * dev.amps);
            const quantity = dev.quantity || 1;
            const deviceDayWh = deviceWatts * dev.dayHours * quantity;
            const deviceNightWh = deviceWatts * dev.nightHours * quantity;
            dayWh += deviceDayWh;
            nightWh += deviceNightWh;

            if (dev.powerType === 'AC') {
                acWh += deviceDayWh + deviceNightWh;
            } else {
                dcWh += deviceDayWh + deviceNightWh;
            }
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
        
        // Use a temp variable for value to handle parseFloat/parseInt
        let processedValue = value;
        if (['power', 'volts', 'amps', 'hours', 'dayHours', 'nightHours', 'quantity'].includes(field)) {
            processedValue = parseFloat(value) || 0;
        }

        device[field] = processedValue;

        // When power type changes, reset power-related fields
        if (field === 'powerType') {
            device.power = 0;
            device.volts = 0;
            device.amps = 0;
        }

        if (field === 'timeOfUse') {
            if (processedValue === 'Day') {
                device.dayHours = device.hours;
                device.nightHours = 0;
            } else if (processedValue === 'Night') {
                device.dayHours = 0;
                device.nightHours = device.hours;
            } else if (processedValue === 'Both') {
                // Keep existing hours if switching to both, or reset if needed
                const currentTotalHours = parseFloat(device.hours) || 0;
                device.dayHours = currentTotalHours / 2;
                device.nightHours = currentTotalHours / 2;
            }
        } else if (field === 'hours') {
            if (device.timeOfUse === 'Day') {
                device.dayHours = processedValue;
                device.nightHours = 0;
            } else if (device.timeOfUse === 'Night') {
                device.dayHours = 0;
                device.nightHours = processedValue;
            }
            // For 'Both', hours are managed by day/night inputs directly
        } else if (field === 'dayHours' || field === 'nightHours') {
            device.hours = device.dayHours + device.nightHours;
        }

        if (field === 'quantity' && processedValue < 1) {
            device.quantity = 1;
        }

        newDevices[index] = device;
        setDevices(newDevices);
    };

    const calculate = () => {
        const inverterSize = totalACWatts * inverterSafetyFactor;
        const bChar = batteryCharacteristics[batteryType];
        
        // Battery sizing based on NIGHT load only
        const nightEnergyRequired = totalNightWh * daysOfAutonomy;
        const requiredBatteryEnergy = nightEnergyRequired / (bChar.efficiency * bChar.dod);

        const allBatterySizing = {};
        Object.keys(batteryCharacteristics).forEach(type => {
            const char = batteryCharacteristics[type];
            if (type === 'Lithium' || type === 'Flooded' || type === 'Gel' || type === 'AGM') {
                allBatterySizing[type] = (totalNightWh * daysOfAutonomy) / (char.efficiency * char.dod);
            }
        });
        
        // Solar panel sizing based on DAY load + recharging NIGHT load
        const energyToRecharge = totalNightWh / bChar.efficiency;
        const totalEnergyFromPanels = totalDayWh + energyToRecharge;
        const solarPanelWatts = totalEnergyFromPanels / sunHours;

        const controllerAmps = (solarPanelWatts / systemVoltage) * controllerSafetyFactor;

        setOutput({
            totalDayWh,
            totalNightWh,
            totalWattHours,
            totalACWatts,
            inverterSize,
            batterySizing: allBatterySizing,
            solarPanelWatts,
            controllerAmps,
            devices,
            sunHours,
            daysOfAutonomy,
            batteryType,
            systemVoltage,
            totalAcWh,
            totalDcWh,
        });
        localStorage.setItem('ssc_totalWattHours', totalWattHours);
        localStorage.setItem('ssc_sunHours', sunHours);
        setTimeout(() => document.getElementById('output-summary')?.scrollIntoView({ behavior: 'smooth' }), 100);
    };
    
    useEffect(() => {
        if (!output) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsOutputVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );
        
        const currentRef = outputSummaryRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [output]);

    const handleDownloadPdf = async () => {
        const summaryElement = document.getElementById('output-summary');
        if (!summaryElement) return;

        summaryElement.classList.add('export-mode');

        const canvas = await html2canvas(summaryElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        const newImgHeight = pdfWidth / ratio;
        let heightLeft = newImgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, newImgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft >= 0) {
            position = heightLeft - newImgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, newImgHeight);
            heightLeft -= pdfHeight;
        }
        pdf.save('solar-system-summary.pdf');
        
        summaryElement.classList.remove('export-mode');
    };

    return (
        <>
            <CollapsibleSection title="1. Load Analysis" id="load-analysis">
                {/* Header Labels */}
                <div className="hidden md:grid md:grid-cols-12 gap-2 mb-2 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    <div className="col-span-3">Device</div>
                    <div className="col-span-1 text-center">Qty</div>
                    <div className="col-span-2">Time of Use</div>
                    <div className="col-span-2">Power Details</div>
                    <div className="col-span-2 text-center">Day/Night (h)</div>
                    <div className="col-span-1 text-right">Wh</div>
                    <div className="col-span-1"></div>
                </div>

                {devices.map((device, index) => {
                    const deviceWatts = device.powerType === 'AC' ? device.power : (device.volts * device.amps);
                    const quantity = device.quantity || 1;
                    const wattHours = deviceWatts * (device.dayHours + device.nightHours) * quantity;
                    return (
                        <div key={index} className="grid grid-cols-2 md:grid-cols-12 gap-2 mb-4 items-center">
                            {/* Device Name */}
                            <div className="col-span-2 md:col-span-3">
                                <label className="md:hidden text-xs font-medium">Device</label>
                                <input type="text" placeholder="Device Name" value={device.name} onChange={e => updateDevice(index, 'name', e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                            </div>

                             {/* Quantity */}
                             <div className="col-span-2 md:col-span-1">
                                <label className="md:hidden text-xs font-medium">Quantity</label>
                                <div className="flex items-center">
                                    <button onClick={() => updateDevice(index, 'quantity', device.quantity - 1)} className="px-2 py-1 border rounded-l bg-gray-200 dark:bg-gray-600 h-[42px]">-</button>
                                    <input type="number" value={device.quantity} onChange={e => updateDevice(index, 'quantity', e.target.value)} className="w-full p-2 border-t border-b text-center bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 h-[42px]" />
                                    <button onClick={() => updateDevice(index, 'quantity', device.quantity + 1)} className="px-2 py-1 border rounded-r bg-gray-200 dark:bg-gray-600 h-[42px]">+</button>
                                </div>
                            </div>
                            
                            {/* Time of Use */}
                            <div className="col-span-2 md:col-span-2">
                                <label className="md:hidden text-xs font-medium">Time of Use</label>
                                <select value={device.timeOfUse} onChange={e => updateDevice(index, 'timeOfUse', e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 h-[42px]">
                                    <option value="Day">Day</option>
                                    <option value="Night">Night</option>
                                    <option value="Both">Both</option>
                                </select>
                            </div>

                             {/* Power Details */}
                             <div className="col-span-2 md:col-span-2">
                                <label className="md:hidden text-xs font-medium">Power Details</label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <select value={device.powerType} onChange={e => updateDevice(index, 'powerType', e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 h-[42px]">
                                            <option value="AC">AC (Watts)</option>
                                            <option value="DC">DC (Volts/Amps)</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-2">
                                        {device.powerType === 'AC' ? (
                                            <input type="number" placeholder="Watts" value={device.power} onChange={e => updateDevice(index, 'power', e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                                        ) : (
                                            <>
                                                <div className="w-1/2">
                                                    <label className="md:hidden text-xs font-medium">Volts</label>
                                                    <input type="number" placeholder="Volts" value={device.volts} onChange={e => updateDevice(index, 'volts', e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                                                </div>
                                                <div className="w-1/2">
                                                    <label className="md:hidden text-xs font-medium">Amps</label>
                                                    <input type="number" placeholder="Amps" value={device.amps} onChange={e => updateDevice(index, 'amps', e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {device.powerType === 'DC' && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">For DC devices, enter voltage and current (amps). Watts will be calculated automatically.</p>
                                    )}
                                </div>
                            </div>

                             {/* Day/Night Hours */}
                            <div className="col-span-2 md:col-span-2">
                                 <div className="flex gap-2">
                                    <div className="w-1/2">
                                        <label className="md:hidden text-xs font-medium">Day (h)</label>
                                        <input type="number" placeholder="Day" value={device.dayHours} disabled={device.timeOfUse === 'Night'} onChange={e => updateDevice(index, 'dayHours', e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-600" />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="md:hidden text-xs font-medium">Night (h)</label>
                                        <input type="number" placeholder="Night" value={device.nightHours} disabled={device.timeOfUse === 'Day'} onChange={e => updateDevice(index, 'nightHours', e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-600" />
                                    </div>
                                 </div>
                            </div>
                            
                            {/* Watt Hours & Remove */}
                            <div className="col-span-2 md:col-span-1 flex items-center justify-between">
                                <div className="text-right flex-grow">
                                    <label className="md:hidden text-xs font-medium">Watt Hours</label>
                                    <p className="p-2 font-medium whitespace-nowrap">{wattHours.toFixed(1)}</p>
                                </div>
                            </div>
                            <div className="col-span-2 md:col-span-1 flex items-center justify-center">
                                <button onClick={() => removeDevice(index)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
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
        </>
    );
};

const SolarPanelRecommendation = ({ solarPanelWatts, winterFactor, batteryType, totalWattHours, totalDayWh, totalNightWh }) => {
    const panelOptions = [100, 200, 250, 300, 390, 450, 500];
    const requiredWinterWatts = solarPanelWatts * winterFactor;

    return (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <h3 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-300">Solar Panel Combination Guide</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
                Based on your daily usage (<strong>{totalDayWh.toFixed(0)}Wh</strong> day, <strong>{totalNightWh.toFixed(0)}Wh</strong> night) and a <strong>{batteryType}</strong> battery, you need <strong>{solarPanelWatts.toFixed(0)}W</strong> of solar panels in summer. For winter, we recommend <strong>{requiredWinterWatts.toFixed(0)}W</strong> (using a {((winterFactor - 1) * 100).toFixed(0)}% winter buffer). Here are some options:
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
                    )
                })}
            </div>
        </div>
    );
}

/* @tweakable Common battery sizes in Amp-hours (Ah) for different voltages. */
const batteryBankOptions = {
    '12V': [100, 150, 200, 250],
    '24V': [100, 150, 200],
    '48V': [100, 150]
};

const BatteryRecommendation = ({ requiredWh, systemVoltage, batteryType }) => {
    const requiredAh = requiredWh / systemVoltage;
    const options = batteryBankOptions[`${systemVoltage}V`];

    if (!options) return null;

    return (
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <h3 className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-300">Battery Combination Guide ({batteryType})</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
                To achieve the required capacity of <strong>{requiredWh.toFixed(0)}Wh</strong> (approx. <strong>{requiredAh.toFixed(0)}Ah</strong> at {systemVoltage}V), here are some common {systemVoltage}V battery options. You can connect them in parallel to reach the total capacity.
            </p>
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
                    )
                })}
            </div>
             <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <strong>Note:</strong> If using 12V batteries for a 24V or 48V system, you'll need to connect them in series first to achieve the system voltage, then connect these series strings in parallel. For example, for a 24V system using 100Ah 12V batteries to get ~{requiredAh.toFixed(0)}Ah, you'd need {Math.ceil(requiredAh / 100) * 2} batteries in total ({Math.ceil(requiredAh / 100)} parallel strings of 2 batteries in series).
            </p>
        </div>
    );
}

/* @tweakable Animation duration for charts in milliseconds */
const chartAnimationDuration = 800;

const ChartComponent = ({ type, data, options, title }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const ctx = chartRef.current.getContext('2d');
            const chartOptions = {
                ...options,
                animation: {
                    duration: chartAnimationDuration
                }
            };
            chartInstance.current = new Chart(ctx, {
                type,
                data,
                options: chartOptions
            });
        }
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [type, data, options, title]);
    
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

/* @tweakable Pastel colors for bubble charts. */
const pastelColors = [
    'rgba(255, 182, 193, 0.7)', 'rgba(173, 216, 230, 0.7)', 'rgba(144, 238, 144, 0.7)',
    'rgba(255, 255, 224, 0.7)', 'rgba(216, 191, 216, 0.7)', 'rgba(255, 218, 185, 0.7)',
    'rgba(175, 238, 238, 0.7)', 'rgba(240, 230, 140, 0.7)'
];

/* @tweakable Bubble radius scaling factor for device impact chart */
const deviceBubbleScaleFactor = 5;

const BubbleChartSection = ({ output }) => {
    const [activeTab, setActiveTab] = useState('deviceImpact');
    const { devices, solarPanelWatts, sunHours, batterySizing, batteryType } = output;

    const tabClasses = "px-4 py-2 rounded-t-lg font-semibold transition-colors";
    const activeTabClasses = "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400";
    const inactiveTabClasses = "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600";

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
    
    /* @tweakable Factors for weather scenarios relative to user-input sun hours. */
    const weatherScenariosFactors = { 'Sunny': 1, 'Partly Cloudy': 0.6, 'Overcast': 0.3 };

    const weatherImpactData = {
        datasets: Object.entries(weatherScenariosFactors).map(([label, factor], i) => {
            const scenarioSunHours = sunHours * factor;
            return {
                label: label,
                data: [{
                    x: scenarioSunHours,
                    y: solarPanelWatts * scenarioSunHours,
                    r: batterySizing[batteryType] / 50 // Scale for visibility
                }],
                backgroundColor: pastelColors[i % pastelColors.length]
            };
        })
    };

    const deviceImpactOptions = {
        scales: {
            x: { title: { display: true, text: 'Device Energy Usage (Wh/day)' } },
            y: { title: { display: true, text: 'Device Power (Watts)' } }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.dataset.label || '';
                        const point = context.raw;
                        return `${label}: ${point.x.toFixed(0)}Wh/day, ${point.y.toFixed(0)}W, ${(point.r / deviceBubbleScaleFactor).toFixed(1)}h`;
                    }
                }
            }
        }
    };

    const weatherImpactOptions = {
        scales: {
            x: { title: { display: true, text: 'Sun Hours per Day' } },
            y: { title: { display: true, text: 'Energy Generated (Wh)' } }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.dataset.label || '';
                        const point = context.raw;
                        return `${label}: ${point.x.toFixed(1)} sun hours, ${point.y.toFixed(0)}Wh generated. Battery needed: ${batterySizing[batteryType].toFixed(0)}Wh`;
                    }
                }
            }
        }
    };

    return (
        <div className="my-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Impact Analysis</h3>
            <div className="flex border-b border-gray-300 dark:border-gray-600">
                <button onClick={() => setActiveTab('deviceImpact')} className={`${tabClasses} ${activeTab === 'deviceImpact' ? activeTabClasses : inactiveTabClasses}`}>
                    Device Impact Map
                </button>
                <button onClick={() => setActiveTab('weatherImpact')} className={`${tabClasses} ${activeTab === 'weatherImpact' ? activeTabClasses : inactiveTabClasses}`}>
                    Weather Impact Map
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-b-lg shadow-md">
                {activeTab === 'deviceImpact' && (
                    <ChartComponent type="bubble" data={deviceImpactData} options={deviceImpactOptions} title="Device Impact: Energy vs Power vs Usage Time" />
                )}
                {activeTab === 'weatherImpact' && (
                    <ChartComponent type="bubble" data={weatherImpactData} options={weatherImpactOptions} title="Weather Impact: Sun Hours vs Generation vs Storage" />
                )}
            </div>
        </div>
    );
};

const OutputSummary = ({ output, showSafeSpecs, setShowSafeSpecs, handleDownloadPdf, winterFactor }) => {
    const { totalDayWh, totalNightWh, totalWattHours, totalACWatts, inverterSize, batterySizing, solarPanelWatts, controllerAmps, devices, sunHours, daysOfAutonomy, batteryType, systemVoltage, totalAcWh, totalDcWh } = output;
    
    const allBatteryTypes = Object.keys(batterySizing);
    const allBatteryValues = Object.values(batterySizing);
    
    /* @tweakable Colors for the battery capacity chart. */
    const batteryChartColors = ['#4ade80', '#fbbf24', '#60a5fa', '#f87171', '#c084fc', '#818cf8'];
    
    /* @tweakable Background color for the system balance chart. */
    const systemBalanceBgColor = 'rgba(54, 162, 235, 0.2)';
    /* @tweakable Border color for the system balance chart. */
    const systemBalanceBorderColor = 'rgb(54, 162, 235)';
    
    /* @tweakable Use Amp-hours (Ah) for battery in system balance chart. If false, Watt-hours (Wh) will be used. */
    const useAhForBatteryInChart = true;

    /* @tweakable Background color for the supply line in the energy chart. */
    const supplyLineBgColor = 'rgba(34, 197, 94, 0.2)';
    /* @tweakable Border color for the supply line in the energy chart. */
    const supplyLineBorderColor = 'rgb(34, 197, 94)';
    /* @tweakable Background color for the demand line in the energy chart. */
    const demandLineBgColor = 'rgba(239, 68, 68, 0.2)';
    /* @tweakable Border color for the demand line in the energy chart. */
    const demandLineBorderColor = 'rgb(239, 68, 68)';

    /* @tweakable Night supply background color on polar chart */
    const nightSupplyPolarBg = "rgba(0, 0, 255, 0.6)";
    /* @tweakable Night demand background color on polar chart */
    const nightDemandPolarBg = "rgba(128, 0, 128, 0.6)";
    /* @tweakable Border color for polar chart segments. This is the line circling each area. */
    const polarChartBorderColor = "white";

    /* @tweakable Background colors for the energy supply/demand polar chart. [Day Supply, Night Supply, Day Demand, Night Demand] */
    const energyPolarChartBackgroundColors = [
        "rgba(0,255,0,0.6)",
        nightSupplyPolarBg,
        "rgba(255,0,0,0.6)",
        nightDemandPolarBg
    ];
    /* @tweakable Border colors for the energy supply/demand polar chart. [Day Supply, Night Supply, Day Demand, Night Demand] */
    const energyPolarChartBorderColors = [
        polarChartBorderColor,
        polarChartBorderColor,
        polarChartBorderColor,
        polarChartBorderColor
    ];

    /* @tweakable Cutout percentage for the AC/DC donut chart. 50% makes it a donut, 0% makes it a pie. */
    const acDcDonutCutout = '50%';
    /* @tweakable Colors for the AC/DC load distribution donut chart. */
    const acDcChartColors = ['#3b82f6', '#10b981'];

    /* @tweakable Whether to display the legend on the battery capacity chart. */
    const showBatteryChartLegend = false;

    const requiredWhForSelectedType = batterySizing[batteryType];
    const batteryValueForChart = useAhForBatteryInChart ? requiredWhForSelectedType / systemVoltage : requiredWhForSelectedType;
    const batteryLabelForChart = useAhForBatteryInChart ? `Battery (Ah)` : `Battery (Wh)`;

    const chartData = {
        loadPerDevice: {
            labels: devices.map(d => d.name || 'Unnamed'),
            datasets: [{
                label: 'Watt-hours per device',
                data: devices.map(d => (d.powerType === 'AC' ? d.power : (d.volts * d.amps)) * (d.dayHours + d.nightHours) * (d.quantity || 1)),
                backgroundColor: ['#4ade80', '#fbbf24', '#60a5fa', '#f87171', '#c084fc', '#818cf8'],
            }]
        },
        dayNightLoad: {
            labels: ['Day Load (Wh)', 'Night Load (Wh)'],
            datasets: [{
                label: 'Load Distribution',
                data: [totalDayWh, totalNightWh],
                backgroundColor: ['#fbbf24', '#4f46e5'],
            }]
        },
        acDcLoad: {
            labels: ['AC Load (Wh)', 'DC Load (Wh)'],
            datasets: [{
                label: 'AC vs DC Load',
                data: [totalAcWh, totalDcWh],
                backgroundColor: acDcChartColors,
            }]
        },
        energySupplyDemand: {
            labels: ["Day Supply (Wh)", "Night Supply (Wh)", "Day Demand (Wh)", "Night Demand (Wh)"],
            datasets: [{
                label: "Energy Supply & Demand",
                data: [solarPanelWatts * sunHours, 0, totalDayWh, totalNightWh],
                backgroundColor: energyPolarChartBackgroundColors,
                borderColor: energyPolarChartBorderColors,
                borderWidth: 1
            }]
        },
        batteryCapacityByType: {
            labels: allBatteryTypes,
            datasets: [{
                label: 'Required Capacity (Wh)',
                data: allBatteryValues,
                backgroundColor: batteryChartColors,
            }]
        },
        systemBalance: {
             labels: ['Load (W)', `Inverter (W)`, `Panels (W)`, `Controller (A)`, batteryLabelForChart],
             datasets: [{
                label: 'System Components Rating',
                data: [totalACWatts, inverterSize, solarPanelWatts, controllerAmps, batteryValueForChart],
                backgroundColor: systemBalanceBgColor,
                borderColor: systemBalanceBorderColor,
                pointBackgroundColor: systemBalanceBorderColor,
             }]
        }
    };

    const safeSpecs = {
        days: 3,
        panelBuffer: 1.3,
        inverterBuffer: 1.3
    };
    const safeBatteryWh = (totalWattHours * safeSpecs.days) / (0.8 * 0.5); // Lead-acid worst case
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-center">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Total Consumption</h3>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalWattHours.toFixed(2)} <span className="text-xl">Wh/day</span></p>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">Inverter Size</h3>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{inverterSize.toFixed(2)} <span className="text-xl">W</span></p>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-yellow-500 dark:text-yellow-400">Panel Wattage</h3>
                    <p className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">{solarPanelWatts.toFixed(2)} <span className="text-xl">W</span></p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-indigo-500 dark:text-indigo-400">Controller Size</h3>
                    <p className="text-3xl font-bold text-indigo-500 dark:text-indigo-400">{controllerAmps.toFixed(2)} <span className="text-xl">A</span></p>
                </div>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8">
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

            <BatteryRecommendation 
                requiredWh={requiredWhForSelectedType}
                systemVoltage={systemVoltage}
                batteryType={batteryType}
            />

            <div className="my-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Visualizations</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartComponent type="pie" data={chartData.dayNightLoad} title="Day vs. Night Load Distribution" />
                    <ChartComponent type="doughnut" data={chartData.acDcLoad} title="AC vs. DC Load Distribution" options={{ cutout: acDcDonutCutout }} />
                    <ChartComponent type="bar" data={chartData.loadPerDevice} title="Load per Device (Wh/day)" options={{scales: {y: {beginAtZero: true}}}} />
                    <ChartComponent type="polarArea" data={chartData.energySupplyDemand} title="Energy Supply vs Demand" options={{ responsive: true, plugins: { legend: { position: 'right' } } }}/>
                    <ChartComponent type="bar" data={chartData.batteryCapacityByType} title="Required Battery Capacity by Type (Wh)" options={{ indexAxis: 'y', responsive: true, plugins: { legend: { display: showBatteryChartLegend } }, scales: { x: { beginAtZero: true } } }} />
                    <ChartComponent type="radar" data={chartData.systemBalance} title="System Component Balance" />
                </div>
            </div>
            
            <BubbleChartSection output={output} />

            <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-yellow-800 dark:text-yellow-300">Recommended Tips</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li><strong>Battery Protection:</strong> Never drain your batteries completely. The calculations account for safe Depth of Discharge (DoD) - e.g., 50% for Lead-Acid, 99% for Lithium.</li>
                    <li><strong>Night Loads Matter:</strong> Night loads have the highest impact on battery size and cost. Shifting usage to daytime can significantly reduce the battery capacity you need.</li>
                    <li><strong>Day Loads & Solar:</strong> Day loads can often be powered directly by your solar panels, reducing the strain on your batteries and improving system efficiency.</li>
                    <li><strong>AC vs DC:</strong> Using DC appliances where possible can be more efficient as it avoids conversion losses from an inverter (DC battery -> AC appliance).</li>
                    <li><strong>Rainy/Winter Seasons:</strong> Expect fewer sun hours and consider increasing your "Days of Autonomy" to 3-5 to compensate for consecutive cloudy days.</li>
                    <li><strong>Winter Production:</strong> You may need 30-50% more solar panels in winter due to shorter days and lower sun angle. The "Solar Panel Combination Guide" accounts for this.</li>
                </ul>
            </div>
            
            <div className="text-center">
                <button onClick={() => setShowSafeSpecs(!showSafeSpecs)} className="px-6 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg">
                    {showSafeSpecs ? 'Hide' : 'Show'} Safe Specs for Bad Weather
                </button>
            </div>
            
            {showSafeSpecs && (
                 <div className="mt-8 p-6 bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 rounded-lg animate-fade-in">
                    <h3 className="text-2xl font-bold mb-4 text-red-800 dark:text-red-300">Safe Specifications ({safeSpecs.days} Rainy Days)</h3>
                    <div className="space-y-4">
                        <p><strong>Mismatch Alert:</strong> The solar array of <strong>{solarPanelWatts.toFixed(0)}W</strong> may not fully charge a battery bank sized for your night load in <strong>{sunHours}</strong> hours, especially on cloudy days.</p>
                        <p><strong>Suggested Combo:</strong> For <strong>{safeSpecs.days}</strong> sunless days, we recommend:</p>
                        <ul className="list-disc list-inside ml-4 text-lg">
                            <li>Minimum Battery Size (based on total load, worst-case Lead-Acid): <strong>{safeBatteryWh.toFixed(0)} Wh</strong> (~{(safeBatteryWh / systemVoltage).toFixed(0)} Ah @{systemVoltage}V)</li>
                            <li>Minimum Panel Array: <strong>{safePanelWatts.toFixed(0)} W</strong> (includes {((safeSpecs.panelBuffer-1)*100).toFixed(0)}% buffer for low light)</li>
                            <li>Minimum Inverter Size: <strong>{safeInverterSize.toFixed(0)} W</strong> (includes {((safeSpecs.inverterBuffer-1)*100).toFixed(0)}% buffer for motor startup loads)</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

const AboutPage = () => {
    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-4 border-b pb-2">How It Works</h2>
                <p className="mb-4">The Solar System Calculator (SSC) is designed to simplify the process of sizing a residential off-grid solar power system. It uses standard industry formulas to provide reliable estimates for your power needs.</p>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-semibold">1. Load Analysis</h3>
                        <p>We calculate your total daily energy consumption in Watt-hours (Wh). Formula: <code>Total Wh = Σ (Appliance Watts × Hours of Use)</code></p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">2. Inverter Sizing</h3>
                        <p>The inverter must handle the total simultaneous load. We add a 25% safety margin. Formula: <code>Inverter Size (W) = Total Watts × 1.25</code></p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">3. Battery Sizing</h3>
                        <p>Calculates the required battery bank capacity based on your energy needs, desired autonomy, and battery type efficiency. For example, for Lead-Acid: <code>Capacity (Wh) = (Total Wh × Days of Autonomy) / (0.8 efficiency × 0.5 DoD)</code></p>
                    </div>
                     <div>
                        <h3 className="text-xl font-semibold">4. Solar Panel Sizing</h3>
                        <p>Determines the solar array wattage needed to recharge your batteries daily. Formula: <code>Panel Watts = Required Battery Wh / Peak Sun Hours</code></p>
                    </div>
                </div>
            </div>
            
             <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
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
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold mb-4 border-b pb-2">About the Developer</h2>
                <p className="mb-4">This tool was created by a passionate developer dedicated to making renewable energy more accessible. The goal is to empower individuals to make informed decisions about their energy independence.</p>
                <div className="flex space-x-6">
                    <a href="https://fidelmudzamba.vercel.app" target="_blank" className="text-blue-500 hover:underline text-lg"><i className="fab fa-solid fa-globe mr-2"></i>Website/Portfolio</a>
                    <a href="https://github.com" target="_blank" className="text-blue-500 hover:underline text-lg"><i className="fab fa-github mr-2"></i>GitHub</a>
                    <a href="https://www.linkedin.com/in/fidel-mudzamba-74b11215a" target="_blank" className="text-blue-500 hover:underline text-lg"><i className="fab fa-linkedin mr-2"></i>LinkedIn</a>
                    <a href="mailto:fidelmudzamba7@gmail.com" className="text-blue-500 hover:underline text-lg"><i className="fas fa-envelope mr-2"></i>Email</a>
                </div>
            </div>
        </div>
    );
};

/* @tweakable Safeguard efficiency multiplier for custom calculations. 0.8 means 80% efficiency. */
const customCalcSafeguard = 0.8;

const CustomSystemCheckModal = ({ isOpen, onClose, label }) => {
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
            systemStatus = "✅ Sustainable: Your panels generate more energy than you consume daily. The system should run indefinitely under these conditions.";
        } else {
            const daysToDeplete = batteryWh / Math.abs(netEnergy);
            systemStatus = ` unsustainable. Your battery will be fully depleted in ~${daysToDeplete.toFixed(1)} days if not recharged by other means.`;
            if (dailyChargeWh > 0) {
                 systemStatus = `⚠️ Not Sustainable: Your panels help, but can't keep up with the daily load.` + systemStatus;
            } else {
                 systemStatus = `❌ Unsustainable: You have no solar input.` + systemStatus;
            }
        }
        
        setResult({ duration, netEnergy, systemStatus });
    };

    if (!isOpen) return null;

    /* @tweakable Maximum height of the custom system check modal before scrolling is enabled */
    const modalMaxHeight = '90vh';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-2xl overflow-y-auto" style={{ maxHeight: modalMaxHeight }} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white dark:bg-gray-800 py-2 -mt-8 -mx-8 px-8 z-10">
                    <h2 className="text-2xl font-bold">Custom System Check</h2>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center">
                        <i className="fas fa-times mr-2"></i> {label || 'Close'}
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block font-medium mb-1">Your Inverter (W)</label>
                        <input type="number" value={inverterW} onChange={e => setInverterW(parseFloat(e.target.value))} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700" />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Total Solar Panel (W)</label>
                        <input type="number" value={panelW} onChange={e => setPanelW(parseFloat(e.target.value))} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700" />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Battery Capacity (Ah)</label>
                        <input type="number" value={batteryAh} onChange={e => setBatteryAh(parseFloat(e.target.value))} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700" />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Battery Voltage (V)</label>
                        <select value={batteryV} onChange={e => setBatteryV(parseInt(e.target.value))} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700">
                            <option value="12">12V</option>
                            <option value="24">24V</option>
                            <option value="48">48V</option>
                        </select>
                    </div>
                </div>
                
                <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-md mb-6">
                    <p>Daily Load: <span className="font-bold">{dailyLoadWh.toFixed(0)} Wh</span> (from calculator)</p>
                    <p>Total Battery: <span className="font-bold">{batteryWh.toFixed(0)} Wh</span> ({batteryAh}Ah @ {batteryV}V)</p>
                    <p>Sun Hours: <span className="font-bold">{sunHours} h</span> (from calculator)</p>
                </div>

                <button onClick={calculateCustom} className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">Check My System</button>
                
                {result && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg animate-fade-in">
                        <h3 className="text-xl font-bold mb-2">Results</h3>
                        <p><strong>System Autonomy:</strong> Your battery can power your load for approximately <strong className="text-xl text-blue-600 dark:text-blue-400">{result.duration.toFixed(1)} days ({(result.duration * 24).toFixed(1)} hours)</strong> from a full charge, with a {((1-customCalcSafeguard)*100).toFixed(0)}% safety buffer.</p>
                        <p className="mt-2"><strong>Daily Energy Balance:</strong> Your system has a daily net of <strong className={`text-xl ${result.netEnergy >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{result.netEnergy.toFixed(0)} Wh</strong>.</p>
                        <p className="mt-2"><strong>Status:</strong> {result.systemStatus}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
 
export default App;
