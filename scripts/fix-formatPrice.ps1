# scripts/fix-formatPrice.ps1
# Compatibile Windows PowerShell 5.1

$files = Get-ChildItem -Recurse -Path . -Filter *.tsx

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)

    if ($content -notmatch "formatPrice") {
        if ($content -match "price") {

            $newContent = "import { formatPrice } from '@/lib/utils';`r`n" + $content
            [System.IO.File]::WriteAllText($file.FullName, $newContent)

            Write-Host "Fix applicato a $($file.FullName)"
        }
    }
}

Write-Host "OK - Tutti i file sistemati"