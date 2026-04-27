# Migrar repo Kindle Portugal para fora do OneDrive
#
# Porque?
#   O OneDrive sincroniza ficheiros do .git e isso bloqueia o git
#   constantemente (.git/index.lock fica preso, CRLF/LF a oscilar a cada
#   commit, perda ocasional de objetos do git). Mover o repo para uma
#   pasta normal (fora do OneDrive) elimina todos estes problemas.
#
# O que este script faz:
#   1. Faz commit de todas as alterações pendentes (segurança).
#   2. Faz push para o GitHub.
#   3. Faz git clone limpo para C:\dev\kindle-portugal.
#   4. Copia o ficheiro .env (se existir) e configurações locais.
#   5. Reinstala dependencias.
#   6. Mostra um resumo e os próximos passos.
#
# Como correr:
#   1. Abre PowerShell normal (não Administrador).
#   2. Cola este bloco:
#        cd "$env:USERPROFILE\OneDrive\Claude\site kindleportugal"
#        powershell -ExecutionPolicy Bypass -File .\scripts\migrar-para-fora-onedrive.ps1
#
# Depois disto:
#   - Trabalha SEMPRE em C:\dev\kindle-portugal a partir de agora.
#   - A pasta antiga em OneDrive pode ficar como backup (renomeia
#     para "site kindleportugal.OLD") ou apaga depois de confirmares.

$ErrorActionPreference = 'Stop'

$origem = "$env:USERPROFILE\OneDrive\Claude\site kindleportugal"
$destino = "C:\dev\kindle-portugal"

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Migracao Kindle Portugal: OneDrive -> C:\dev"     -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Origem : $origem"
Write-Host "Destino: $destino"
Write-Host ""

# 1. Verificar que estamos na origem
if (-not (Test-Path "$origem\.git")) {
  Write-Host "ERRO: Nao encontrei .git em $origem" -ForegroundColor Red
  exit 1
}
Set-Location $origem

# 2. Limpar lock pendente (problema OneDrive)
Remove-Item "$origem\.git\index.lock" -Force -ErrorAction SilentlyContinue

# 3. Garantir que esta tudo comitado e pushed
Write-Host "[1/5] A verificar estado do git..." -ForegroundColor Yellow
$status = git status --short
if ($status) {
  Write-Host "Tens alteracoes nao comitadas:" -ForegroundColor Yellow
  Write-Host $status
  $resp = Read-Host "Queres comitar tudo agora antes de migrar? (s/n)"
  if ($resp -eq 's') {
    git add .
    git commit -m "chore: snapshot antes da migracao para fora do OneDrive"
  } else {
    Write-Host "ABORTADO. Comita ou descarta as alteracoes primeiro." -ForegroundColor Red
    exit 1
  }
}

Write-Host "[2/5] A fazer push para GitHub..." -ForegroundColor Yellow
git push

# 4. Verificar se o destino ja existe
if (Test-Path $destino) {
  Write-Host ""
  Write-Host "ATENCAO: $destino ja existe." -ForegroundColor Yellow
  $resp = Read-Host "Apagar e refazer? (s/n)"
  if ($resp -ne 's') {
    Write-Host "ABORTADO." -ForegroundColor Red
    exit 1
  }
  Remove-Item $destino -Recurse -Force
}

# 5. Criar C:\dev se nao existir
if (-not (Test-Path "C:\dev")) {
  New-Item -Path "C:\dev" -ItemType Directory | Out-Null
}

# 6. Clonar do GitHub para o novo destino
Write-Host "[3/5] A clonar repo de GitHub para $destino..." -ForegroundColor Yellow
$origemRemota = (git -C $origem config --get remote.origin.url).Trim()
git clone $origemRemota $destino

# 7. Copiar .env (NAO esta no git, e privado)
Set-Location $destino
if (Test-Path "$origem\.env") {
  Write-Host "[4/5] A copiar .env (chaves privadas)..." -ForegroundColor Yellow
  Copy-Item "$origem\.env" "$destino\.env"
}
if (Test-Path "$origem\.env.local") {
  Copy-Item "$origem\.env.local" "$destino\.env.local"
}

# 8. Instalar dependencias
Write-Host "[5/5] A instalar dependencias com npm..." -ForegroundColor Yellow
npm install

# 9. Configurar core.autocrlf para evitar futuro ruido de CRLF
git config core.autocrlf false
git config core.eol lf

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host " MIGRACAO CONCLUIDA"                                 -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos passos:"
Write-Host "  1. Trabalha em: $destino" -ForegroundColor Cyan
Write-Host "  2. Verifica que o site corre: cd '$destino'; npm run dev"
Write-Host "  3. Quando confirmares que esta tudo bem, podes renomear"
Write-Host "     a pasta antiga: '$origem' -> '$origem.OLD'"
Write-Host "     (mantem como backup uns dias antes de apagar)"
Write-Host "  4. Excluir '$origem' do OneDrive nas Definicoes do OneDrive"
Write-Host "     (clica direito na pasta -> Definicoes do OneDrive ->"
Write-Host "      Sincronizacao -> Escolher pastas -> desmarca site kindleportugal)"
Write-Host ""
Write-Host "A partir de agora, os comandos git correm sem locks!" -ForegroundColor Green
Write-Host ""
