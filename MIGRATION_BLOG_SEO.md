# Migración: Blog + SEO — Backend

## Cambios realizados

### 1. Schema Prisma (`prisma/schema.prisma`)

#### Nueva tabla `SeoMetadata` (SEO global reutilizable)

```prisma
model SeoMetadata {
  id          Int      @id @default(autoincrement())
  entityType  String   @db.VarChar(50)   // 'page', 'blog_post', etc.
  entityId    String   @db.VarChar(100)  // '/', '/blog/slug', etc.
  
  // Meta tags básicos
  metaTitle   String?  @db.VarChar(60)
  metaDesc    String?  @db.VarChar(160)
  keywords    String?  @db.VarChar(200)
  
  // Open Graph
  ogTitle     String?  @db.VarChar(60)
  ogDesc      String?  @db.VarChar(160)
  ogImage     String?  @db.VarChar(500)
  
  // Twitter Cards
  twitterCard String?  @db.VarChar(20)
  
  // Técnico
  canonicalUrl String?  @db.VarChar(500)
  noIndex      Boolean  @default(false)
  noFollow     Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([entityType, entityId])
  @@index([entityType])
}
```

**Uso:**
- SEO de página estática: `entityType: 'page'`, `entityId: '/'`
- SEO de artículo de blog: `entityType: 'blog_post'`, `entityId: 'agua-viva-en-yucatan'`

#### Campos nuevos en `BlogPost`

```prisma
// Cover: imagen tradicional O ícono flat
coverColor    String?  @db.VarChar(7)    // '#0b3a5e'
coverIcon     String?  @db.VarChar(20)   // 'droplet', 'snow', 'gauge', 'flask'

// Organización
category      String?  @db.VarChar(50)   // 'Agua', 'Equipo', 'Mantenimiento'
authorName    String?  @db.VarChar(100)  // 'Jorge Méndez'
authorInitials String? @db.VarChar(5)    // 'JM'

// Stats
views         Int      @default(0)
readMin       Int?                       // calculado automáticamente
```

### 2. Nuevos archivos backend

#### DTOs
- `src/seo/dto/seo-metadata.dto.ts` — Validación para SEO

#### Módulo SEO
- `src/seo/seo.module.ts`
- `src/seo/seo.service.ts`
- `src/seo/seo.controller.ts`

#### Endpoints SEO
```
GET    /seo/:entityType/:entityId    # Obtener SEO de una entidad
GET    /seo/:entityType               # Listar SEO de un tipo
PUT    /seo                           # Crear o actualizar SEO
DELETE /seo/:entityType/:entityId    # Eliminar SEO
```

### 3. Cambios en BlogService

- **Cálculo automático de `readMin`:** Al guardar un post, se cuentan las palabras totales (título + extracto + bloques) y se divide entre 200.
- **Nuevos campos en DTO:** `coverColor`, `coverIcon`, `category`, `authorName`, `authorInitials`
- **Nuevos tipos de bloques:** `quote`, `callout`

---

## Pasos para aplicar la migración

### 1. Sincronizar schema con la base de datos ✅ COMPLETADO

Desde `backend/`:

```powershell
npx prisma db push
```

**Estado:** ✅ Migración aplicada correctamente a `purifreze_admin_cms` en `mysql.apicultoresunidos.com:3306`

**Nota:** Esto crea las columnas nuevas en MySQL sin generar archivos de migración. Dado que DreamHost no soporta shadow database, usamos `db push` en desarrollo.

### 2. Verificar que Prisma generó los tipos nuevos ✅ COMPLETADO

```powershell
npx prisma generate
```

**Estado:** ✅ Cliente Prisma generado con tipos actualizados (v7.8.0)

### 3. Compilar backend ✅ COMPLETADO

```powershell
npm run build
```

**Estado:** ✅ Compilación exitosa sin errores TypeScript

### 4. Validar endpoints (OPCIONAL)

Opción A - Script automatizado:
```powershell
.\validate-backend.ps1
```

Opción B - Tests manuales con REST Client:
- Abrir `test-seo-blog.http` en VS Code
- Ejecutar requests uno por uno

### 4. Probar endpoints nuevos

#### Crear SEO para la home
```bash
curl -X PUT http://localhost:3000/seo \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "page",
    "entityId": "/",
    "metaTitle": "Purifreze — Agua purificada sin garrafones",
    "metaDesc": "Sistema de purificación de agua en casa. Sin cargar garrafones, sin químicos. Mantenimiento incluido.",
    "ogImage": "/assets/og-home.jpg"
  }'
```

#### Obtener SEO de la home
```bash
curl http://localhost:3000/seo/page/%2F
```
*(Nota: `%2F` es `/` encoded)*

#### Crear artículo de blog con campos nuevos
```bash
curl -X POST http://localhost:3000/blog \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Agua Viva en Yucatán",
    "excerpt": "5 razones para dejar de consumir agua muerta",
    "coverColor": "#3a2e6e",
    "coverIcon": "flask",
    "category": "Agua",
    "authorName": "Renata Cámara",
    "authorInitials": "RC",
    "blocks": [
      {
        "id": "1",
        "type": "paragraph",
        "data": { "text": "La desinfección cuántica..." }
      }
    ]
  }'
```

---

## Próximos pasos

### Frontend Angular (Admin)
1. Actualizar modelo TypeScript en `admin/src/app/core/models/blog.ts`
2. Agregar campos al formulario del editor
3. Crear sección "SEO de páginas" en el admin

### Frontend Astro (Landing pública)
1. Actualizar `fetchBlogPost()` para incluir campos nuevos
2. Agregar meta tags dinámicos en `[slug].astro`
3. Renderizar cover con ícono si no hay imagen
4. Crear helper para fetch de SEO: `fetchSeo(entityType, entityId)`

---

## Rollback (si algo sale mal)

Si necesitás revertir:

```sql
-- Eliminar tabla SeoMetadata
DROP TABLE IF EXISTS SeoMetadata;

-- Eliminar columnas de BlogPost
ALTER TABLE BlogPost 
  DROP COLUMN coverColor,
  DROP COLUMN coverIcon,
  DROP COLUMN category,
  DROP COLUMN authorName,
  DROP COLUMN authorInitials,
  DROP COLUMN views,
  DROP COLUMN readMin;
```

Luego revertir el `schema.prisma` con git y ejecutar `npx prisma db push`.
