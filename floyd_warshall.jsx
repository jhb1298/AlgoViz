import './src/globals.js';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './graph_script.js';
import './settings_manager.js';
import './algorithm_data.js';
import './chatbot.js';

/* extracted from floyd_warshall.html */

        
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
        const TableIcon = (props) => <IconWrapper {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></IconWrapper>;

        const DEFAULT_EDGES = `A B 3
A C 8
A E -4
B D 1
B E 7
C B 4
D A 2
D C -5
E D 6`;

        function parseGraph(text) {
            const lines = text.trim().split('\n');
            const edges = [];
            const nodeIds = new Set();
            lines.forEach(line => {
                const parts = line.trim().split(/\s+/);
                if (parts.length >= 2) {
                    const [u, v, w] = parts;
                    edges.push({ from: u, to: v, weight: parseFloat(w) || 1 });
                    nodeIds.add(u); nodeIds.add(v);
                }
            });
            const nodesArr = Array.from(nodeIds).sort();
            const nodes = nodesArr.map((id, i) => {
                const angle = (i / nodesArr.length) * 2 * Math.PI;
                return { id, x: 500 + 250 * Math.cos(angle), y: 500 + 250 * Math.sin(angle) };
            });
            return { nodes, edges };
        }

        function generateSimulation(graph) {
            const history = [];
            const nodes = graph.nodes.map(n => n.id);
            const dist = {};

            nodes.forEach(u => {
                dist[u] = {};
                nodes.forEach(v => {
                    dist[u][v] = (u === v) ? 0 : Infinity;
                });
            });

            graph.edges.forEach(e => {
                dist[e.from][e.to] = e.weight;
            });

            const clone = (obj) => JSON.parse(JSON.stringify(obj));

            history.push({
                stepId: 0, dist: clone(dist), k: null, i: null, j: null,
                status: 'START', algoLine: 1,
                speech: SEARCH_SCRIPT.FLOYD_WARSHALL.START()
            });

            nodes.forEach(k => {
                history.push({
                    stepId: history.length, dist: clone(dist), k, i: null, j: null,
                    status: 'PHASE', algoLine: 2,
                    speech: SEARCH_SCRIPT.FLOYD_WARSHALL.PHASE(k)
                });

                nodes.forEach(i => {
                    nodes.forEach(j => {
                        const oldVal = dist[i][j];
                        const viaK = dist[i][k] + dist[k][j];
                        
                        const step = {
                            stepId: history.length, dist: clone(dist), k, i, j,
                            status: 'CHECKING', algoLine: 5
                        };

                        if (viaK < oldVal) {
                            dist[i][j] = viaK;
                            step.status = 'UPDATING';
                            step.speech = SEARCH_SCRIPT.FLOYD_WARSHALL.UPDATING(i, j, k, oldVal, viaK);
                            step.algoLine = 6;
                        }
                        history.push(step);
                    });
                });
            });

            history.push({
                stepId: history.length, dist: clone(dist), k: null, i: null, j: null,
                status: 'SUCCESS', algoLine: 2,
                speech: SEARCH_SCRIPT.FLOYD_WARSHALL.SUCCESS()
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

            const [inputText, setInputText] = useState(DEFAULT_EDGES);
            const [isEditing, setIsEditing] = useState(false);
            const [currentStep, setCurrentStep] = useState(0);
            const [isPlaying, setIsPlaying] = useState(false);
            const [speedMultiplier, setSpeedMultiplier] = useState(1);
            const [zoom, setZoom] = useState(0.7);
            const [isMuted, setIsMuted] = useState(false);
            const [isMinimized, setIsMinimized] = useState(false);
            const [showSidebar, setShowSidebar] = useState(true);
            
            const [manualOffset, setManualOffset] = useState({ x: window.innerWidth / 2 - 450, y: window.innerHeight / 2 - 350 });
            const [panelOffset, setPanelOffset] = useState({ x: 0, y: 0 });
            const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
            const [isDraggingPanel, setIsDraggingPanel] = useState(false);
            const canvasDragStart = useRef({ x: 0, y: 0 });
            const panelDragStart = useRef({ x: 0, y: 0 });
            const isPlayingRef = useRef(false);
            isPlayingRef.current = isPlaying;

            const graph = useMemo(() => parseGraph(inputText), [inputText]);
            const history = useMemo(() => generateSimulation(graph), [graph]);

            const nextStep = () => { setCurrentStep(prev => (prev < history.length - 1 ? prev + 1 : (setIsPlaying(false), prev))); };
            const prevStep = () => { setCurrentStep(prev => Math.max(0, prev - 1)); setIsPlaying(false); };

            const speak = (text) => {
                const delay = (600 / speedMultiplier);
                if (isMuted || !text) { setTimeout(() => { if(isPlayingRef.current) nextStep(); }, delay); return; }
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                const voices = window.speechSynthesis.getVoices();
                if(voices.length > 0) utterance.voice = voices.find(v => v.lang.includes('en-US')) || voices[0];
                utterance.pitch = 1.0; utterance.rate = 1.1 * speedMultiplier;
                utterance.onend = () => { if(isPlayingRef.current) nextStep(); };
                window.speechSynthesis.speak(utterance);
            };

            useEffect(() => {
                if (isPlaying) speak(history[currentStep]?.speech);
                else window.speechSynthesis.cancel();
            }, [isPlaying, currentStep]);

            const state = history[currentStep] || { dist: {} };
            const nodes = graph.nodes.map(n => n.id);

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
                                    <h1 className="font-bold text-lg leading-none tracking-tight">Floyd-Warshall</h1>
                                    <span className="text-xs text-slate-400 font-mono">Dynamic Programming All-Pairs Pathfinding</span>
                                    <button onClick={() => setIsSettingsOpen(true)} className="ml-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white shadow-lg">
                                        <SettingsIcon size={20}/>
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setShowSidebar(!showSidebar)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${showSidebar ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                                    {showSidebar ? "Hide Matrix" : "Show Matrix"}
                                </button>
                                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-bold transition-all shadow-lg">
                                    <Edit size={18}/> Edit Graph
                                </button>
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="absolute inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 text-white pointer-events-auto">
                            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-lg w-full shadow-2xl">
                                <h2 className="text-2xl font-bold mb-2">Edit Matrix Edges</h2>
                                <p className="text-slate-400 text-sm mb-4">Format: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-blue-300">U V Weight</code></p>
                                <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} className="w-full h-64 bg-slate-950 border border-slate-700 rounded-xl p-4 font-mono text-blue-400 outline-none focus:border-blue-500 mb-6" />
                                <div className="flex justify-end gap-4">
                                    <button onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-all">Cancel</button>
                                    <button onClick={() => { setIsEditing(false); setCurrentStep(0); setIsPlaying(false); }} className="px-8 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 shadow-lg transition-all text-white">Apply Weights</button>
                                </div>
                            </div>
                        </div>
                    )}

                    <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
                    <AlgorithmPanel algoKey="FLOYD_WARSHALL" currentLine={state.algoLine} />

                    <div className="flex flex-1 overflow-hidden relative">
                        {/* Graph Canvas */}
                        <div className="flex-1 relative infinite-bg overflow-hidden cursor-grab active:cursor-grabbing" onWheel={(e) => setZoom(z => Math.min(Math.max(0.1, z-e.deltaY*0.001), 2.0))} onMouseDown={(e) => {if(!e.target.closest('.control-panel-wrapper') && !e.target.closest('.top-nav-area')) {setIsDraggingCanvas(true); canvasDragStart.current={x: e.clientX-manualOffset.x, y: e.clientY-manualOffset.y};}}}>
                            <div className={`node-container absolute origin-top-left ${isDraggingCanvas ? '' : 'camera-layer'}`} style={{ transform: `translate(${manualOffset.x}px, ${manualOffset.y}px) scale(${zoom})` }}>
                                <svg className="overflow-visible" width="1000" height="1000">
                                    <defs>
                                        <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" /></marker>
                                        <marker id="arrow-pivot" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" /></marker>
                                        <marker id="arrow-active" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" /></marker>
                                    </defs>
                                    {graph.edges.map((edge, i) => {
                                        const u = graph.nodes.find(n => n.id === edge.from), v = graph.nodes.find(n => n.id === edge.to);
                                        const isPivotLink = (edge.from === state.i && edge.to === state.k) || (edge.from === state.k && edge.to === state.j);
                                        const isActiveLink = (edge.from === state.i && edge.to === state.j);
                                        return (
                                            <g key={i}>
                                                <line x1={u.x} y1={u.y} x2={v.x} y2={v.y} stroke={isPivotLink ? "#f43f5e" : (isActiveLink ? "#6366f1" : "#1e293b")} strokeWidth={isPivotLink || isActiveLink ? 4 : 2} markerEnd={`url(#${isPivotLink ? 'arrow-pivot' : (isActiveLink ? 'arrow-active' : 'arrow')})`} className="transition-all duration-300" />
                                                <rect x={(u.x+v.x)/2 - 12} y={(u.y+v.y)/2 - 12} width="24" height="24" rx="4" fill="#0f172a" />
                                                <text x={(u.x+v.x)/2} y={(u.y+v.y)/2} textAnchor="middle" dy=".3em" fontSize="10" fontWeight="bold" fill={isPivotLink ? "#f43f5e" : (isActiveLink ? "#6366f1" : "#475569")}>{edge.weight}</text>
                                            </g>
                                        );
                                    })}
                                    {graph.nodes.map(node => (
                                        <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                                            <circle r="25" fill="#1e293b" stroke={node.id === state.k ? '#f43f5e' : (node.id === state.i || node.id === state.j ? '#6366f1' : '#475569')} strokeWidth="3" className={`transition-all duration-300 ${node.id === state.k ? 'node-pivot' : (node.id === state.i || node.id === state.j ? 'node-active' : '')}`} />
                                            <text textAnchor="middle" dy=".3em" fill="white" fontSize={settings.fontSize} fontWeight="900">{node.id}</text>
                                        </g>
                                    ))}
                                </svg>
                            </div>
                        </div>

                        {/* Matrix Sidebar */}
                        {showSidebar && (
                            <div className="w-[480px] bg-slate-900/50 backdrop-blur-xl border-l border-slate-700/50 flex flex-col p-8 overflow-y-auto z-40 relative shadow-2xl">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">DISTANCE MATRIX D<sup>({state.k || '0'})</sup></h3>
                                    <TableIcon size={14} className="text-slate-500" />
                                </div>
                                
                                <div className="grid gap-1 mb-10" style={{ gridTemplateColumns: `repeat(${nodes.length + 1}, minmax(0, 1fr))` }}>
                                    <div className="h-12 flex items-center justify-center"></div>
                                    {nodes.map(node => <div key={node} className="h-12 flex items-center justify-center text-[10px] font-black text-slate-500 bg-slate-800/20 rounded-t-lg">{node}</div>)}
                                    
                                    {nodes.map(i => (
                                        <React.Fragment key={i}>
                                            <div className="h-12 flex items-center justify-center text-[10px] font-black text-slate-500 bg-slate-800/20 rounded-l-lg">{i}</div>
                                            {nodes.map(j => {
                                                const val = state.dist[i][j];
                                                const isPivotUsage = (i === state.i && j === state.k) || (i === state.k && j === state.j);
                                                const isActiveCell = (i === state.i && j === state.j);
                                                const isKBoundary = (i === state.k || j === state.k);

                                                return (
                                                    <div key={j} className={`matrix-cell h-12 flex items-center justify-center text-xs font-mono transition-all duration-200 ${isActiveCell ? 'matrix-active rounded-lg' : (isPivotUsage ? 'matrix-pivot rounded-lg' : (isKBoundary ? 'matrix-k-row-col' : ''))}`}>
                                                        {val === Infinity ? '8' : (val !== null && val !== undefined ? Math.round(val) : '—')}
                                                    </div>
                                                );
                                            })}
                                        </React.Fragment>
                                    ))}
                                </div>

                                <div className="mt-auto p-5 bg-slate-950/50 border border-slate-800 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Logic Comparison</span>
                                    </div>
                                    <div className="space-y-3 font-mono text-xs">
                                        <div className="flex justify-between items-center text-slate-500">
                                            <span>Current: D[{state.i || 'i'}][{state.j || 'j'}]</span>
                                            <span className="text-white font-bold">
                                                {state.i && state.j ? (state.dist[state.i][state.j] === Infinity ? '8' : state.dist[state.i][state.j].toFixed(1)) : '—'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-rose-400">
                                            <span>Via {state.k || 'k'}: D[i][k] + D[k][j]</span>
                                            <span className="font-bold">
                                                {state.i && state.j && state.k ? 
                                                    ((state.dist[state.i][state.k] + state.dist[state.k][state.j]) === Infinity ? '8' : (state.dist[state.i][state.k] + state.dist[state.k][state.j]).toFixed(1)) 
                                                    : '—'}
                                            </span>
                                        </div>
                                        <div className={`mt-4 pt-4 border-t border-slate-800 text-center font-black ${state.status === 'UPDATING' ? 'text-indigo-400' : 'text-slate-600'}`}>
                                            {state.status === 'UPDATING' ? 'SHORTCUT FOUND!' : (state.status === 'CHECKING' ? 'NO CHANGE' : 'PENDING')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
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
                                            <span className="text-sm font-mono text-emerald-300 truncate">
                                                {state.status === 'START' && "Initializing Distance Matrix..."}
                                                {state.status === 'PHASE' && `Exploring paths via node ${state.k}`}
                                                {state.status === 'CHECKING' && `Checking ${state.i}?${state.k}?${state.j}`}
                                                {state.status === 'UPDATING' && `Found shorter path for ${state.i}?${state.j}!`}
                                                {state.status === 'SUCCESS' && "Optimization complete!"}
                                            </span>
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
    
