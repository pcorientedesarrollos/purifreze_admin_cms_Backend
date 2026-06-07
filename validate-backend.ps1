# Script de validación del backend Purifreze
# Verifica que la migración y los endpoints funcionen correctamente

$baseUrl = "http://localhost:3000"
$success = $true

Write-Host "`n=== Validación Backend: SEO + Blog ===" -ForegroundColor Cyan
Write-Host "Base URL: $baseUrl`n" -ForegroundColor Gray

# Verificar que el servidor esté corriendo
Write-Host "[1/5] Verificando servidor..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ Servidor corriendo" -ForegroundColor Green
} catch {
    Write-Host "✗ Servidor no responde. Ejecuta 'npm run start:dev' primero." -ForegroundColor Red
    exit 1
}

# Test 1: Crear SEO para home
Write-Host "`n[2/5] Creando SEO para home..." -ForegroundColor Yellow
$seoData = @{
    entityType = "page"
    entityId = "/"
    metaTitle = "Purifreze Test"
    metaDesc = "Test description"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/seo" -Method PUT -Body $seoData -ContentType "application/json"
    if ($response.id -and $response.metaTitle -eq "Purifreze Test") {
        Write-Host "✓ SEO creado correctamente (id: $($response.id))" -ForegroundColor Green
    } else {
        Write-Host "✗ Respuesta inesperada del servidor" -ForegroundColor Red
        $success = $false
    }
} catch {
    Write-Host "✗ Error al crear SEO: $($_.Exception.Message)" -ForegroundColor Red
    $success = $false
}

# Test 2: Obtener SEO
Write-Host "`n[3/5] Obteniendo SEO de home..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/seo/page/%2F" -Method GET
    if ($response.metaTitle -eq "Purifreze Test") {
        Write-Host "✓ SEO recuperado correctamente" -ForegroundColor Green
    } else {
        Write-Host "✗ SEO no coincide" -ForegroundColor Red
        $success = $false
    }
} catch {
    Write-Host "✗ Error al obtener SEO: $($_.Exception.Message)" -ForegroundColor Red
    $success = $false
}

# Test 3: Crear blog post con campos nuevos
Write-Host "`n[4/5] Creando post de blog con campos extendidos..." -ForegroundColor Yellow
$blogData = @{
    title = "Test Post Backend"
    excerpt = "Este es un post de prueba para validar los campos nuevos."
    coverColor = "#3a2e6e"
    coverIcon = "flask"
    category = "Agua"
    authorName = "Test Author"
    authorInitials = "TA"
    blocks = @(
        @{
            id = "1"
            type = "paragraph"
            data = @{ text = "Contenido de prueba con aproximadamente cincuenta palabras para verificar que el cálculo de tiempo de lectura funcione correctamente y se almacene en la base de datos de forma automática cuando se crea el post." }
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/blog" -Method POST -Body $blogData -ContentType "application/json"
    if ($response.id -and $response.coverColor -eq "#3a2e6e" -and $response.readMin) {
        Write-Host "✓ Post creado (id: $($response.id), readMin: $($response.readMin) min)" -ForegroundColor Green
        $postId = $response.id
    } else {
        Write-Host "✗ Campos nuevos no presentes en respuesta" -ForegroundColor Red
        $success = $false
    }
} catch {
    Write-Host "✗ Error al crear post: $($_.Exception.Message)" -ForegroundColor Red
    $success = $false
}

# Test 4: Limpiar datos de prueba
Write-Host "`n[5/5] Limpiando datos de prueba..." -ForegroundColor Yellow
try {
    # Eliminar SEO
    Invoke-RestMethod -Uri "$baseUrl/seo/page/%2F" -Method DELETE -ErrorAction SilentlyContinue | Out-Null
    
    # Eliminar post (si se creó)
    if ($postId) {
        Invoke-RestMethod -Uri "$baseUrl/blog/$postId" -Method DELETE -ErrorAction SilentlyContinue | Out-Null
    }
    
    Write-Host "✓ Limpieza completada" -ForegroundColor Green
} catch {
    Write-Host "⚠ Error en limpieza (no crítico)" -ForegroundColor Yellow
}

# Resultado final
Write-Host "`n=== Resultado ===" -ForegroundColor Cyan
if ($success) {
    Write-Host "✓ Todos los tests pasaron correctamente" -ForegroundColor Green
    Write-Host "`nEl backend está listo para usar. Siguiente paso:" -ForegroundColor Gray
    Write-Host "  - Probar endpoints manualmente con test-seo-blog.http" -ForegroundColor Gray
    Write-Host "  - O continuar con integración en Astro/Angular`n" -ForegroundColor Gray
    exit 0
} else {
    Write-Host "✗ Algunos tests fallaron. Revisa los errores arriba." -ForegroundColor Red
    exit 1
}
