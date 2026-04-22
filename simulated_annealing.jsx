import './src/globals.js';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './optimization_script.js';
import './settings_manager.js';
import './algorithm_data.js';
import './chatbot.js';

/* extracted from simulated_annealing.html */

        
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

        const NODE_COUNT = 15;
        const INITIAL_TEMP = 1000;
        const COOLING_RATE = 0.995;

        function generateNodes() {
            const nodes = [];
            for (let i = 0; i < NODE_COUNT; i++) {
                nodes.push({
                    id: i,
                    x: 200 + Math.random() * 600,
                    y: 200 + Math.random() * 600
                });
            }
            return nodes;
        }

        function getDistance(n1, n2) {
            return Math.sqrt(Math.pow(n1.x - n2.x, 2) + Math.pow(n1.y - n2.y, 2));
        }

        function getTotalDistance(path, nodes) {
            let dist = 0;
            for (let i = 0; i < path.length; i++) {
                const n1 = nodes[path[i]];
                const n2 = nodes[path[(i + 1) % path.length]];
                dist += getDistance(n1, n2);
            }
            return dist;
        }

        function generateSimulation(nodes) {
            const history = [];
            let currentPath = Array.from({ length: NODE_COUNT }, (_, i) => i);
            // Shuffle initial path
            for (let i = currentPath.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [currentPath[i], currentPath[j]] = [currentPath[j], currentPath[i]];
            }

            let currentDist = getTotalDistance(currentPath, nodes);
            let temp = INITIAL_TEMP;
            let iteration = 0;

            history.push({
                stepId: 0,
                path: [...currentPath],
                dist: currentDist,
                temp: temp,
                algoLine: 1,
                status: 'START',
                desc: 'Initial Random Path',
                speech: OPTIMIZATION_SCRIPT.ANNEALING.START()
            });

            while (temp > 1) {
                iteration++;
                let newPath = [...currentPath];
                let i = Math.floor(Math.random() * NODE_COUNT);
                let j = Math.floor(Math.random() * NODE_COUNT);
                [newPath[i], newPath[j]] = [newPath[j], newPath[i]];

                let newDist = getTotalDistance(newPath, nodes);
                let acceptanceProbability = Math.exp((currentDist - newDist) / temp);

                let accepted = false;
                let status = 'CHECKING';
                let desc = 'Checking neighbor...';
                let speech = null;

                if (newDist < currentDist) {
                    currentPath = newPath;
                    currentDist = newDist;
                    accepted = true;
                    status = 'BETTER';
                    desc = `Found better path: ${Math.round(currentDist)}`;
                    if (iteration % 50 === 0) speech = OPTIMIZATION_SCRIPT.ANNEALING.BETTER_FOUND();
                } else if (Math.random() < acceptanceProbability) {
                    currentPath = newPath;
                    currentDist = newDist;
                    accepted = true;
                    status = 'WORSE_ACCEPTED';
                    desc = `Accepted worse path (Temp: ${Math.round(temp)})`;
                    if (iteration % 100 === 0) speech = OPTIMIZATION_SCRIPT.ANNEALING.WORSE_ACCEPTED();
                }

                if (accepted || iteration % 20 === 0) {
                    history.push({
                        stepId: history.length,
                        path: [...currentPath],
                        dist: currentDist,
                        temp: temp,
                        algoLine: status === 'BETTER' ? 6 : (status === 'WORSE_ACCEPTED' ? 7 : 4),
                        status: status,
                        desc: iteration % 10 === 0 ? `Temp: ${Math.round(temp)} | Dist: ${Math.round(currentDist)}` : desc,
                        speech: iteration % 200 === 0 ? OPTIMIZATION_SCRIPT.ANNEALING.ITERATION(temp, currentDist) : speech
                    });
                }

                temp *= COOLING_RATE;
            }

            history.push({
                stepId: history.length,
                path: [...currentPath],
                dist: currentDist,
                temp: temp,
                algoLine: 9,
                status: 'SUCCESS',
                desc: `Final Shortest Path: ${Math.round(currentDist)}`,
                speech: OPTIMIZATION_SCRIPT.ANNEALING.SUCCESS(currentDist)
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
            const [currentStep, setCurrentStep] = useState(0);
            const [isPlaying, setIsPlaying] = useState(false);
            const [speedMultiplier, setSpeedMultiplier] = useState(1);
            const [zoom, setZoom] = useState(0.8);
            const [isMuted, setIsMuted] = useState(false);
            const [isMinimized, setIsMinimized] = useState(false);
            
            const nodes = useMemo(() => generateNodes(), []);
            const history = useMemo(() => generateSimulation(nodes), [nodes]);
            const state = history[currentStep] || history[0];

            const nextStep = () => { setCurrentStep(prev => (prev < history.length - 1 ? prev + 1 : (setIsPlaying(false), prev))); };
            const prevStep = () => { setCurrentStep(prev => Math.max(0, prev - 1)); setIsPlaying(false); };

            const speak = (text) => {
                const delay = (50 / speedMultiplier);
                if (isMuted || !text) { 
                    if(isPlaying) setTimeout(nextStep, delay); 
                    return; 
                }
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.pitch = 1.1; utterance.rate = 1.1 * speedMultiplier;
                utterance.onend = () => { if(isPlaying) nextStep(); };
                window.speechSynthesis.speak(utterance);
            };

            useEffect(() => {
                if (isPlaying) speak(state.speech);
                else window.speechSynthesis.cancel();
            }, [isPlaying, currentStep]);

            const getTempColor = (temp) => {
                const ratio = temp / INITIAL_TEMP;
                const r = Math.floor(255 * ratio + 59 * (1 - ratio));
                const g = Math.floor(100 * ratio + 130 * (1 - ratio));
                const b = Math.floor(50 * ratio + 246 * (1 - ratio));
                return `rgb(${r},${g},${b})`;
            };

            return (
                <div className="h-screen w-screen flex flex-col relative overflow-hidden bg-slate-900 text-white select-none">
                    <div className="absolute top-0 left-0 right-0 z-[60]">
                        <div className="relative h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-6 shadow-2xl">
                            <div className="flex items-center gap-4">
                                <a href="index.html" className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"><Home size={20} /></a>
                                <div>
                                    <h1 className="font-bold text-lg leading-none tracking-tight">Simulated Annealing</h1>
                                    <span className="text-xs text-slate-400 font-mono">Traveling Salesman Problem</span>
                                <button onClick={() => setIsSettingsOpen(true)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white shadow-lg"><SettingsIcon size={20}/></button></div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Temperature</div>
                                    <div className="font-mono font-bold" style={{ color: getTempColor(state.temp) }}>{Math.round(state.temp)}°</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Path Length</div>
                                    <div className="font-mono text-emerald-400 font-bold">{Math.round(state.dist)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
                    <AlgorithmPanel algoKey="SIMULATED_ANNEALING" currentLine={state?.algoLine} />
                    <div className="flex-1 relative infinite-bg overflow-hidden flex items-center justify-center">
                        <svg width="1000" height="1000" style={{ transform: `scale(${zoom})` }} className="camera-layer overflow-visible">
                            {/* Path */}
                            {state.path.map((nodeIdx, i) => {
                                const n1 = nodes[nodeIdx];
                                const n2 = nodes[state.path[(i + 1) % state.path.length]];
                                return (
                                    <line key={i} x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} stroke={getTempColor(state.temp)} strokeWidth={2 + (state.temp / 200)} strokeOpacity={0.6} className="path-line" />
                                );
                            })}
                            {/* Nodes */}
                            {nodes.map(node => (
                                <g key={node.id}>
                                    <circle cx={node.x} cy={node.y} r="12" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                                    <circle cx={node.x} cy={node.y} r="4" fill={getTempColor(state.temp)} className="node-pulse" />
                                    <text x={node.x} y={node.y} textAnchor="middle" dy=".3em" fontSize="8" fill="white" fontWeight="bold">{node.id}</text>
                                </g>
                            ))}
                        </svg>
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50">
                        <div className={`bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col relative transition-all duration-300 ${isMinimized ? 'w-fit mx-auto px-4 pb-3 pt-1' : 'px-5 pb-4 pt-2'}`}>
                            <button onClick={() => setIsMinimized(!isMinimized)} className="absolute top-2 right-2 p-1 hover:bg-slate-700/50 rounded-md text-slate-400 hover:text-white transition-colors">{isMinimized ? <ChevronUp size={16}/> : <ChevronDown size={18}/>}</button>
                            {isMinimized ? (
                                <div className="flex items-center justify-center gap-4">
                                    <button onClick={prevStep} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-200"><Rewind size={18}/></button>
                                    <button onClick={() => setIsPlaying(!isPlaying)} className={`w-10 h-10 flex items-center justify-center rounded-full shadow-lg ${isPlaying ? 'bg-amber-500' : 'bg-blue-600'}`}>{isPlaying ? <Pause fill="white" size={18} /> : <Play fill="white" size={18} className="ml-1"/>}</button>
                                    <button onClick={nextStep} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-200"><FastForward size={18}/></button>
                                </div>
                            ) : (
                                <>
                                    <div className="relative w-full h-1.5 bg-slate-800 rounded-full mb-3 mt-1">
                                        <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-100" style={{ width: `${(currentStep / (history.length-1)) * 100}%` }}></div>
                                        <input type="range" min="0" max={history.length - 1} value={currentStep} onChange={(e) => { setIsPlaying(false); setCurrentStep(Number(e.target.value)); }} className="absolute -top-2 left-0 w-full h-6 opacity-0 cursor-pointer z-10" />
                                    </div>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex flex-col w-[30%]"><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Status</span><span className="text-sm font-mono text-emerald-300 truncate">{state.desc}</span></div>
                                        <div className="flex items-center justify-center gap-3 w-[40%]"><button onClick={prevStep} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-200"><Rewind size={18}/></button><button onClick={() => setIsPlaying(!isPlaying)} className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg ${isPlaying ? 'bg-amber-500' : 'bg-blue-600'}`}>{isPlaying ? <Pause fill="white" size={20} /> : <Play fill="white" size={20} className="ml-1"/>}</button><button onClick={nextStep} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-200"><FastForward size={18}/></button></div>
                                        <div className="flex items-center justify-end gap-4 w-[30%]">
                                            <button onClick={() => setIsMuted(!isMuted)} className={`p-2 rounded-lg ${isMuted ? 'text-rose-400 bg-rose-400/10' : 'text-blue-400 bg-blue-400/10'}`}>{isMuted ? <VolumeX size={18}/> : <Volume2 size={18}/>}</button>
                                            <div className="flex flex-col gap-1 items-end w-24">
                                            <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Speed {speedMultiplier}x</span>
                                            <input type="range" min="0.5" max="2.0" step="0.1" value={speedMultiplier} onChange={(e) => setSpeedMultiplier(Number(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-400" />
                                        </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            );
        };
        createRoot(document.getElementById('root')).render(<App />);
    
