# Windows Task Scheduler Setup for Government Land Data Pipeline
$Action = New-ScheduledTaskAction -Execute "python.exe" -Argument "c:\Users\HP\OneDrive\Desktop\26017\land-acquisition-predictor\backend\gov_api_pipeline\run_pipeline.py --run --count 4489" -WorkingDirectory "c:\Users\HP\OneDrive\Desktop\26017\land-acquisition-predictor\backend\gov_api_pipeline"
$Trigger = New-ScheduledTaskTrigger -Daily -At 02:00AM
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

Register-ScheduledTask -TaskName "GovLandDataPipelineSync" -Action $Action -Trigger $Trigger -Settings $Settings -Description "Automated daily fetch of new Indian government land acquisition and infrastructure projects into SQLite database." -Force

Write-Host "========================================================================="
Write-Host "SUCCESS: Windows Scheduled Task 'GovLandDataPipelineSync' registered!"
Write-Host "The pipeline will automatically run daily at 02:00 AM in the background."
Write-Host "========================================================================="
