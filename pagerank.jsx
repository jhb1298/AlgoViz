import './src/globals.js';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './graph_script.js';
import './settings_manager.js';
import './algorithm_data.js';
import './chatbot.js';

/* extracted from pagerank.html */

        
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
        const Edit = (props) => <IconWrapper {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></IconWrapper>;
        const Refresh = (props) => <IconWrapper {...props}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path></IconWrapper>;

        const DAMPING = 0.85;
        const DEFAULT_EDGES = `A B
A C
B C
C A
D C`;

        function parseGraph(text) {
            const lines = text.trim().split('\n');
            const edges = [];
            const nodeIds = new Set();
            lines.forEach(line => {
                const parts = line.trim().split(/\s+/);
                if (parts.length >= 2) {
                    const [u, v] = parts;
                    edges.push({ from: u, to: v });
                    nodeIds.add(u); nodeIds.add(v);
                }
            });
            const nodesArr = Array.from(nodeIds).sort();
            const nodes = nodesArr.map((id, i) => {
                const angle = (i / nodesArr.length) * 2 * Math.PI;
                return { id, x: 500 + 280 * Math.cos(angle), y: 500 + 280 * Math.sin(angle) };
            });
            return { nodes, edges };
        }

        function generateSimulation(graph) {
            const history = [];
            const n = graph.nodes.length;
            if (n === 0) return [];

            let ranks = {};
            graph.nodes.forEach(node => ranks[node.id] = 1 / n);

            history.push({
                stepId: 0, ranks: { ...ranks }, status: 'START', algoLine: 1,
                desc: 'Initializing PageRank scores equally.', speech: SEARCH_SCRIPT.PAGERANK.START()
            });

            for (let iter = 1; iter <= 5; iter++) {
                history.push({
                    stepId: history.length, ranks: { ...ranks }, iteration: iter, status: 'ITER_START', algoLine: 2,
                    desc: `Iteration ${iter}: Calculating rank flow...`, speech: SEARCH_SCRIPT.PAGERANK.ITERATION_START(iter)
                });

                let newRanks = {};
                graph.nodes.forEach(node => newRanks[node.id] = (1 - DAMPING) / n);

                const flowSteps = [];
                for (const node of graph.nodes) {
                    const outgoing = graph.edges.filter(e => e.from === node.id);
                    if (outgoing.length > 0) {
                        const flowPerLink = (ranks[node.id] * DAMPING) / outgoing.length;
                        for (const edge of outgoing) {
                            newRanks[edge.to] += flowPerLink;
                            history.push({
                                stepId: history.length, ranks: { ...ranks }, iteration: iter, activeEdge: edge, status: 'FLOW', algoLine: 6,
                                desc: `Node ${node.id} sharing rank with ${edge.to}`, speech: iter === 1 ? SEARCH_SCRIPT.PAGERANK.FLOW(node.id, edge.to, flowPerLink) : null
                            });
                        }
                    } else {
                        // Sink node: share rank with all nodes (teleportation)
                        const flowPerNode = (ranks[node.id] * DAMPING) / n;
                        graph.nodes.forEach(target => newRanks[target.id] += flowPerNode);
                    }
                }
                
                ranks = newRanks;
                history.push({
                    stepId: history.length, ranks: { ...ranks }, iteration: iter, status: 'DAMPING', algoLine: 7,
                    desc: `Iteration ${iter} complete. Finalizing ranks with damping.`, speech: iter === 1 ? SEARCH_SCRIPT.PAGERANK.DAMPING() : null
                });
            }

            history.push({
                stepId: history.length, ranks: { ...ranks }, status: 'SUCCESS', algoLine: 2,
                desc: 'PageRank stable!', speech: SEARCH_SCRIPT.PAGERANK.SUCCESS()
            });

            return history;
        }

        const ArrowHead = ({ color }) => (
            <marker id={`arrow-${color.replace('#','')}`} markerWidth="10" markerHeight="10" refX="32" refY="3" orientation="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill={color} />
            </marker>
        );

        const EdgeComponent = ({ edge, nodes, isActive }) => {
            const u = nodes.find(n => n.id === edge.from);
            const v = nodes.find(n => n.id === edge.to);
            if(!u || !v) return null;
            return (
                <line x1={u.x} y1={u.y} x2={v.x} y2={v.y} 
                    className={`edge-path ${isActive ? 'edge-active' : ''}`} 
                    markerEnd={`url(#arrow-${(isActive ? "#6366f1" : "#334155").replace('#','')})`}
                    stroke={isActive ? "#6366f1" : "#334155"}
                />
            );
        };

        const App = () => {
            const { SettingsIcon, SettingsModal, AlgorithmPanel } = useMemo(() => window.initSettingsComponents(React), []);
            const [isSettingsOpen, setIsSettingsOpen] = useState(false);
            const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('simulation_settings') || '{"fontSize": 16, "nodeColor": "#3b82f6"}'));
            useEffect(() => {
                const handleUpdate = () => setSettings(JSON.parse(localStorage.getItem('simulation_settings') || '{"fontSize": 16, "nodeColor": "#3b82f6"}'));
                window.addEventListener('simulation_settings_updated', handleUpdate);
                return () => window.removeEventListener('simulation_settings_updated', handleUpdate);
            }, []);

            const [inputText, setInputText] = useState(DEFAULT_EDGES);
            const [isEditing, setIsEditing] = useState(false);
            const [currentStep, setCurrentStep] = useState(0);
            const [isPlaying, setIsPlaying] = useState(false);
            const [speedMultiplier, setSpeedMultiplier] = useState(1);
            const [zoom, setZoom] = useState(0.8);
            const [isMuted, setIsMuted] = useState(false);
            const [isMinimized, setIsMinimized] = useState(false);
            
            const [manualOffset, setManualOffset] = useState({ x: window.innerWidth / 2 - 400, y: window.innerHeight / 2 - 400 });
            const [panelOffset, setPanelOffset] = useState({ x: 0, y: 0 });
            const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
            const [isDraggingPanel, setIsDraggingPanel] = useState(false);
            const canvasDragStart = useRef({ x: 0, y: 0 });
            const panelDragStart = useRef({ x: 0, y: 0 });
            const isPlayingRef = useRef(false);
            isPlayingRef.current = isPlaying;

            const graph = useMemo(() => parseGraph(inputText), [inputText]);
            const history = useMemo(() => generateSimulation(graph), [graph]);
            const state = history[currentStep] || history[0];

            const nextStep = () => { setCurrentStep(prev => (prev < history.length - 1 ? prev + 1 : (setIsPlaying(false), prev))); };
            const prevStep = () => { setCurrentStep(prev => Math.max(0, prev - 1)); setIsPlaying(false); };

            const speak = (text) => {
                const delay = (1000 / speedMultiplier);
                if (isMuted || !text) { setTimeout(() => { if(isPlayingRef.current) nextStep(); }, delay); return; }
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                const voices = window.speechSynthesis.getVoices();
                if(voices.length > 0) utterance.voice = voices.find(v => v.lang.includes('en-US')) || voices[0];
                utterance.pitch = 1.0; utterance.rate = 1.0 * speedMultiplier;
                utterance.onend = () => { if(isPlayingRef.current) nextStep(); };
                window.speechSynthesis.speak(utterance);
            };

            useEffect(() => {
                if (isPlaying) speak(state.speech);
                else window.speechSynthesis.cancel();
            }, [isPlaying, currentStep]);

            return (
                <div className="h-screen w-screen flex flex-col relative overflow-hidden bg-slate-900 text-white select-none" onMouseMove={(e) => { if(isDraggingPanel) setPanelOffset({x: e.clientX-panelDragStart.current.x, y: e.clientY-panelDragStart.current.y}); else if(isDraggingCanvas) setManualOffset({x: e.clientX-canvasDragStart.current.x, y: e.clientY-canvasDragStart.current.y}); }} onMouseUp={() => {setIsDraggingCanvas(false); setIsDraggingPanel(false);}}>
                    
                    {/* Navigation Header */}
                    <div className="absolute top-0 left-0 right-0 z-[60] top-nav-area">
                        <div className="absolute top-0 left-0 w-full h-4 z-[70] peer"></div>
                        <div className="relative h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-6 shadow-2xl transition-transform duration-300 -translate-y-full peer-hover:translate-y-0 hover:translate-y-0 z-[60]">
                            <div className="flex items-center gap-4">
                                <a href="index.html" className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white">
                                    <Home size={20} />
                                </a>
                                <div>
                                    <h1 className="font-bold text-lg leading-none tracking-tight">PageRank Visualizer</h1>
                                    <span className="text-xs text-slate-400 font-mono">Simulating web page importance</span>
                                    <button onClick={() => setIsSettingsOpen(true)} className="ml-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white shadow-lg">
                                        <SettingsIcon size={20}/>
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setCurrentStep(0)} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-bold transition-all border border-slate-700">
                                    <Refresh size={18}/> Reset
                                </button>
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-bold transition-all shadow-lg">
                                    <Edit size={18}/> Edit Network
                                </button>
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="absolute inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 text-white pointer-events-auto">
                            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-lg w-full shadow-2xl">
                                <h2 className="text-2xl font-bold mb-2">Edit Web Links</h2>
                                <p className="text-slate-400 text-sm mb-4">Format: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-blue-300">FromPage ToPage</code></p>
                                <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} className="w-full h-64 bg-slate-950 border border-slate-700 rounded-xl p-4 font-mono text-blue-400 outline-none focus:border-blue-500 mb-6" />
                                <div className="flex justify-end gap-4">
                                    <button onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-all">Cancel</button>
                                    <button onClick={() => { setIsEditing(false); setCurrentStep(0); setIsPlaying(false); }} className="px-8 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 shadow-lg transition-all text-white">Update Network</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
                    <AlgorithmPanel algoKey="PAGERANK" currentLine={state.algoLine} />

                    <div className="flex-1 relative infinite-bg overflow-hidden cursor-grab active:cursor-grabbing" onWheel={(e) => setZoom(z => Math.min(Math.max(0.1, z-e.deltaY*0.001), 2.0))} onMouseDown={(e) => {if(!e.target.closest('.control-panel-wrapper') && !e.target.closest('.top-nav-area')) {setIsDraggingCanvas(true); canvasDragStart.current={x: e.clientX-manualOffset.x, y: e.clientY-manualOffset.y};}}}>
                        <div className={`node-container absolute origin-top-left ${isDraggingCanvas ? '' : 'camera-layer'}`} style={{ transform: `translate(${manualOffset.x}px, ${manualOffset.y}px) scale(${zoom})` }}>
                            <svg className="overflow-visible" width="1000" height="1000">
                                <defs>
                                    <ArrowHead color="#334155" />
                                    <ArrowHead color="#6366f1" />
                                </defs>
                                {graph.edges.map((edge, i) => (
                                    <EdgeComponent key={i} edge={edge} nodes={graph.nodes} isActive={state.activeEdge === edge} />
                                ))}
                                {graph.nodes.map(node => {
                                    const rank = state.ranks[node.id] || 0;
                                    const radius = 35 + Math.sqrt(rank) * 80;
                                    return (
                                        <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                                            <circle r={radius} fill="#1e293b" stroke={settings.nodeColor} strokeWidth="3" className={`node-circle transition-all duration-700 ${rank > 0.2 ? 'rank-glow' : ''}`} />
                                            <text textAnchor="middle" dy=".3em" fill="white" fontSize={settings.fontSize + rank * 20} fontWeight="900">{node.id}</text>
                                            <text textAnchor="middle" dy="2.4em" fill="#6366f1" fontSize="14" fontWeight="bold">{(rank * 100).toFixed(1)}%</text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    </div>

                    {/* Rank Table (Sidebar alternative for PageRank) */}
                    <div className="absolute top-20 right-6 z-40 bg-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700 shadow-2xl w-64">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-6">LIVE SCORES</h3>
                    <div className="space-y-3">
                        {Object.entries(state.ranks).sort((a,b) => b[1] - a[1]).map(([id, rank]) => (
                            <div key={id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center font-bold text-xs">{id}</div>
                                    <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${rank * 100}%` }} />
                                    </div>
                                </div>
                                <span className="text-[10px] font-mono text-slate-400">{(rank * 100).toFixed(1)}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                    {/* Control Panel */}
                    <div className="absolute bottom-6 left-1/2 w-full max-w-4xl px-4 z-50 control-panel-wrapper" style={{ transform: `translate(calc(-50% + ${panelOffset.x}px), ${panelOffset.y}px)` }}>
                        <div className={`bg-slate-900/40 hover:bg-slate-900/85 backdrop-blur-md border border-slate-600/30 rounded-2xl shadow-2xl flex flex-col relative box-border transition-all duration-300 ${isMinimized ? 'w-fit min-w-[180px] mx-auto px-4 pb-3 pt-1' : 'px-5 pb-4 pt-2'}`}>
                            <div className="w-full h-6 cursor-grab active:cursor-grabbing flex justify-center items-center mb-1" onMouseDown={(e) => {e.preventDefault(); setIsDraggingPanel(true); panelDragStart.current={x:e.clientX-panelOffset.x, y:e.clientY-panelOffset.y}; e.stopPropagation();}}>
                                <div className="bg-white/10 rounded-full px-6 py-0.5"><GripHorizontal size={12} className="text-white/50" /></div>
                            </div>
                            <button onClick={() => setIsMinimized(!isMinimized)} className="absolute top-2 right-2 p-1 hover:bg-slate-700/50 rounded-md text-slate-400 hover:text-white transition-colors z-50">
                                {isMinimized ? <ChevronUp size={16}/> : <ChevronDown size={18}/>}
                            </button>
                            {isMinimized ? (
                                <div className="flex items-center justify-center gap-4">
                                    <button onClick={prevStep} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-200"><Rewind size={18}/></button>
                                    <button onClick={() => setIsPlaying(!isPlaying)} className={`w-10 h-10 flex items-center justify-center rounded-full shadow-lg transform transition-all active:scale-95 border border-white/20 ${isPlaying ? 'bg-amber-500' : 'bg-blue-600'}`}>
                                        {isPlaying ? <Pause fill="white" size={18} /> : <Play fill="white" size={18} className="ml-1"/>}
                                    </button>
                                    <button onClick={nextStep} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-200"><FastForward size={18}/></button>
                                </div>
                            ) : (
                                <>
                                    <div className="relative w-full h-1.5 bg-slate-800/80 rounded-full mb-3 mt-1">
                                        <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-100" style={{ width: `${(currentStep / (history.length-1)) * 100}%` }}></div>
                                        <input type="range" min="0" max={history.length - 1} value={currentStep} onChange={(e) => { setIsPlaying(false); setCurrentStep(Number(e.target.value)); }} className="absolute -top-2 left-0 w-full h-6 opacity-0 cursor-pointer z-10" />
                                    </div>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex flex-col w-[30%] overflow-hidden pr-2">
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Step {String(currentStep).padStart(3, '0')}</span>
                                            <span className="text-sm font-mono text-emerald-300 truncate">{state?.desc}</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-3 w-[40%]">
                                            <button onClick={() => setCurrentStep(0)} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-300 transition-colors"><SkipBack size={16}/></button>
                                            <button onClick={prevStep} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-200 transition-colors"><Rewind size={18}/></button>
                                            <button onClick={() => setIsPlaying(!isPlaying)} className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg transform transition-all active:scale-95 border border-white/20 ${isPlaying ? 'bg-amber-500' : 'bg-blue-600'}`}>
                                                {isPlaying ? <Pause fill="white" size={20} /> : <Play fill="white" size={20} className="ml-1"/>}
                                            </button>
                                            <button onClick={nextStep} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-200 transition-colors"><FastForward size={18}/></button>
                                            <button onClick={() => setCurrentStep(history.length - 1)} className="p-1.5 hover:bg-slate-700/50 rounded-md text-slate-300 transition-colors"><SkipForward size={16}/></button>
                                        </div>
                                        <div className="flex items-center justify-end gap-4 w-[30%]">
                                            <button onClick={() => setIsMuted(!isMuted)} className={`p-2 rounded-lg transition-colors ${isMuted ? 'text-rose-400 bg-rose-400/10' : 'text-blue-400 bg-blue-400/10'}`}>
                                                {isMuted ? <VolumeX size={18}/> : <Volume2 size={18}/>}
                                            </button>
                                            <div className="flex flex-col gap-1 items-end w-24">
                                                <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Speed {speedMultiplier}x</span>
                                                <input type="range" min="0.5" max="3.0" step="0.1" value={speedMultiplier} onChange={(e) => setSpeedMultiplier(Number(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400" />
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
    
