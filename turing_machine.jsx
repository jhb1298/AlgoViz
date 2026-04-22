import './src/globals.js';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './turing_script.js';
import './settings_manager.js';
import './algorithm_data.js';
import './chatbot.js';

/* extracted from turing_machine.html */

        
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
        const Settings = (props) => <IconWrapper {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.58a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.58a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.58a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.58a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></IconWrapper>;

        // Binary Incrementer Program
        const DEFAULT_TRANSITIONS = {
            'q0': { '0': ['0', 'R', 'q0'], '1': ['1', 'R', 'q0'], 'B': ['B', 'L', 'q1'] },
            'q1': { '1': ['0', 'L', 'q1'], '0': ['1', 'L', 'q2'], 'B': ['1', 'L', 'q2'] },
            'q2': { '0': ['0', 'L', 'q2'], '1': ['1', 'L', 'q2'], 'B': ['B', 'R', 'HALT'] }
        };

        function generateSimulation(inputString, transitions) {
            const history = [];
            let tape = inputString.split('');
            if (tape.length === 0) tape = ['B'];
            let head = 0;
            let state = 'q0';
            const maxSteps = 200;

            function getSym(pos) {
                if (pos < 0 || pos >= tape.length) return 'B';
                return tape[pos];
            }

            function setSym(pos, val) {
                if (pos < 0) {
                    tape.unshift(val);
                    head++;
                } else if (pos >= tape.length) {
                    tape.push(val);
                } else {
                    tape[pos] = val;
                }
            }

            history.push({
                stepId: 0, tape: [...tape], head, state, 
                algoLine: 1,
                status: 'START', desc: "Initializing Tape...",
                speech: TURING_SCRIPT.START(inputString)
            });

            let stepCount = 0;
            while (state !== 'HALT' && state !== 'REJECT' && stepCount < maxSteps) {
                const currentSymbol = getSym(head);
                const action = transitions[state]?.[currentSymbol];

                if (!action) {
                    state = 'REJECT';
                    history.push({ stepId: history.length, tape: [...tape], head, state, algoLine: null, status: 'REJECT', desc: `No transition for (${state}, ${currentSymbol})`, speech: TURING_SCRIPT.HALT(false) });
                    break;
                }

                const [writeSymbol, moveDir, nextState] = action;

                // 1. Read Step
                history.push({ 
                    stepId: history.length, tape: [...tape], head, state, 
                    algoLine: 4,
                    status: 'READ', desc: `Reading ${currentSymbol}`, 
                    speech: TURING_SCRIPT.READ(currentSymbol, state)
                });

                // 2. Write Step
                setSym(head, writeSymbol);
                state = nextState;
                history.push({ 
                    stepId: history.length, tape: [...tape], head, state, 
                    algoLine: 6,
                    status: 'WRITE', desc: `Writing ${writeSymbol} ? ${state}`,
                    speech: TURING_SCRIPT.WRITE(writeSymbol, state)
                });

                // 3. Move Step
                if (state !== 'HALT') {
                    head += (moveDir === 'R' ? 1 : -1);
                    history.push({ 
                        stepId: history.length, tape: [...tape], head, state, 
                        algoLine: 8,
                        status: 'MOVE', desc: `Moving ${moveDir === 'R' ? 'Right' : 'Left'}`,
                        speech: TURING_SCRIPT.MOVE(moveDir)
                    });
                }
                
                stepCount++;
            }

            if (state === 'HALT') {
                history.push({ stepId: history.length, tape: [...tape], head, state, algoLine: 9, status: 'SUCCESS', desc: "HALT: Accept", speech: TURING_SCRIPT.HALT(true) });
            }

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
            const [input, setInput] = useState("1011");
            const [transitions, setTransitions] = useState(DEFAULT_TRANSITIONS);
            const [currentStep, setCurrentStep] = useState(0);
            const [isPlaying, setIsPlaying] = useState(false);
            const [speedMultiplier, setSpeedMultiplier] = useState(1);
            const [zoom, setZoom] = useState(1);
            const [isMuted, setIsMuted] = useState(false);
            const [isMinimized, setIsMinimized] = useState(false);
            const [showConfig, setShowConfig] = useState(false);
            
            const [panelOffset, setPanelOffset] = useState({ x: 0, y: 0 });
            const [isDraggingPanel, setIsDraggingPanel] = useState(false);
            const panelDragStart = useRef({ x: 0, y: 0 });
            const isPlayingRef = useRef(false);
            isPlayingRef.current = isPlaying;

            const history = useMemo(() => generateSimulation(input, transitions), [input, transitions]);

            const nextStep = () => { setCurrentStep(prev => (prev < history.length - 1 ? prev + 1 : (setIsPlaying(false), prev))); };
            const prevStep = () => { setCurrentStep(prev => Math.max(0, prev - 1)); setIsPlaying(false); };

            const speak = (text) => {
                const delay = (800 / speedMultiplier);
                if (isMuted || !text) { setTimeout(() => { if(isPlayingRef.current) nextStep(); }, delay); return; }
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.pitch = 1.0; utterance.rate = 1.2 * speedMultiplier;
                utterance.onend = () => { if(isPlayingRef.current) nextStep(); };
                window.speechSynthesis.speak(utterance);
            };

            useEffect(() => {
                if (isPlaying) speak(history[currentStep]?.speech);
                else window.speechSynthesis.cancel();
            }, [isPlaying, currentStep]);

            const state = history[currentStep] || { tape: [], head: 0, state: 'q0' };

            return (
                <div className="h-screen w-screen flex flex-col relative overflow-hidden bg-slate-950 text-white select-none infinite-bg" onMouseMove={(e) => { if(isDraggingPanel) setPanelOffset({x: e.clientX-panelDragStart.current.x, y: e.clientY-panelDragStart.current.y}); }} onMouseUp={() => {setIsDraggingPanel(false);}}>
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 z-[60] p-6 flex justify-between items-center pointer-events-none">
                        <div className="flex items-center gap-4 pointer-events-auto">
                            <a href="index.html" className="bg-slate-900 p-2.5 rounded-xl hover:bg-slate-800 transition-colors border border-slate-800 shadow-2xl"><Home size={20} /></a>
                            <div>
                                <h1 className="font-black text-xl tracking-tighter uppercase italic">Turing Machine</h1>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Universal Computability Engine</span>
                                <button onClick={() => setIsSettingsOpen(true)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white shadow-lg"><SettingsIcon size={20}/></button></div>
                            </div>
                        </div>
                        <button onClick={() => setShowConfig(true)} className="pointer-events-auto bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2 hover:bg-slate-800 transition-all font-bold text-xs"><Settings size={18} /> Configuration</button>
                    </div>

                    {/* Machine View */}
                    
                    <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
                    <AlgorithmPanel algoKey="TURING_MACHINE" currentLine={state?.algoLine} />
                    <div className="flex-1 flex flex-col items-center justify-center gap-12 relative">
                        {/* State Register */}
                        <div className="flex flex-col items-center gap-2 state-pulse">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Current State</div>
                            <div className={`px-8 py-3 rounded-2xl border-2 font-black text-3xl transition-all duration-500 ${state.state === 'HALT' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-indigo-500 bg-indigo-500/10 text-indigo-400'}`}>
                                {state.state}
                            </div>
                        </div>

                        {/* Tape Visualization */}
                        <div className="w-full relative py-20 flex justify-center items-center tape-container overflow-hidden">
                            <div className="scan-line z-20"></div>
                            <div className="flex gap-3 transition-transform duration-500 ease-in-out" style={{ transform: `translateX(${(state.head * -92)}px) scale(${zoom})` }}>
                                {Array.from({ length: Math.max(state.tape.length, state.head + 10) }).map((_, i) => {
                                    const val = state.tape[i] || 'B';
                                    const isActive = state.head === i;
                                    return (
                                        <div key={i} className={`w-20 h-24 flex flex-col items-center justify-center rounded-xl tape-cell relative ${isActive ? 'head-active' : ''}`}>
                                            <span className="text-[8px] absolute top-1 left-2 text-slate-600 font-bold">{i}</span>
                                            <span className={`text-3xl font-black ${val === 'B' ? 'text-slate-800' : 'text-white'}`}>{val}</span>
                                            {isActive && <div className="absolute -bottom-8 text-indigo-500 animate-bounce"><ChevronUp size={24} strokeWidth={3} /></div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Transitions Sidebar Mini-View */}
                        <div className="absolute right-10 top-1/2 -translate-y-1/2 bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl border border-slate-800 hidden lg:block max-w-[200px]">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Program Logic</h3>
                            <div className="space-y-3">
                                {Object.entries(transitions).map(([s, rules]) => (
                                    <div key={s} className={`p-2 rounded-lg transition-colors ${state.state === s ? 'bg-indigo-500/20 border border-indigo-500/30' : 'opacity-40'}`}>
                                        <div className="text-[10px] font-bold text-indigo-400 mb-1">{s}</div>
                                        {Object.entries(rules).map(([sym, act]) => (
                                            <div key={sym} className="text-[9px] flex justify-between font-mono text-slate-400">
                                                <span>{sym} ?</span>
                                                <span>{act[0]},{act[1]},{act[2]}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Configuration Modal */}
                    {showConfig && (
                        <div className="absolute inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-10 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
                                <h2 className="text-3xl font-black mb-2 tracking-tighter italic">SYSTEM CONFIG</h2>
                                <p className="text-slate-500 text-sm mb-8">Define tape input and state transition matrix.</p>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Input String (Tape)</label>
                                        <input value={input} onChange={e => setInput(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-emerald-400 outline-none focus:border-emerald-500/50 transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Transition JSON</label>
                                        <textarea value={JSON.stringify(transitions, null, 2)} onChange={e => { try { setTransitions(JSON.parse(e.target.value)); } catch(err){} }} className="w-full h-64 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-blue-400 outline-none focus:border-blue-500/50 transition-all text-xs" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 mt-10">
                                    <button onClick={() => setShowConfig(false)} className="px-8 py-3 rounded-2xl font-bold text-slate-400 hover:text-white transition-colors">Dismiss</button>
                                    <button onClick={() => { setShowConfig(false); setCurrentStep(0); setIsPlaying(false); }} className="px-10 py-3 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">Apply Changes</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Control Panel */}
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
                                    <div className="relative w-full h-1.5 bg-slate-800/80 rounded-full mb-3 mt-1"><div className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full transition-all duration-100" style={{ width: `${(currentStep / (history.length-1)) * 100}%` }}></div><input type="range" min="0" max={history.length - 1} value={currentStep} onChange={(e) => { setIsPlaying(false); setCurrentStep(Number(e.target.value)); }} className="absolute -top-2 left-0 w-full h-6 opacity-0 cursor-pointer z-10" /></div>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex flex-col w-[30%] overflow-hidden pr-2"><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Computational Step {String(currentStep).padStart(3, '0')}</span><span className="text-sm font-mono text-indigo-300 truncate tracking-tight">{state?.desc}</span></div>
                                        <div className="flex items-center justify-center gap-3 w-[40%]"><button onClick={() => setCurrentStep(0)} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-300 transition-colors"><SkipBack size={16}/></button><button onClick={prevStep} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-200 transition-colors"><Rewind size={18}/></button><button onClick={() => setIsPlaying(!isPlaying)} className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transform transition-all active:scale-95 border border-white/20 ${isPlaying ? 'bg-amber-500' : 'bg-blue-600'}`}>{isPlaying ? <Pause fill="white" size={20} /> : <Play fill="white" size={20} className="ml-1"/>}</button><button onClick={nextStep} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-200 transition-colors"><FastForward size={18}/></button><button onClick={() => setCurrentStep(history.length - 1)} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-300 transition-colors"><SkipForward size={16}/></button></div>
                                        <div className="flex items-center justify-end gap-4 w-[30%]"><button onClick={() => setIsMuted(!isMuted)} className={`p-2 rounded-lg transition-colors ${isMuted ? 'text-rose-400 bg-rose-400/10' : 'text-blue-400 bg-blue-400/10'}`}>{isMuted ? <VolumeX size={18}/> : <Volume2 size={18}/>}</button>
                                        <div className="flex flex-col gap-1 items-end w-24">
                                            <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Clock {speedMultiplier}x</span>
                                            <input type="range" min="0.5" max="2.0" step="0.1" value={speedMultiplier} onChange={(e) => setSpeedMultiplier(Number(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-400" />
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
    
