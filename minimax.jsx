import './src/globals.js';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './minimax_script.js';
import './settings_manager.js';
import './algorithm_data.js';
import './chatbot.js';

/* extracted from minimax.html */

        
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

        const NODE_WIDTH = 220;
        const NODE_HEIGHT = 180; 
        const VERTICAL_GAP = 240; 
        const HORIZONTAL_GAP = 40;

        function generateSimulation(maxDepth, isPruning) {
            let nodeIdCounter = 0;
            const history = [];
            const leafValues = [3, 5, 2, 9, 12, 5, 23, 23, 1, 2, 3, 4, 5, 6, 7, 8]; // Predefined leaf values

            function solve(depth, nodeIndex, isMax, alpha, beta, parentId = null) {
                const id = nodeIdCounter++;
                const node = { id, parentId, depth, isMax, children: [], isPruned: false };
                
                history.push({ stepId: history.length, nodeId: id, line: 0, algoLine: isMax ? 4 : 8, status: 'START', alpha, beta, desc: `${isMax ? 'Max' : 'Min'} evaluating...`, speech: isMax ? MINIMAX_SCRIPT.MAX_TURN(depth) : MINIMAX_SCRIPT.MIN_TURN(depth) });

                if (depth === maxDepth) {
                    const val = leafValues[nodeIndex % leafValues.length];
                    node.val = val;
                    history.push({ stepId: history.length, nodeId: id, line: 1, algoLine: 3, status: 'BASE', val, alpha, beta, desc: `Leaf value: ${val}`, speech: MINIMAX_SCRIPT.LEAF(val) });
                    return { node, val };
                }

                let bestVal = isMax ? -Infinity : Infinity;
                for (let i = 0; i < 2; i++) {
                    history.push({ stepId: history.length, nodeId: id, line: 2, algoLine: isMax ? 6 : 10, status: 'THINKING', alpha, beta, desc: `Exploring child ${i + 1}` });
                    
                    const { node: child, val } = solve(depth + 1, nodeIndex * 2 + i, !isMax, alpha, beta, id);
                    node.children.push(child);

                    if (isMax) {
                        bestVal = Math.max(bestVal, val);
                        alpha = Math.max(alpha, bestVal);
                    } else {
                        bestVal = Math.min(bestVal, val);
                        beta = Math.min(beta, bestVal);
                    }

                    if (isPruning && beta <= alpha) {
                        history.push({ stepId: history.length, nodeId: id, line: 3, algoLine: null, status: 'PRUNING', alpha, beta, val: bestVal, desc: `Pruning triggered!`, speech: MINIMAX_SCRIPT.PRUNED(isMax ? 'MAX' : 'MIN', bestVal, isMax ? beta : alpha) });
                        // Mark next children as pruned in layout (conceptual)
                        break;
                    }
                }

                node.val = bestVal;
                history.push({ stepId: history.length, nodeId: id, line: 4, algoLine: isMax ? 7 : 11, status: 'RETURN', val: bestVal, alpha, beta, desc: `Returning ${bestVal}`, speech: MINIMAX_SCRIPT.RETURN(isMax ? 'Max' : 'Min', bestVal) });
                return { node, val: bestVal };
            }

            const { node: treeRoot } = solve(0, 0, true, -Infinity, Infinity);
            return { treeRoot, history };
        }

        function calculateLayout(node) {
            if (node.children.length === 0) { node.width = NODE_WIDTH + HORIZONTAL_GAP; return node.width; }
            let totalWidth = 0; node.children.forEach(c => totalWidth += calculateLayout(c));
            node.width = Math.max(totalWidth, NODE_WIDTH + HORIZONTAL_GAP); return node.width;
        }

        function assignCoords(node, xOffset, flatList) {
            node.x = xOffset + node.width / 2 - NODE_WIDTH / 2; node.y = node.depth * VERTICAL_GAP;
            flatList.push(node); let currX = xOffset;
            node.children.forEach(c => { assignCoords(c, currX, flatList); currX += c.width; });
        }

        const NodeComponent = ({ nodeData, isActive, isBreadcrumb, latestState, pruningEnabled }) => {
            const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('simulation_settings') || '{"fontSize": 16, "nodeColor": "#3b82f6"}'));
            useEffect(() => {
                const handleUpdate = () => setSettings(JSON.parse(localStorage.getItem('simulation_settings') || '{"fontSize": 16, "nodeColor": "#3b82f6"}'));
                window.addEventListener('simulation_settings_updated', handleUpdate);
                return () => window.removeEventListener('simulation_settings_updated', handleUpdate);
            }, []);
            const { isMax, depth } = nodeData;
            let highlightLine = -1, statusColor = "bg-slate-700", statusText = "IDLE", borderColor = "border-slate-700", opacity = 0.3, isWaiting = false;
            
            if (latestState) {
                opacity = 1; highlightLine = latestState.line;
                if (latestState.status === 'START') { statusColor = "bg-blue-600"; statusText = isMax ? "MAX TURN" : "MIN TURN"; borderColor="border-blue-500"; }
                if (latestState.status === 'BASE') { statusColor = "bg-emerald-600"; statusText = "LEAF"; borderColor="border-emerald-500"; }
                if (latestState.status === 'THINKING') { statusColor = "bg-indigo-600"; statusText = "WAITING"; borderColor = "border-indigo-500/50"; isWaiting = true; }
                if (latestState.status === 'PRUNING') { statusColor = "bg-amber-600"; statusText = "PRUNED!"; borderColor="border-amber-500"; }
                if (latestState.status === 'RETURN') { statusColor = "bg-rose-600"; statusText = "DECIDED"; borderColor="border-rose-500"; opacity = 0.8; }
            }
            if (isBreadcrumb && !isActive) { borderColor = 'border-indigo-500/70'; opacity = 1; }

            const getCodeClass = (line) => {
                if (highlightLine !== line) return "px-2 rounded";
                if (line === 2 && isWaiting) return "px-2 rounded code-highlight-waiting text-indigo-300";
                return "px-2 rounded code-highlight text-yellow-200";
            };

            return (
                <div className={`absolute shadow-2xl overflow-hidden transition-all duration-300 border-2 bg-slate-800 flex flex-col justify-between ${borderColor} ${isMax ? 'rounded-xl' : 'rounded-full'}`} style={{ left: nodeData.x, top: nodeData.y, width: NODE_WIDTH, height: NODE_HEIGHT, transform: isActive ? 'scale(1.05)' : 'scale(1)', zIndex: isActive ? 50 : 10, opacity, fontSize: settings.fontSize + "px", borderColor: isActive ? settings.nodeColor : undefined, boxShadow: isActive ? `0 0 20px ${settings.nodeColor}80` : undefined }}>
                    <div className="bg-slate-900/80 px-4 py-2 flex justify-between items-center border-b border-slate-700">
                        <span className="font-mono font-bold text-xs text-blue-300">{isMax ? 'MAX' : 'MIN'} (D:{depth})</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${statusColor} text-white shadow-sm`}>{statusText}</span>
                    </div>
                    <div className="px-3 py-1.5 text-[9px] font-mono text-slate-400 bg-slate-900 border-b border-slate-700">
                        <div className={getCodeClass(0)}>1. check children...</div>
                        <div className={getCodeClass(1)}>2. if leaf return val</div>
                        {pruningEnabled && <div className={getCodeClass(3)}>3. if ß &le; a prune!</div>}
                    </div>
                    <div className="bg-slate-800 flex-1 flex flex-col items-center justify-center p-2">
                        <div className="text-3xl font-black text-white">{latestState?.val ?? '?'}</div>
                        {pruningEnabled && (
                            <div className="flex gap-2 text-[10px] font-mono mt-1">
                                <span className="text-emerald-400">&alpha;: {latestState?.alpha === -Infinity ? '-&infin;' : latestState?.alpha}</span>
                                <span className="text-rose-400">&beta;: {latestState?.beta === Infinity ? '&infin;' : latestState?.beta}</span>
                            </div>
                        )}
                    </div>
                </div>
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
            const [depth, setDepth] = useState(3);
            const [pruningEnabled, setPruningEnabled] = useState(true);
            const [currentStep, setCurrentStep] = useState(0);
            const [isPlaying, setIsPlaying] = useState(false);
            const [speedMultiplier, setSpeedMultiplier] = useState(1);
            const [zoom, setZoom] = useState(0.6);
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

            const { treeRoot, history, flatNodes } = useMemo(() => {
                const { treeRoot, history } = generateSimulation(depth, pruningEnabled);
                calculateLayout(treeRoot);
                const flat = []; assignCoords(treeRoot, 0, flat);
                return { treeRoot, history, flatNodes: flat };
            }, [depth, pruningEnabled]);

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

            useEffect(() => {
                if (flatNodes.length === 0) return;
                const activeNode = flatNodes.find(n => n.id === history[currentStep]?.nodeId);
                if (activeNode) {
                    const targetX = (window.innerWidth/2) - (activeNode.x + NODE_WIDTH/2)*zoom, targetY = (window.innerHeight/2) - (activeNode.y + NODE_HEIGHT/2)*zoom;
                    setCamTarget({ x: targetX, y: targetY });
                    if(!isDraggingCanvas && isPlaying) setManualOffset({ x: 0, y: 0 });
                }
            }, [currentStep, zoom, flatNodes, isPlaying]);

            const currentState = history[currentStep];
            const activePathIds = new Set();
            const latestNodeStates = {};
            if (currentState) {
                for(let i = 0; i <= currentStep; i++) latestNodeStates[history[i].nodeId] = history[i];
                let curr = flatNodes.find(n => n.id === currentState.nodeId);
                while (curr) { activePathIds.add(curr.id); curr = flatNodes.find(n => n.id === curr.parentId); }
            }

            return (
                <div className="h-screen w-screen flex flex-col relative overflow-hidden bg-slate-900 text-white select-none" onMouseMove={(e) => { if(isDraggingPanel) setPanelOffset({x: e.clientX-panelDragStart.current.x, y: e.clientY-panelDragStart.current.y}); else if(isDraggingCanvas) setManualOffset({x: e.clientX-canvasDragStart.current.x, y: e.clientY-canvasDragStart.current.y}); }} onMouseUp={() => {setIsDraggingCanvas(false); setIsDraggingPanel(false);}}>
                    <div className="absolute top-0 left-0 right-0 z-[60] top-nav-area">
                        <div className="absolute top-0 left-0 w-full h-4 z-[70] peer"></div>
                        <div className="relative h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-6 shadow-2xl transition-transform duration-300 -translate-y-full peer-hover:translate-y-0 hover:translate-y-0 z-[60]">
                            <div className="flex items-center gap-4"><a href="index.html" className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"><Home size={20} /></a><div><h1 className="font-bold text-lg leading-none tracking-tight">Minimax Visualizer</h1><span className="text-xs text-slate-400 font-mono">Max Strategy vs Min Strategy</span><button onClick={() => setIsSettingsOpen(true)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white shadow-lg"><SettingsIcon size={20}/></button></div></div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-sm bg-slate-800/80 p-1 pr-3 rounded-lg border border-slate-700/50">
                                    <span className="bg-slate-700/80 px-2 py-1 rounded text-slate-300 text-xs font-bold uppercase mr-1">Pruning</span>
                                    <button onClick={() => { setPruningEnabled(!pruningEnabled); setCurrentStep(0); setIsPlaying(false); }} className={`font-bold transition-colors ${pruningEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>{pruningEnabled ? 'ON' : 'OFF'}</button>
                                </div>
                                <div className="flex items-center gap-2 text-sm bg-slate-800/80 p-1 pr-3 rounded-lg border border-slate-700/50">
                                    <span className="bg-slate-700/80 px-2 py-1 rounded text-slate-300 text-xs font-bold uppercase mr-1">Depth</span>
                                    <select value={depth} onChange={(e) => { setDepth(Number(e.target.value)); setCurrentStep(0); setIsPlaying(false); }} className="bg-transparent font-bold outline-none text-blue-400 cursor-pointer">{[2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}</select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
                    <AlgorithmPanel algoKey="MINIMAX" currentLine={currentState?.algoLine} />
                    <div className="flex-1 relative infinite-bg overflow-hidden cursor-grab" onWheel={(e) => setZoom(z => Math.min(Math.max(0.1, z-e.deltaY*0.001), 1.5))} onMouseDown={(e) => {if(!e.target.closest('.control-panel-wrapper') && !e.target.closest('.top-nav-area')) {setIsDraggingCanvas(true); canvasDragStart.current={x: e.clientX-manualOffset.x, y: e.clientY-manualOffset.y};}}}>
                        <div className={`node-container absolute origin-top-left ${isDraggingCanvas ? '' : 'camera-layer'}`} style={{ transform: `translate(${camTarget.x + manualOffset.x}px, ${camTarget.y + manualOffset.y}px) scale(${zoom})` }}>
                            <svg className="absolute top-0 left-0 overflow-visible" style={{ width: 1, height: 1 }}>
                                {flatNodes.map(node => node.children.map(child => {
                                    const isPrunedInCurrentState = latestNodeStates[node.id]?.status === 'PRUNING' && !latestNodeStates[child.id];
                                    return (
                                        <path key={`${node.id}-${child.id}`} d={`M ${node.x+NODE_WIDTH/2} ${node.y+NODE_HEIGHT} C ${node.x+NODE_WIDTH/2} ${(node.y+child.y)/2}, ${child.x+NODE_WIDTH/2} ${(node.y+child.y)/2}, ${child.x+NODE_WIDTH/2} ${child.y}`} fill="none" stroke={activePathIds.has(child.id) ? "#818cf8" : (latestNodeStates[child.id] ? "#475569" : "#1e293b")} strokeWidth={activePathIds.has(child.id) ? 3 : 2} className={`edge-path ${activePathIds.has(child.id) ? 'edge-waiting' : ''} ${isPrunedInCurrentState ? 'pruned-ghost' : ''}`} style={{ opacity: activePathIds.has(child.id) ? 1 : (latestNodeStates[child.id] ? 0.8 : 0.2) }} />
                                    );
                                }))}
                            </svg>
                            {flatNodes.map(node => <NodeComponent key={node.id} nodeData={node} isActive={currentState?.nodeId === node.id} isBreadcrumb={activePathIds.has(node.id)} latestState={latestNodeStates[node.id]} pruningEnabled={pruningEnabled} />)}
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
                                        <div className="flex flex-col w-[30%] overflow-hidden pr-2"><span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Step {String(currentStep).padStart(3, '0')}</span><span className="text-sm font-mono text-emerald-300 truncate">{currentState?.desc}</span></div>
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
    
