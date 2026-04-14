window.initSharedIcons = (React) => {
    const e = React.createElement;

    const IconWrapper = ({ children, size = 20, className = "", ...props }) => 
        e('svg', { 
            xmlns: "http://www.w3.org/2000/svg", 
            width: size, 
            height: size, 
            viewBox: "0 0 24 24", 
            fill: "none", 
            stroke: "currentColor", 
            strokeWidth: "2", 
            strokeLinecap: "round", 
            strokeLinejoin: "round", 
            className: className, 
            ...props 
        }, children);

    const createIcon = (children) => (props) => e(IconWrapper, props, children);

    return {
        IconWrapper,
        Play: createIcon(e('polygon', { points: "5 3 19 12 5 21 5 3" })),
        Pause: createIcon([
            e('rect', { x: "6", y: "4", width: "4", height: "16", key: "r1" }), 
            e('rect', { x: "14", y: "4", width: "4", height: "16", key: "r2" })
        ]),
        SkipBack: createIcon([
            e('polygon', { points: "19 20 9 12 19 4 19 20", key: "p1" }), 
            e('line', { x1: "5", y1: "19", x2: "5", y2: "5", key: "l1" })
        ]),
        SkipForward: createIcon([
            e('polygon', { points: "5 4 15 12 5 20 5 4", key: "p1" }), 
            e('line', { x1: "19", y1: "5", x2: "19", y2: "19", key: "l1" })
        ]),
        Rewind: createIcon([
            e('polygon', { points: "11 19 2 12 11 5 11 19", key: "p1" }), 
            e('polygon', { points: "22 19 13 12 22 5 22 19", key: "p2" })
        ]),
        FastForward: createIcon([
            e('polygon', { points: "13 19 22 12 13 5 13 19", key: "p1" }), 
            e('polygon', { points: "2 19 11 12 2 5 2 19", key: "p2" })
        ]),
        GripHorizontal: createIcon([
            e('circle', { cx: "12", cy: "9", r: "1", key: "c1" }),
            e('circle', { cx: "19", cy: "9", r: "1", key: "c2" }),
            e('circle', { cx: "5", cy: "9", r: "1", key: "c3" }),
            e('circle', { cx: "12", cy: "15", r: "1", key: "c4" }),
            e('circle', { cx: "19", cy: "15", r: "1", key: "c5" }),
            e('circle', { cx: "5", cy: "15", r: "1", key: "c6" })
        ]),
        Home: createIcon([
            e('path', { d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", key: "p1" }),
            e('polyline', { points: "9 22 9 12 15 12 15 22", key: "l1" })
        ]),
        Volume2: createIcon([
            e('polygon', { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5", key: "p1" }),
            e('path', { d: "M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07", key: "p2" })
        ]),
        VolumeX: createIcon([
            e('polygon', { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5", key: "p1" }),
            e('line', { x1: "23", y1: "9", x2: "17", y2: "15", key: "l1" }),
            e('line', { x1: "17", y1: "9", x2: "23", y2: "15", key: "l2" })
        ]),
        ChevronUp: createIcon(e('polyline', { points: "18 15 12 9 6 15" })),
        ChevronDown: createIcon(e('polyline', { points: "6 9 12 15 18 9" })),
        ZoomIn: createIcon([
            e('circle', { cx: "11", cy: "11", r: "8", key: "c1" }),
            e('line', { x1: "21", y1: "21", x2: "16.65", y2: "16.65", key: "l1" }),
            e('line', { x1: "11", y1: "8", x2: "11", y2: "14", key: "l2" }),
            e('line', { x1: "8", y1: "11", x2: "14", y2: "11", key: "l3" })
        ]),
        ZoomOut: createIcon([
            e('circle', { cx: "11", cy: "11", r: "8", key: "c1" }),
            e('line', { x1: "21", y1: "21", x2: "16.65", y2: "16.65", key: "l1" }),
            e('line', { x1: "8", y1: "11", x2: "14", y2: "11", key: "l2" })
        ]),
        Edit: createIcon([
            e('path', { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", key: "p1" }),
            e('path', { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z", key: "p2" })
        ]),
        Settings: createIcon([
            e('path', { d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.58a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.58a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.58a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.58a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z", key: "p1" }),
            e('circle', { cx: "12", cy: "12", r: "3", key: "c1" })
        ])
    };
};
