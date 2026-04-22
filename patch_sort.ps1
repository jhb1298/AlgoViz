# Add algoLine to remaining sorting files using exact string replacements

$dir = 'c:\Users\JHB\Desktop\Temp\BanglaOCR\IT\DesktopApp\RecursionVisualizer'

function Patch($file, $oldStr, $newStr) {
    $path = Join-Path $dir $file
    $c = Get-Content $path -Raw
    if ($c.Contains($oldStr)) {
        $c = $c.Replace($oldStr, $newStr)
        Set-Content $path $c -NoNewline
        Write-Host "Patched $file"
    } else {
        Write-Host "NOT FOUND in $file : $($oldStr.Substring(0, [Math]::Min(60,$oldStr.Length)))"
    }
}

# ======== HEAP SORT (heap.html) ========
# HEAPSORT pseudocode:
# 1=build heap/START, 2=for i down, 3=swap arr[0] with arr[i], 4=heapify (COMPARING/REBUILDING), 5=done
Patch 'heap.html' `
    "status: 'START', desc: `"Starting Heap Sort`"" `
    "status: 'START', algoLine: 1, desc: `"Starting Heap Sort`""
Patch 'heap.html' `
    "activeNodes: [i, l], size, status: 'COMPARING', desc" `
    "activeNodes: [i, l], size, status: 'COMPARING', algoLine: 4, desc"
Patch 'heap.html' `
    "activeNodes: [i, r], size, status: 'COMPARING', desc" `
    "activeNodes: [i, r], size, status: 'COMPARING', algoLine: 4, desc"
Patch 'heap.html' `
    "activeNodes: [i, largest], size, status: 'SWAPPING', desc" `
    "activeNodes: [i, largest], size, status: 'SWAPPING', algoLine: 3, desc"
Patch 'heap.html' `
    "activeNodes: [0, i], size: i + 1, status: 'EXTRACTING'" `
    "activeNodes: [0, i], size: i + 1, status: 'EXTRACTING', algoLine: 2"
Patch 'heap.html' `
    "size: i, status: 'REBUILDING', desc" `
    "size: i, status: 'REBUILDING', algoLine: 4, desc"
Patch 'heap.html' `
    "status: 'SUCCESS', desc: `"Sort Complete!`", speech: SORTING_SCRIPT.HEAP" `
    "status: 'SUCCESS', algoLine: 5, desc: `"Sort Complete!`", speech: SORTING_SCRIPT.HEAP"

# ======== HEAPIFY (heapify.html) ========
# HEAPIFY pseudocode: 1=START/init, 2=compare loop, 3=largest, 4=SWAPPING, 5=done/no swap
Patch 'heapify.html' `
    "status: 'START', desc: `"Starting Max-Heap construction`"" `
    "status: 'START', algoLine: 1, desc: `"Starting Max-Heap construction`""
Patch 'heapify.html' `
    "activeNodes: [i, l], status: 'COMPARING', desc" `
    "activeNodes: [i, l], status: 'COMPARING', algoLine: 3, desc"
Patch 'heapify.html' `
    "activeNodes: [i, r], status: 'COMPARING', desc" `
    "activeNodes: [i, r], status: 'COMPARING', algoLine: 3, desc"
Patch 'heapify.html' `
    "activeNodes: [i, largest], status: 'SWAPPING', desc" `
    "activeNodes: [i, largest], status: 'SWAPPING', algoLine: 4, desc"
Patch 'heapify.html' `
    "activeNodes: [i], status: 'DONE', desc" `
    "activeNodes: [i], status: 'DONE', algoLine: 5, desc"
Patch 'heapify.html' `
    "status: 'SUCCESS', desc: `"Max-Heap Built!`"" `
    "status: 'SUCCESS', algoLine: 5, desc: `"Max-Heap Built!`""

# ======== SHELL SORT (shellsort.html) ========
# 1=START, 2=gap set, 3=inner for/INSERT, 5=SLIDE, 6=PLACE/done
Patch 'shellsort.html' `
    "status: 'START', desc: `"Starting Shell Sort`"" `
    "status: 'START', algoLine: 1, desc: `"Starting Shell Sort`""
Patch 'shellsort.html' `
    "status: 'GAP', desc" `
    "status: 'GAP', algoLine: 2, desc"
Patch 'shellsort.html' `
    "status: 'INSERT', desc" `
    "status: 'INSERT', algoLine: 3, desc"
Patch 'shellsort.html' `
    "status: 'SLIDE', desc" `
    "status: 'SLIDE', algoLine: 5, desc"
Patch 'shellsort.html' `
    "status: 'PLACE', desc" `
    "status: 'PLACE', algoLine: 6, desc"
Patch 'shellsort.html' `
    "status: 'SUCCESS', desc: `"Sort Complete!`", speech: SORTING_SCRIPT.SHELL" `
    "status: 'SUCCESS', algoLine: 7, desc: `"Sort Complete!`", speech: SORTING_SCRIPT.SHELL"

# ======== COMB SORT (combsort.html) ========
# 1=START, 2=gap/shrink, 4=compare, 5=swap
Patch 'combsort.html' `
    "status: 'START', desc: `"Starting Comb Sort`"" `
    "status: 'START', algoLine: 1, desc: `"Starting Comb Sort`""
Patch 'combsort.html' `
    "status: 'GAP', desc" `
    "status: 'GAP', algoLine: 3, desc"
Patch 'combsort.html' `
    "status: 'COMPARING', desc" `
    "status: 'COMPARING', algoLine: 5, desc"
Patch 'combsort.html' `
    "status: 'SWAPPING', desc" `
    "status: 'SWAPPING', algoLine: 6, desc"
Patch 'combsort.html' `
    "status: 'SUCCESS', desc: `"Sort Complete!`", speech: SORTING_SCRIPT.COMB" `
    "status: 'SUCCESS', algoLine: 6, desc: `"Sort Complete!`", speech: SORTING_SCRIPT.COMB"

# ======== CYCLE SORT (cyclesort.html) ========
# 1=START, 2=find pos/PICK, 3=SKIP, 4=SWAP/rotate
Patch 'cyclesort.html' `
    "status: 'START', desc: `"Starting Cycle Sort`"" `
    "status: 'START', algoLine: 1, desc: `"Starting Cycle Sort`""
Patch 'cyclesort.html' `
    "status: 'PICK', desc" `
    "status: 'PICK', algoLine: 2, desc"
Patch 'cyclesort.html' `
    "status: 'SKIP', desc" `
    "status: 'SKIP', algoLine: 3, desc"
# Two SWAP occurrences differ by text before - patch both generically
$cycleFile = Join-Path $dir 'cyclesort.html'
$c = Get-Content $cycleFile -Raw
$c = $c -replace "status: 'SWAP',", "status: 'SWAP', algoLine: 4,"
Set-Content $cycleFile $c -NoNewline
Write-Host "Patched cyclesort.html SWAP entries"
Patch 'cyclesort.html' `
    "status: 'SUCCESS', desc: `"Sort Complete!`", speech: SORTING_SCRIPT.CYCLE" `
    "status: 'SUCCESS', algoLine: 5, desc: `"Sort Complete!`", speech: SORTING_SCRIPT.CYCLE"

Write-Host "Done with all sorting algoLine patches!"
