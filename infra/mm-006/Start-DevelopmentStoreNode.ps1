param(
    [Parameter(Mandatory = $true)] [string]$DatabaseUrl,
    [string]$BindHost = '127.0.0.1'
)

$ErrorActionPreference = 'Stop'
$directory = Join-Path $PSScriptRoot 'dev-certificates'
$secret = Import-Clixml -LiteralPath (Join-Path $directory 'server-pfx-password.clixml')
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
try {
    $env:MINIMART_MM006_DEV_PFX_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
}
$env:MINIMART_MM006_ENABLE_DEV_TLS = '1'
$env:MINIMART_MM006_DEV_CERT_DIR = $directory
$env:MINIMART_SYSTEM_BIND_HOST = $BindHost
$env:DATABASE_URL = $DatabaseUrl
try {
    pnpm --filter '@minimart/store-node' start
} finally {
    Remove-Item Env:MINIMART_MM006_DEV_PFX_PASSWORD,Env:MINIMART_MM006_ENABLE_DEV_TLS,Env:MINIMART_MM006_DEV_CERT_DIR,Env:MINIMART_SYSTEM_BIND_HOST,Env:DATABASE_URL -ErrorAction SilentlyContinue
}
