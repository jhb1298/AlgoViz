import './src/globals.js';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './geometry_script.js';
import './settings_manager.js';
import './algorithm_data.js';
import './chatbot.js';

/* extracted from jarvis_march.html */

        
        const IconWrapper = ({ children, size = 20, className="", ...props }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>{children}</svg>
        );
        const Play = (props) => <IconWrapper {...props}><polygon points="5 3 19 12 5 21 5 3"></polygon></IconWrapper>;
        const Pause = (props) => <IconWrapper {...props}><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></IconWrapper>;
        const SkipBack = (props) => <IconWrapper {...props}><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></IconWrapper>;
        const SkipForward = (props) => <IconWrapper {...props}><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></IconWrapper>;
        const Rewind = (props) => <IconWrapper {...props}><polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon></IconWrapper>;
        const FastForward = (props) => <IconWrapper {...props}><polygon points="13 19 22 12 13 5 13 19"></polygon><polygon points="2 19 11 12 2 5 2 19"></polygon></IconWrapper>;
        const GripHorizontal = (props) => <IconWrapper {...props}><circle cx="12" cy="9" r="1"></circle><circle cx="19" cy="9" r="1"></circle><circle cx="5" cy="9" r="1"></circle><circle cx="12" cy="15" r="1"></circle><circle cx="19" cy="15" r="1"></circle><circle cx="5" cy="15" r="1"></circle></IconWrapper>;
        const Home = (props) => <IconWrapper {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></IconWrapper>;
        const Volume2 = (props) => <IconWrapper {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></IconWrapper>;
        const VolumeX = (props) => <IconWrapper {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></IconWrapper>;
        const ChevronUp = (props) => <IconWrapper {...props}><polyline points="18 15 12 9 6 15"></polyline></IconWrapper>;
        const ChevronDown = (props) => <IconWrapper {...props}><polyline points="6 9 12 15 18 9"></polyline></IconWrapper>;

        const DEFAULT_POINTS = [
            { id: 'A', x: 300, y: 400 }, { id: 'B', x: 500, y: 300 },
            { id: 'C', x: 700, y: 450 }, { id: 'D', x: 400, y: 600 },
            { id: 'E', x: 600, y: 700 }, { id: 'F', x: 800, y: 600 },
            { id: 'G', x: 500, y: 500 }, { id: 'H', x: 650, y: 550 },
            { id: 'I', x: 450, y: 350 }, { id: 'J', x: 750, y: 350 }
        ];

        function crossProduct(o, a, b) {
            return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
        }

        function generateSimulation(points) {
            const history = [];
            if (points.length < 3) return history;

            const n = points.length;
            const hull = [];

            // 1. Find leftmost point
            let l = 0;
            for (let i = 1; i < n; i++) {
                if (points[i].x < points[l].x) l = i;
            }

            history.push({
                stepId: 0, points, hull: [], current: null, candidate: null, target: null,
                algoLine: 1,
                status: 'START', desc: "Finding starting point...",
                speech: GEOMETRY_SCRIPT.JARVIS.START()
            });

            history.push({
                stepId: history.length, points, hull: [], current: points[l], candidate: null, target: null,
                algoLine: 1,
                status: 'START_POINT', desc: `Starting at leftmost point ${points[l].id}`,
                speech: GEOMETRY_SCRIPT.JARVIS.PICK_START(points[l])
            });

            let p = l, q;
            do {
                hull.push(points[p]);
                q = (p + 1) % n;

                for (let i = 0; i < n; i++) {
                    if (i === p) continue;
                    
                    history.push({
                        stepId: history.length, points, hull: [...hull], current: points[p], candidate: points[q], target: points[i],
                        algoLine: 4,
                        status: 'SCANNING', desc: `Comparing ${points[q].id} and ${points[i].id}`,
                        speech: GEOMETRY_SCRIPT.JARVIS.SCANNING(points[p], points[q], points[i])
                    });

                    if (crossProduct(points[p], points[i], points[q]) < 0) {
                        q = i;
                    }
                }

                p = q;
                if (p !== l) {
                    history.push({
                        stepId: history.length, points, hull: [...hull], current: points[p], candidate: null, target: null,
                        algoLine: 6,
                        status: 'NEXT', desc: `Added ${points[p].id} to hull`,
                        speech: GEOMETRY_SCRIPT.JARVIS.NEXT_POINT(points[p])
                    });
                }

            } while (p !== l);

            history.push({
                stepId: history.length, points, hull: [...hull, points[l]], current: null, candidate: null, target: null,
                algoLine: 8,
                status: 'SUCCESS', desc: "Hull Complete!",
                speech: GEOMETRY_SCRIPT.JARVIS.SUCCESS()
            });

            return history;
        }

        const App = () => {
            const { SettingsIcon, SettingsModal, AlgorithmPanel } = useMemo(() => window.initSettingsComponents(React), []);
            const [isSettingsOpen, setIsSettingsOpen] = useState(false);
            const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('simulation_settings') || '{"fontSize": 16, "nodeColor": "#3b82f6"}'));
            useEffect(() => {
                const handleUpdate = () => setSettings(JSON.parse(localStorage.getItem('simulation_settings') || '{"fontSize": 16, "nodeColor": "#3b82f6"}'));
                window.addEventListener('simulation_settings_updated', handleUpdate);
                return () => window.removeEventListener('simulation_settings_updated', handleUpdate);
            }, []);
            const [points, setPoints] = useState(DEFAULT_POINTS);
            const [currentStep, setCurrentStep] = useState(0);
            const [isPlaying, setIsPlaying] = useState(false);
            const [speedMultiplier, setSpeedMultiplier] = useState(1);
            const [zoom, setZoom] = useState(0.8);
            const [isMuted, setIsMuted] = useState(false);
            const [isMinimized, setIsMinimized] = useState(false);
            
            const [camTarget, setCamTarget] = useState({ x: 0, y: 0 });
            const [manualOffset, setManualOffset] = useState({ x: 0, y: 0 });
            const [panelOffset, setPanelOffset] = useState({ x: 0, y: 0 });
            const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
            const [isDraggingPanel, setIsDraggingPanel] = useState(false);
            const canvasDragStart = useRef({ x: 0, y: 0 });
            const panelDragStart = useRef({ x: 0, y: 0 });
            const isPlayingRef = useRef(false);
            isPlayingRef.current = isPlaying;

            const history = useMemo(() => generateSimulation(points), [points]);

            const nextStep = () => { setCurrentStep(prev => (prev < history.length - 1 ? prev + 1 : (setIsPlaying(false), prev))); };
            const prevStep = () => { setCurrentStep(prev => Math.max(0, prev - 1)); setIsPlaying(false); };

            const speak = (text) => {
                const delay = (1000 / speedMultiplier);
                if (isMuted || !text) { setTimeout(() => { if(isPlayingRef.current) nextStep(); }, delay); return; }
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.pitch = 1.1; utterance.rate = 1.1 * speedMultiplier;
                utterance.onend = () => { if(isPlayingRef.current) nextStep(); };
                window.speechSynthesis.speak(utterance);
            };

            useEffect(() => {
                if (isPlaying) speak(history[currentStep]?.speech);
                else window.speechSynthesis.cancel();
            }, [isPlaying, currentStep]);

            const state = history[currentStep] || { points: [], hull: [] };

            const handleCanvasClick = (e) => {
                if (isPlaying || isDraggingCanvas) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left - manualOffset.x - camTarget.x) / zoom;
                const y = (e.clientY - rect.top - manualOffset.y - camTarget.y) / zoom;
                const newPoint = { id: String.fromCharCode(65 + points.length % 26) + (Math.floor(points.length/26)||''), x, y };
                setPoints([...points, newPoint]);
                setCurrentStep(0);
            };

            return (
                <div className="h-screen w-screen flex flex-col relative overflow-hidden bg-slate-900 text-white select-none" onMouseMove={(e) => { if(isDraggingPanel) setPanelOffset({x: e.clientX-panelDragStart.current.x, y: e.clientY-panelDragStart.current.y}); else if(isDraggingCanvas) setManualOffset({x: e.clientX-canvasDragStart.current.x, y: e.clientY-canvasDragStart.current.y}); }} onMouseUp={() => {setIsDraggingCanvas(false); setIsDraggingPanel(false);}}>
                    <div className="absolute top-0 left-0 right-0 z-[60] top-nav-area">
                        <div className="absolute top-0 left-0 w-full h-4 z-[70] peer"></div>
                        <div className="relative h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-6 shadow-2xl transition-transform duration-300 -translate-y-full peer-hover:translate-y-0 hover:translate-y-0 z-[60]">
                            <div className="flex items-center gap-4"><a href="index.html" className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"><Home size={20} /></a><div><h1 className="font-bold text-lg leading-none tracking-tight">Jarvis March Visualizer</h1><span className="text-xs text-slate-400 font-mono">Gift Wrapping Convex Hull</span><button onClick={() => setIsSettingsOpen(true)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white shadow-lg"><SettingsIcon size={20}/></button></div></div>
                            <div className="flex gap-4">
                                <button onClick={() => { setPoints(DEFAULT_POINTS); setCurrentStep(0); }} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-all border border-slate-700">Reset Points</button>
                                <div className="flex items-center px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] text-blue-400 font-bold uppercase tracking-wider">Click canvas to add points</div>
                            </div>
                        </div>
                    </div>

                    
                    <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
                    <AlgorithmPanel algoKey="JARVIS_MARCH" currentLine={state?.algoLine} />
                    <div className="flex-1 relative infinite-bg overflow-hidden cursor-crosshair" onClick={handleCanvasClick} onWheel={(e) => setZoom(z => Math.min(Math.max(0.2, z-e.deltaY*0.001), 2))} onMouseDown={(e) => {if(!e.target.closest('.control-panel-wrapper')) {setIsDraggingCanvas(true); canvasDragStart.current={x: e.clientX-manualOffset.x, y: e.clientY-manualOffset.y};}}}>
                        <div className={`absolute left-0 top-0 w-full h-full ${isDraggingCanvas ? '' : 'camera-layer'}`} style={{ transform: `translate(${manualOffset.x}px, ${manualOffset.y}px) scale(${zoom})` }}>
                            <svg className="absolute top-0 left-0 overflow-visible w-full h-full">
                                {/* Connections */}
                                {state.hull.length > 1 && (
                                    <path d={`M ${state.hull.map(p => `${p.x},${p.y}`).join(' L ')}`} fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" strokeWidth="4" className="transition-all duration-500" />
                                )}
                                
                                {/* Current Scanning Lines */}
                                {state.current && state.candidate && (
                                    <line x1={state.current.x} y1={state.current.y} x2={state.candidate.x} y2={state.candidate.y} stroke="#6366f1" strokeWidth="2" />
                                )}
                                {state.current && state.target && (
                                    <line x1={state.current.x} y1={state.current.y} x2={state.target.x} y2={state.target.y} stroke="#f43f5e" strokeWidth="2" className="line-scanning" />
                                )}

                                {/* Points */}
                                {state.points.map((p, i) => {
                                    const isHull = state.hull.some(hp => hp.id === p.id);
                                    const isActive = state.current?.id === p.id || state.candidate?.id === p.id || state.target?.id === p.id;
                                    return (
                                        <g key={p.id} className="point">
                                            <circle cx={p.x} cy={p.y} r={isHull ? 8 : 6} fill={isActive ? "#fff" : (isHull ? "#10b981" : "#475569")} stroke={isActive ? "#6366f1" : "none"} strokeWidth="4" />
                                            <text x={p.x} y={p.y - 15} textAnchor="middle" className="text-[10px] font-bold fill-slate-400 pointer-events-none">{p.id}</text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>

                    <div className="absolute bottom-6 left-1/2 w-full max-w-4xl px-4 z-50 control-panel-wrapper" style={{ transform: `translate(calc(-50% + ${panelOffset.x}px), ${panelOffset.y}px)` }}>
                        <div className={`bg-slate-900/40 hover:bg-slate-900/85 backdrop-blur-md border border-slate-600/30 rounded-2xl shadow-2xl flex flex-col relative box-border transition-all duration-300 ${isMinimized ? 'w-fit min-w-[180px] mx-auto px-4 pb-3 pt-1' : 'px-5 pb-4 pt-2'}`}>
                            <div className="w-full h-6 cursor-grab active:cursor-grabbing flex justify-center items-center mb-1" onMouseDown={(e) => {e.preventDefault(); setIsDraggingPanel(true); panelDragStart.current={x:e.clientX-panelOffset.x, y:e.clientY-panelOffset.y}; e.stopPropagation();}}>
                                <div className="bg-white/10 rounded-full px-6 py-0.5"><GripHorizontal size={12} className="text-white/50" /></div>
                            </div>
                            <button onClick={() => setIsMinimized(!isMinimized)} className="absolute top-2 right-2 p-1 hover:bg-slate-700/50 rounded-md text-slate-400 hover:text-white transition-colors z-50">{isMinimized ? <ChevronUp size={16}/> : <ChevronDown size={18}/>}</button>
                            {isMinimized ? (
                                <div className="flex items-center justify-center gap-4">
                                    <button onClick={prevStep} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-200"><Rewind size={18}/></button>
                                    <button onClick={() => setIsPlaying(!isPlaying)} className={`w-10 h-10 flex items-center justify-center rounded-full shadow-lg transform transition-all active:scale-95 border border-white/20 ${isPlaying ? 'bg-amber-500' : 'bg-blue-600'}`}>{isPlaying ? <Pause fill="white" size={18} /> : <Play fill="white" size={18} className="ml-1"/>}</button>
                                    <button onClick={nextStep} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-200"><FastForward size={18}/></button>
                                </div>
                            ) : (
                                <>
                                    <div className="relative w-full h-1.5 bg-slate-800/80 rounded-full mb-3 mt-1"><div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-100" style={{ width: `${(currentStep / (history.length-1)) * 100}%` }}></div><input type="range" min="0" max={history.length - 1} value={currentStep} onChange={(e) => { setIsPlaying(false); setCurrentStep(Number(e.target.value)); }} className="absolute -top-2 left-0 w-full h-6 opacity-0 cursor-pointer z-10" /></div>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex flex-col w-[30%] overflow-hidden pr-2"><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Step {String(currentStep).padStart(3, '0')}</span><span className="text-sm font-mono text-emerald-300 truncate">{state?.desc}</span></div>
                                        <div className="flex items-center justify-center gap-3 w-[40%]"><button onClick={() => setCurrentStep(0)} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-300 transition-colors"><SkipBack size={16}/></button><button onClick={prevStep} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-200 transition-colors"><Rewind size={18}/></button><button onClick={() => setIsPlaying(!isPlaying)} className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transform transition-all active:scale-95 border border-white/20 ${isPlaying ? 'bg-amber-500' : 'bg-blue-600'}`}>{isPlaying ? <Pause fill="white" size={20} /> : <Play fill="white" size={20} className="ml-1"/>}</button><button onClick={nextStep} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-200 transition-colors"><FastForward size={18}/></button><button onClick={() => setCurrentStep(history.length - 1)} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-300 transition-colors"><SkipForward size={16}/></button></div>
                                        <div className="flex items-center justify-end gap-4 w-[30%]"><button onClick={() => setIsMuted(!isMuted)} className={`p-2 rounded-lg transition-colors ${isMuted ? 'text-rose-400 bg-rose-400/10' : 'text-blue-400 bg-blue-400/10'}`}>{isMuted ? <VolumeX size={18}/> : <Volume2 size={18}/>}</button>
                                        <div className="flex flex-col gap-1 items-end w-24">
                                            <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Speed {speedMultiplier}x</span>
                                            <input type="range" min="0.5" max="2.0" step="0.1" value={speedMultiplier} onChange={(e) => setSpeedMultiplier(Number(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-400" />
                                        </div></div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            );
        };
        createRoot(document.getElementById('root')).render(<App />);
    
