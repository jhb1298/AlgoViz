import './src/globals.js';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './sorting_script.js';
import './settings_manager.js';
import './algorithm_data.js';
import './chatbot.js';

/* extracted from quick.html */

        
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

        const NODE_WIDTH = 240;
        const NODE_HEIGHT = 160; 
        const VERTICAL_GAP = 200; 
        const HORIZONTAL_GAP = 30;

        function generateSimulation(initialArr) {
            let nodeIdCounter = 0;
            const history = [];
            let data = [...initialArr];
            
            function partition(low, high, nodeId) {
                let pivot = data[high];
                history.push({ stepId: history.length, nodeId, arr: [...data], pivotIdx: high, low, high, status: 'PIVOT', algoLine: 2, desc: `Pivot is ${pivot}`, speech: SORTING_SCRIPT.QUICK.PIVOT(pivot) });
                
                let i = low - 1;
                for (let j = low; j < high; j++) {
                    history.push({ stepId: history.length, nodeId, arr: [...data], pivotIdx: high, currentIdx: j, i, low, high, status: 'SCANNING', algoLine: 3, desc: `Comparing ${data[j]} with ${pivot}`, speech: SORTING_SCRIPT.QUICK.PARTITIONING(data[j], pivot) });
                    if (data[j] < pivot) {
                        i++;
                        [data[i], data[j]] = [data[j], data[i]];
                        history.push({ stepId: history.length, nodeId, arr: [...data], pivotIdx: high, currentIdx: j, i, low, high, status: 'SWAPPING', algoLine: 4, desc: `Swapped ${data[i]} and ${data[j]}` });
                    }
                }
                [data[i + 1], data[high]] = [data[high], data[i + 1]];
                history.push({ stepId: history.length, nodeId, arr: [...data], pivotIdx: i + 1, low, high, status: 'PIVOT_PLACED', algoLine: 3, desc: `Placed pivot at final spot` });
                return i + 1;
            }

            function solve(low, high, depth, parentId = null) {
                const id = nodeIdCounter++;
                const subset = data.slice(low, high + 1);
                const node = { id, parentId, low, high, subset, children: [], depth };
                
                history.push({ stepId: history.length, nodeId: id, arr: [...data], low, high, status: 'START', algoLine: 1, desc: `Quicksort on [${subset.join(',')}]`, speech: SORTING_SCRIPT.QUICK.START() });

                if (low < high) {
                    let pi = partition(low, high, id);
                    
                    history.push({ stepId: history.length, nodeId: id, arr: [...data], low, pi, high, status: 'RECURSE_LEFT', algoLine: 5, desc: "Recursing left", speech: SORTING_SCRIPT.QUICK.RECURSING('left') });
                    const leftChild = solve(low, pi - 1, depth + 1, id);
                    node.children.push(leftChild.node);

                    history.push({ stepId: history.length, nodeId: id, arr: [...data], low, pi, high, status: 'RECURSE_RIGHT', algoLine: 6, desc: "Recursing right", speech: SORTING_SCRIPT.QUICK.RECURSING('right') });
                    const rightChild = solve(pi + 1, high, depth + 1, id);
                    node.children.push(rightChild.node);
                } else {
                    history.push({ stepId: history.length, nodeId: id, arr: [...data], low, high, status: 'BASE', algoLine: 1, desc: `Base case reached` });
                }

                return { node };
            }

            const { node: treeRoot } = solve(0, data.length - 1, 0);
            return { treeRoot, history };
        }

        function calculateLayout(node) {
            if (!node.children || node.children.length === 0) { node.width = NODE_WIDTH + HORIZONTAL_GAP; return node.width; }
            let totalWidth = 0; node.children.forEach(child => totalWidth += calculateLayout(child));
            node.width = Math.max(totalWidth, NODE_WIDTH + HORIZONTAL_GAP); return node.width;
        }

        function assignCoordinates(node, xOffset, yOffset, flatList = []) {
            node.x = xOffset + node.width / 2 - NODE_WIDTH / 2; node.y = yOffset; flatList.push(node);
            let currentX = xOffset; node.children.forEach(child => { assignCoordinates(child, currentX, yOffset + VERTICAL_GAP, flatList); currentX += child.width; });
            return flatList;
        }

        const NodeComponent = ({ nodeData, isActive, isBreadcrumb, latestState }) => {
            const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('simulation_settings') || '{"fontSize": 16, "nodeColor": "#3b82f6"}'));
            useEffect(() => {
                const handleUpdate = () => setSettings(JSON.parse(localStorage.getItem('simulation_settings') || '{"fontSize": 16, "nodeColor": "#3b82f6"}'));
                window.addEventListener('simulation_settings_updated', handleUpdate);
                return () => window.removeEventListener('simulation_settings_updated', handleUpdate);
            }, []);

            let opacity = 0.3, borderColor = "border-slate-700", statusText = "IDLE", statusColor = "bg-slate-700";
            
            if (latestState) {
                if (isActive) {
                    opacity = 1; borderColor = "border-blue-500"; statusColor = "bg-blue-600"; statusText = "ACTIVE";
                } else {
                    opacity = 0.8; borderColor = "border-slate-600"; statusColor = "bg-slate-600"; statusText = "COMPLETED";
                }
            }
            if (isBreadcrumb && !isActive) { opacity = 1; borderColor = "border-indigo-500"; statusColor = "bg-indigo-600"; statusText = "WAITING"; }

            return (
                <div className={`absolute rounded-xl shadow-2xl overflow-hidden transition-all duration-300 border-2 bg-slate-800 flex flex-col ${borderColor}`} style={{ left: nodeData.x, top: nodeData.y, width: NODE_WIDTH, height: NODE_HEIGHT, opacity, zIndex: isActive ? 50 : 10, fontSize: settings.fontSize + "px", borderColor: isActive ? settings.nodeColor : undefined, boxShadow: isActive ? `0 0 20px ${settings.nodeColor}80` : undefined }}>
                    <div className="bg-slate-900/80 px-3 py-1.5 flex justify-between items-center border-b border-slate-700">
                        <span className="font-mono font-bold text-[10px] text-slate-400">QS({nodeData.low}..{nodeData.high})</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${statusColor} text-white`}>{statusText}</span>
                    </div>
                    
                    <div className="flex-1 flex items-end justify-center gap-1 p-3 bg-slate-900/40">
                        {nodeData.subset.map((val, i) => {
                            const globalIdx = nodeData.low + i;
                            let barColor = "bg-slate-600";
                            let height = (val / 100) * 80 + 10;
                            
                            if (latestState && isActive) {
                                if (globalIdx === latestState.pivotIdx) barColor = "bg-rose-500";
                                else if (globalIdx === latestState.currentIdx) barColor = "bg-blue-500";
                                else if (globalIdx <= latestState.i && globalIdx >= latestState.low) barColor = "bg-emerald-500/60";
                            }

                            return (
                                <div key={i} className="flex flex-col items-center gap-1" style={{ width: `${100/nodeData.subset.length}%` }}>
                                    <div className={`w-full rounded-t-sm ${barColor}`} style={{ height: `${height}px` }}></div>
                                    <span className="text-[8px] font-mono text-slate-500">{val}</span>
                                </div>
                            );
                        })}
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
            const [input, setInput] = useState("40,10,100,20,50,70,30");
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

            const { history, flatNodes } = useMemo(() => {
                const arr = input.split(',').map(Number).filter(n => !isNaN(n));
                if (arr.length === 0) return { history: [], flatNodes: [] };
                const { treeRoot, history } = generateSimulation(arr);
                calculateLayout(treeRoot);
                const flat = assignCoordinates(treeRoot, 0, 0);
                return { history, flatNodes: flat };
            }, [input]);

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
                            <div className="flex items-center gap-4"><a href="index.html" className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"><Home size={20} /></a><div><h1 className="font-bold text-lg leading-none tracking-tight">Recursive Quick Sort</h1><span className="text-xs text-slate-400 font-mono">Tree-based partitioning visualization</span><button onClick={() => setIsSettingsOpen(true)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white shadow-lg"><SettingsIcon size={20}/></button></div></div>
                            <div className="flex items-center gap-2 bg-slate-800/80 p-1 pr-3 rounded-lg border border-slate-700/50"><span className="bg-slate-700/80 px-2 py-1 rounded text-slate-300 text-xs font-bold uppercase mr-1">Input Array</span><input type="text" value={input} onChange={(e) => { setInput(e.target.value); setCurrentStep(0); setIsPlaying(false); }} className="bg-transparent font-bold outline-none text-blue-400 w-32 border-b border-blue-500/30 text-center" /></div>
                        </div>
                    </div>
                    <AlgorithmPanel algoKey="QUICKSORT" currentLine={currentState?.algoLine} />
                    <div className="flex-1 relative infinite-bg overflow-hidden cursor-grab" onWheel={(e) => setZoom(z => Math.min(Math.max(0.1, z-e.deltaY*0.001), 1.5))} onMouseDown={(e) => {if(!e.target.closest('.control-panel-wrapper') && !e.target.closest('.top-nav-area')) {setIsDraggingCanvas(true); canvasDragStart.current={x: e.clientX-manualOffset.x, y: e.clientY-manualOffset.y};}}}>
                        <div className={`node-container absolute origin-top-left ${isDraggingCanvas ? '' : 'camera-layer'}`} style={{ transform: `translate(${camTarget.x + manualOffset.x}px, ${camTarget.y + manualOffset.y}px) scale(${zoom})` }}>
                            <svg className="absolute top-0 left-0 overflow-visible" style={{ width: 1, height: 1 }}>{flatNodes.map(node => node.children.map(child => (<path key={`${node.id}-${child.id}`} d={`M ${node.x+NODE_WIDTH/2} ${node.y+NODE_HEIGHT} C ${node.x+NODE_WIDTH/2} ${(node.y+child.y)/2}, ${child.x+NODE_WIDTH/2} ${(node.y+child.y)/2}, ${child.x+NODE_WIDTH/2} ${child.y}`} fill="none" stroke={activePathIds.has(child.id) ? "#818cf8" : (latestNodeStates[child.id] ? "#475569" : "#1e293b")} strokeWidth={activePathIds.has(child.id) ? 3 : 2} className={`edge-path ${activePathIds.has(child.id) ? 'edge-waiting' : ''}`} style={{ opacity: activePathIds.has(child.id) ? 1 : (latestNodeStates[child.id] ? 0.8 : 0.2) }} />)))}</svg>
                            {flatNodes.map(node => <NodeComponent key={node.id} nodeData={node} isActive={currentState?.nodeId === node.id} isBreadcrumb={activePathIds.has(node.id)} latestState={latestNodeStates[node.id]} />)}
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
    
