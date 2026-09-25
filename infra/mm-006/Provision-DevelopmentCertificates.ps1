param(
    [string]$DnsName = 'localhost'
)

$ErrorActionPreference = 'Stop'
$directory = Join-Path $PSScriptRoot 'dev-certificates'
if (Test-Path -LiteralPath $directory) {
    throw 'MM-006 development certificates already exist. Review and remove the specific dev-certificates directory before reprovisioning.'
}
New-Item -ItemType Directory -Path $directory | Out-Null

$ca = New-SelfSignedCertificate -Type Custom -Subject 'CN=MiniMart MM-006 Phase-0 Development CA' `
    -CertStoreLocation 'Cert:\CurrentUser\My' -KeyAlgorithm RSA -KeyLength 3072 `
    -KeyUsage CertSign, CRLSign -KeyExportPolicy NonExportable `
    -TextExtension @('2.5.29.19={critical}{text}ca=1&pathlength=0')

$server = New-SelfSignedCertificate -Type Custom -Subject "CN=$DnsName" -DnsName $DnsName `
    -Signer $ca -CertStoreLocation 'Cert:\CurrentUser\My' -KeyAlgorithm RSA -KeyLength 3072 `
    -KeyUsage DigitalSignature, KeyEncipherment -KeyExportPolicy Exportable `
    -TextExtension @('2.5.29.37={text}1.3.6.1.5.5.7.3.1')

$client = New-SelfSignedCertificate -Type Custom -Subject 'CN=MiniMart MM-006 Phase-0 POS' `
    -Signer $ca -CertStoreLocation 'Cert:\CurrentUser\My' -KeyAlgorithm RSA -KeyLength 3072 `
    -KeyUsage DigitalSignature -KeyExportPolicy NonExportable `
    -TextExtension @('2.5.29.37={text}1.3.6.1.5.5.7.3.2')

Export-Certificate -Cert $ca -FilePath (Join-Path $directory 'ca.cer') | Out-Null

$random = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
try { $rng.GetBytes($random) } finally { $rng.Dispose() }
$passwordText = [Convert]::ToBase64String($random)
$password = ConvertTo-SecureString $passwordText -AsPlainText -Force
Export-PfxCertificate -Cert $server -FilePath (Join-Path $directory 'server.pfx') -Password $password | Out-Null
$password | Export-Clixml -Path (Join-Path $directory 'server-pfx-password.clixml')

$sha = [System.Security.Cryptography.SHA256]::Create()
try { $fingerprintBytes = $sha.ComputeHash($client.RawData) } finally { $sha.Dispose() }
$fingerprint = [Convert]::ToHexString($fingerprintBytes) -replace '(..)(?!$)', '$1:'

$uuidBytes = New-Object byte[] 16
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
try { $rng.GetBytes($uuidBytes) } finally { $rng.Dispose() }
$time = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
for ($i = 5; $i -ge 0; $i--) {
    $uuidBytes[$i] = [byte]($time -band 255)
    $time = $time -shr 8
}
$uuidBytes[6] = [byte](0x70 -bor ($uuidBytes[6] -band 0x0f))
$uuidBytes[8] = [byte](0x80 -bor ($uuidBytes[8] -band 0x3f))
$hex = [Convert]::ToHexString($uuidBytes).ToLowerInvariant()
$counterId = '{0}-{1}-{2}-{3}-{4}' -f $hex.Substring(0,8),$hex.Substring(8,4),$hex.Substring(12,4),$hex.Substring(16,4),$hex.Substring(20,12)

$registry = @{ devices = @(@{ fingerprint256 = $fingerprint; counterId = $counterId; revoked = $false }) }
$registry | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $directory 'enrollments.json') -Encoding utf8
'MM-006' | Set-Content -LiteralPath (Join-Path $directory 'PHASE0_DEV_ONLY') -Encoding ascii

Write-Output "Development CA trusted in CurrentUser Root: $($ca.Thumbprint)"
Write-Output "Non-exportable POS certificate in CurrentUser My: $($client.Thumbprint)"
Write-Output "Server DNS name: $DnsName"
Write-Output "Ignored development material: $directory"
Import-Certificate -FilePath (Join-Path $directory 'ca.cer') -CertStoreLocation 'Cert:\CurrentUser\Root' | Out-Null
