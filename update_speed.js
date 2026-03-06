const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'index.html');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // 1. Find original base speed
    const useStateMatch = content.match(/const\s+\[playbackSpeed,\s+setPlaybackSpeed\]\s+=\s+useState\((\d+)\);/);
    if (!useStateMatch) {
        console.log(`Could not find playbackSpeed useState in ${file}`);
        return;
    }
    const baseSpeed = useStateMatch[1];
    
    // 2. Replace useState
    content = content.replace(
        /const\s+\[playbackSpeed,\s+setPlaybackSpeed\]\s+=\s+useState\(\d+\);/,
        'const [speedMultiplier, setSpeedMultiplier] = useState(1);'
    );
    
    // 3. Update speak function
    // Insert delay calculation at the start of speak function
    content = content.replace(
        /(const speak = \(text\) => \{)/,
        `$1\n                const delay = (${baseSpeed} / speedMultiplier);`
    );
    
    // Update setTimeout to use delay instead of playbackSpeed
    // We look for setTimeout inside the speak function. 
    // It's usually: setTimeout(() => { ... }, playbackSpeed) or setTimeout(nextStep, playbackSpeed)
    content = content.replace(
        /(const speak = \(text\) => \{[\s\S]*?setTimeout\([\s\S]*?),\s*playbackSpeed(\);)/g,
        '$1, delay$2'
    );
    
    // Update utterance.rate
    content = content.replace(
        /(utterance\.rate\s*=\s*)([\d.]+)(;)/g,
        (match, p1, p2, p3) => {
            // We only want to update it if it's around 1.1 or 1.2
            if (p2 === '1.1' || p2 === '1.2') {
                return `${p1}${p2} * speedMultiplier${p3}`;
            }
            return match;
        }
    );
    
    // 4. Update the speed slider UI
    // The slider is usually inside a div with "Fallback Speed" or "Speed"
    // We'll look for the whole block and replace it.
    
    const sliderBlockRegex = /<div className="flex flex-col gap-1 items-end w-20">[\s\S]*?<span[\s\S]*?>(Fallback Speed|Speed)<\/span>[\s\S]*?<input[\s\S]*?type="range"[\s\S]*?\/>\s*<\/div>/g;
    
    content = content.replace(sliderBlockRegex, (match) => {
        return `<div className="flex flex-col gap-1 items-end w-24">
                                            <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Speed {speedMultiplier}x</span>
                                            <input type="range" min="0.5" max="2.0" step="0.1" value={speedMultiplier} onChange={(e) => setSpeedMultiplier(Number(e.target.value))} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-400" />
                                        </div>`;
    });

    // Special case for files where the slider might be slightly different
    // e.g. sudoku.html has value={201 - playbackSpeed}
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
});
