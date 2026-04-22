$dir = Split-Path -Parent $MyInvocation.MyCommand.Path

$htmlFiles = Get-ChildItem -Path $dir -Filter "*.html" | Where-Object { $_.Name -ne "index.html" }

$addedCount   = 0
$skippedCount = 0

foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)

    if ($content -notmatch 'algorithm_data\.js') {
        $skippedCount++
        continue
    }

    if ($content -match 'chatbot\.js') {
        Write-Host "  [SKIP]    $($file.Name)" -ForegroundColor DarkGray
        $skippedCount++
        continue
    }

    $injection = '    <script src="chatbot.js"></script>'
    $needle    = '<script src="algorithm_data.js"></script>'
    $replaced  = $content.Replace($needle, $needle + "`r`n" + $injection)

    if ($replaced -eq $content) {
        # Try before </head> as fallback
        $replaced = $content.Replace('</head>', $injection + "`r`n</head>")
    }

    if ($replaced -ne $content) {
        [System.IO.File]::WriteAllText($file.FullName, $replaced, [System.Text.Encoding]::UTF8)
        Write-Host "  [PATCHED] $($file.Name)" -ForegroundColor Green
        $addedCount++
    } else {
        Write-Host "  [WARN]    $($file.Name) - could not inject" -ForegroundColor Yellow
        $skippedCount++
    }
}

Write-Host ""
Write-Host ("Done!  Patched: " + $addedCount + "  |  Skipped: " + $skippedCount) -ForegroundColor Cyan
