Add-Type -AssemblyName System.Drawing

$logoPath = "c:\Users\ASPIRE 3\Desktop\auto pro\public\logo.png"
$img = [System.Drawing.Image]::FromFile($logoPath)

$resDir = "c:\Users\ASPIRE 3\Desktop\auto pro\android\app\src\main\res"

$folders = @(
    @{ Name = "mipmap-mdpi"; Size = 48 },
    @{ Name = "mipmap-hdpi"; Size = 72 },
    @{ Name = "mipmap-xhdpi"; Size = 96 },
    @{ Name = "mipmap-xxhdpi"; Size = 144 },
    @{ Name = "mipmap-xxxhdpi"; Size = 192 }
)

foreach ($item in $folders) {
    $folder = $item.Name
    $size = $item.Size
    $destDir = Join-Path $resDir $folder

    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }

    # ic_launcher.png
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.Clear([System.Drawing.Color]::White)
    $g.DrawImage($img, 0, 0, $size, $size)
    $g.Dispose()
    $bmp.Save((Join-Path $destDir "ic_launcher.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()

    # ic_launcher_round.png
    $bmp2 = New-Object System.Drawing.Bitmap($size, $size)
    $g2 = [System.Drawing.Graphics]::FromImage($bmp2)
    $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g2.Clear([System.Drawing.Color]::White)
    $g2.DrawImage($img, 0, 0, $size, $size)
    $g2.Dispose()
    $bmp2.Save((Join-Path $destDir "ic_launcher_round.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp2.Dispose()

    # ic_launcher_foreground.png (with padding for adaptive icon)
    $padding = [int]($size * 0.18)
    $bmpFg = New-Object System.Drawing.Bitmap($size, $size)
    $gFg = [System.Drawing.Graphics]::FromImage($bmpFg)
    $gFg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gFg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gFg.Clear([System.Drawing.Color]::White)
    $innerSize = $size - (2 * $padding)
    $gFg.DrawImage($img, $padding, $padding, $innerSize, $innerSize)
    $gFg.Dispose()
    $bmpFg.Save((Join-Path $destDir "ic_launcher_foreground.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpFg.Dispose()

    Write-Host "Done: $folder - ${size}px"
}

$img.Dispose()
Write-Host "All icons generated successfully!"
