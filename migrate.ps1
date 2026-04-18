$ErrorActionPreference = "Stop"
cd "d:\VScode\AI\BTN\BattleShipBTL-"

New-Item -ItemType Directory -Path "css", "js\core", "js\ai", "js\controllers", "pages" -Force

Move-Item -Path "trang-chu\index.html" -Destination "pages\home.html" -Force
Move-Item -Path "trang-chu\instructions.html" -Destination "pages\instructions.html" -Force
Move-Item -Path "trang-dat-thuyen\index.html" -Destination "pages\deployment.html" -Force
Move-Item -Path "trang-combat\index.html" -Destination "pages\combat.html" -Force
Move-Item -Path "trang-chien-thang\index.html" -Destination "pages\victory.html" -Force

Set-Content -Path "index.html" -Value '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=pages/home.html"></head><body></body></html>'

Move-Item -Path "styles\base.css" -Destination "css\main.css" -Force
Move-Item -Path "trang-chu\style.css" -Destination "css\home.css" -Force
Move-Item -Path "trang-chu\instructions.css" -Destination "css\instructions.css" -Force
Move-Item -Path "trang-dat-thuyen\style.css" -Destination "css\deployment.css" -Force
Move-Item -Path "trang-combat\style.css" -Destination "css\combat.css" -Force
Move-Item -Path "trang-chien-thang\style.css" -Destination "css\victory.css" -Force

Move-Item -Path "trang-chu\script.js" -Destination "js\controllers\HomeController.js" -Force
Move-Item -Path "trang-dat-thuyen\script.js" -Destination "js\controllers\DeploymentController.js" -Force
Move-Item -Path "trang-combat\script.js" -Destination "js\controllers\CombatController.js" -Force
Move-Item -Path "trang-chien-thang\script.js" -Destination "js\controllers\VictoryController.js" -Force

Move-Item -Path "logic\may-choi.js" -Destination "js\ai\AIController.js" -Force
Move-Item -Path "logic\ai-easy.js" -Destination "js\ai\EasyAI.js" -Force
Move-Item -Path "logic\ai-medium.js" -Destination "js\ai\MediumAI.js" -Force
Move-Item -Path "logic\ai-hard.js" -Destination "js\ai\HardAI.js" -Force

Move-Item -Path "logic\nguoi-choi.js" -Destination "js\player.js" -Force

Remove-Item "styles" -Recurse -Force
Remove-Item "trang-chu" -Recurse -Force
Remove-Item "trang-dat-thuyen" -Recurse -Force
Remove-Item "trang-combat" -Recurse -Force
Remove-Item "trang-chien-thang" -Recurse -Force
