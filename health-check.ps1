Write-Host "AI SMART CROSSWALK - SYSTEM TEST" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$results = @()

# Test AI Service
try {
    Invoke-WebRequest -Uri "http://localhost:5001/health" -UseBasicParsing -TimeoutSec 2 | Out-Null
    Write-Host "[PASS] AI Service (5001)" -ForegroundColor Green
    $results += "PASS"
} catch {
    Write-Host "[FAIL] AI Service (5001)" -ForegroundColor Red
    $results += "FAIL"
}

# Test Alert Service
try {
    Invoke-WebRequest -Uri "http://localhost:5002/health" -UseBasicParsing -TimeoutSec 2 | Out-Null
    Write-Host "[PASS] Alert Service (5002)" -ForegroundColor Green
    $results += "PASS"
} catch {
    Write-Host "[FAIL] Alert Service (5002)" -ForegroundColor Red
    $results += "FAIL"
}

# Test Crosswalk Service
try {
    Invoke-WebRequest -Uri "http://localhost:5003/health" -UseBasicParsing -TimeoutSec 2 | Out-Null
    Write-Host "[PASS] Crosswalk Service (5003)" -ForegroundColor Green
    $results += "PASS"
} catch {
    Write-Host "[FAIL] Crosswalk Service (5003)" -ForegroundColor Red
    $results += "FAIL"
}

# Test API Gateway
try {
    Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 2 | Out-Null
    Write-Host "[PASS] API Gateway (8000)" -ForegroundColor Green
    $results += "PASS"
} catch {
    Write-Host "[FAIL] API Gateway (8000)" -ForegroundColor Red
    $results += "FAIL"
}

# Test Frontend
try {
    Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2 | Out-Null
    Write-Host "[PASS] Frontend (3000)" -ForegroundColor Green
    $results += "PASS"
} catch {
    Write-Host "[FAIL] Frontend (3000)" -ForegroundColor Red
    $results += "FAIL"
}

# Test Gateway Routes
try {
    $r = Invoke-WebRequest -Uri "http://localhost:8000/api/crosswalks" -UseBasicParsing -TimeoutSec 2
    $data = $r.Content | ConvertFrom-Json
    Write-Host "[PASS] Gateway /api/crosswalks ($($data.count) items)" -ForegroundColor Green
    $results += "PASS"
} catch {
    Write-Host "[FAIL] Gateway /api/crosswalks" -ForegroundColor Red
    $results += "FAIL"
}

try {
    $r = Invoke-WebRequest -Uri "http://localhost:8000/api/alerts" -UseBasicParsing -TimeoutSec 2
    $data = $r.Content | ConvertFrom-Json
    Write-Host "[PASS] Gateway /api/alerts ($($data.count) items)" -ForegroundColor Green
    $results += "PASS"
} catch {
    Write-Host "[FAIL] Gateway /api/alerts" -ForegroundColor Red
    $results += "FAIL"
}

# MongoDB Connections
$mongoConns = (Get-NetTCPConnection -State Established -ErrorAction SilentlyContinue | Where-Object {$_.RemotePort -eq 27017} | Measure-Object).Count
Write-Host "[INFO] MongoDB Connections: $mongoConns" -ForegroundColor Cyan

# Node Processes
$nodeProcs = (Get-Process node -ErrorAction SilentlyContinue | Measure-Object).Count
Write-Host "[INFO] Node Processes: $nodeProcs" -ForegroundColor Cyan

# Summary
Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
$total = $results.Count
$passed = ($results | Where-Object {$_ -eq "PASS"}).Count
$failed = $total - $passed
$rate = [math]::Round(($passed/$total)*100, 1)

Write-Host "Total Tests: $total" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor $(if($failed -eq 0){'Green'}else{'Red'})
Write-Host "Success Rate: $rate%" -ForegroundColor $(if($rate -eq 100){'Green'}else{'Yellow'})
Write-Host "=================================" -ForegroundColor Cyan
