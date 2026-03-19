# Python System Runner
Write-Host "--- INITIALIZING SMART PEDESTRIAN SYSTEM ---" -ForegroundColor Cyan
Write-Host "Checking dependencies..." -ForegroundColor Gray
pip install -r requirements.txt
Write-Host "Launching AI Core..." -ForegroundColor Green
python main.py
