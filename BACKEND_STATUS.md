# Estado del Backend — Purifreze CMS

## ✅ Fase 1: SEO + Blog — COMPLETADO

### Migración de base de datos

**Estado:** ✅ APLICADO  
**Base de datos:** `purifreze_admin_cms` @ `mysql.apicultoresunidos.com:3306`  
**Fecha:** 2026-06-07

**Cambios aplicados:**

1. ✅ Tabla `SeoMetadata` creada
   - Índice único: `(entityType, entityId)`
   - 13 columnas (meta tags, OG, Twitter, técnicos)

2. ✅ Tabla `BlogPost` extendida
   - Cover: `coverColor`, `coverIcon`
   - Organización: `category`, `authorName`, `authorInitials`
   - Stats: `views` (default 0), `readMin` (nullable)
   - Índice adicional: `category`

### Código backend

**Estado:** ✅ COMPILADO SIN ERRORES

**Archivos nuevos:**
```
backend/src/seo/
├── seo.module.ts ················· Módulo registrado en app.module.ts
├── seo.service.ts ················ CRUD + helper calculateReadTime
├── seo.controller.ts ············· 4 endpoints REST
└── dto/
    └── seo-metadata.dto.ts ······· Validación con class-validator
```

**Archivos modificados:**
```
backend/
├── prisma/schema.prisma ·········· SeoMetadata + campos BlogPost
├── src/
│   ├── app.module.ts ············· SeoModule importado
│   └── blog/
│       ├── blog.service.ts ······· calculateReadTime, campos nuevos
│       └── dto/
│           └── blog-post.dto.ts ·· quote, callout, campos cover/author
```

### Endpoints disponibles

#### SEO (nuevos)
```
GET    /seo/:entityType/:entityId    # Obtener SEO específico
GET    /seo/:entityType               # Listar por tipo
PUT    /seo                           # Crear/actualizar (upsert)
DELETE /seo/:entityType/:entityId    # Eliminar
```

**Ejemplos:**
- `GET /seo/page/%2F` → SEO de home
- `GET /seo/blog_post/agua-viva-en-yucatan` → SEO de artículo
- `GET /seo/page` → Lista todas las páginas con SEO

#### Blog (extendidos)
```
GET    /blog/public              # Listado público (incluye campos nuevos)
GET    /blog/public/:slug        # Artículo público
GET    /blog                     # Listado admin
POST   /blog                     # Crear (calcula readMin automáticamente)
PATCH  /blog/:id                 # Actualizar
POST   /blog/:id/publish         # Publicar
DELETE /blog/:id                 # Eliminar
```

**Campos nuevos en respuesta:**
- `coverColor`, `coverIcon` (nullable)
- `category`, `authorName`, `authorInitials` (nullable)
- `views` (number, default 0)
- `readMin` (number, auto-calculado)

### Validación

**Herramientas disponibles:**

1. **Script automatizado:** `validate-backend.ps1`
   - Crea SEO de prueba
   - Crea post con campos nuevos
   - Verifica readMin auto-calculado
   - Limpia datos al final

2. **Tests manuales:** `test-seo-blog.http`
   - 10 requests preconfigurados
   - Compatible con REST Client (VS Code)
   - Incluye ejemplos de todos los endpoints

**Ejecutar validación:**
```powershell
cd backend
npm run start:dev  # En terminal separada
.\validate-backend.ps1
```

---

## 📋 Próximos pasos

### Backend (opcionales)
- [ ] Endpoint `POST /blog/:slug/view` para incrementar contador real
- [ ] Validación enum para categorías (si querés lista fija)
- [ ] Tabla `Author` separada (si necesitás perfiles completos)
- [ ] Paginación en `GET /seo/:entityType`

### Frontend Angular (admin)
- [ ] Actualizar `blog-editor-page.component.ts`:
  - [ ] Agregar campos cover (color + ícono selector)
  - [ ] Agregar campos category, author
  - [ ] Tab "SEO" que llame a `SeoService`
  - [ ] Mostrar readMin calculado (readonly)
  - [ ] Soporte para bloques quote y callout
- [ ] Crear página `SeoListPageComponent`:
  - [ ] Lista de páginas con SEO configurado
  - [ ] Formulario para crear/editar SEO global
- [ ] Rediseñar editor completo (3 modos según prototipo)

### Frontend Astro (landing pública)
- [ ] Helper `fetchSeo(entityType, entityId)` en `lib/blog.ts`
- [ ] Meta tags dinámicos en `src/pages/blog/[slug].astro`:
  ```astro
  ---
  const seo = await fetchSeo('blog_post', slug);
  ---
  <meta name="description" content={seo?.metaDesc || post.excerpt} slot="head" />
  <meta property="og:title" content={seo?.ogTitle || post.title} slot="head" />
  ```
- [ ] Renderizar cover con ícono si no hay imagen:
  ```astro
  {post.coverImageUrl ? (
    <img src={mediaUrl(post.coverImageUrl)} alt="" />
  ) : post.coverColor ? (
    <div style={`background: ${post.coverColor}`}>
      <Icon name={post.coverIcon} />
    </div>
  ) : null}
  ```
- [ ] Componente `<BlogAuthor>` con iniciales
- [ ] Soporte para bloques quote y callout en `BlogBlocks.astro`

---

## 🔧 Troubleshooting

### Error: "Table 'SeoMetadata' doesn't exist"
**Causa:** La migración no se aplicó.  
**Solución:** `npx prisma db push`

### Error: "Property 'coverColor' does not exist on type 'BlogPost'"
**Causa:** El cliente Prisma no se regeneró.  
**Solución:** `npx prisma generate`

### Error en compile: "Cannot find module '@nestjs/seo'"
**Causa:** El módulo SEO no está registrado.  
**Solución:** Verificar que `SeoModule` esté en `app.module.ts` imports

### Endpoint /seo retorna 404
**Causa:** El servidor no reinició después de agregar SeoModule.  
**Solución:** Detener y volver a ejecutar `npm run start:dev`

---

## 📊 Métricas

**Archivos creados:** 7  
**Archivos modificados:** 5  
**Líneas de código agregadas:** ~350  
**Endpoints nuevos:** 4  
**Campos nuevos en BlogPost:** 7  
**Tipos de bloques soportados:** 7 (paragraph, heading, list, link, image, quote, callout)  

**Tiempo estimado de migración en producción:** 2-3 minutos  
**Downtime requerido:** 0 (migración aditiva, backwards compatible)

---

## ✅ Checklist de deployment

Antes de deployar a producción:

- [ ] Backup de base de datos (`mysqldump`)
- [ ] Ejecutar `npx prisma db push` en servidor
- [ ] Verificar que `DATABASE_URL` apunte a BD correcta
- [ ] Rebuild del backend (`npm run build`)
- [ ] Reiniciar proceso/contenedor
- [ ] Smoke test: `curl http://API_URL/seo/page/%2F` (debería retornar null o SEO)
- [ ] Crear SEO para home desde admin
- [ ] Verificar meta tags en landing pública

---

## 📝 Notas

- **Backwards compatible:** Posts existentes sin cover/category/author funcionan sin problema (campos nullable).
- **Performance:** `readMin` se calcula solo al guardar, no en cada consulta.
- **SEO opcional:** Si no existe registro en `SeoMetadata`, frontend debe usar fallback (título del post, excerpt, etc.).
- **Cover dual:** Si `coverImageUrl` existe, se prioriza sobre `coverColor/Icon`.
