 Tu idea base es correcta. Vamos a construir el mapa empezando por una pregunta:

  Cuando presionas Guardar en el admin, ¿qué crees que ocurre primero?

  No llega directamente a Prisma ni a la base de datos. Antes recorre varias capas:

  Admin Angular
    -> solicitud HTTP
    -> Controller
    -> DTO + ValidationPipe
    -> Service
    -> Prisma
    -> MySQL

  ## 1. El inicio: Angular

  En src/app/sections/section-editor-page.component.ts, el método save() reúne los campos editables y llama:

  this.api.update(draft.key, {
    label: draft.label,
    title: draft.title,
    description: draft.description,
    content,
    sortOrder: draft.sortOrder,
    isVisible: draft.isVisible,
  });

  Pregunta: ¿quién es this.api?

  Es src/app/core/services/content-sections.service.ts, un servicio de Angular. Su función es comunicarse con el backend:

  update(key: string, section: UpdateSection) {
    return this.http.patch(`${this.endpoint}/${key}`, section);
  }

  Si key === "comparison", se envía:

  PATCH http://localhost:3000/content-sections/comparison

  ## 2. La puerta de entrada: Controller

  ¿Cómo sabe Nest qué código debe ejecutar para esa URL?

  En C:/Users/Desarrollos/pablo/purifreze_landinpage/backend/src/content-sections/content-sections.controller.ts:

  @Controller('content-sections')
  export class ContentSectionsController {
    @Patch(':key')
    update(
      @Param('key') key: string,
      @Body() dto: UpdateContentSectionDto,
    ) {
      return this.contentSectionsService.update(key, dto);
    }
  }

  Compón la ruta:

  @Controller('content-sections') + @Patch(':key')
  = PATCH /content-sections/:key

  La URL tiene dos fuentes de información:

  PATCH /content-sections/comparison
                           └── @Param('key')

  Body JSON
  └── @Body()

  Pregunta clave: ¿qué diferencia ves entre key y el contenido editable?

  key viaja en la URL para identificar qué sección modificar. Los cambios viajan en el body.

  ## 3. El DTO: el filtro de seguridad

  DTO significa Data Transfer Object: objeto de transferencia de datos.

  No representa necesariamente una tabla completa. Define qué datos permites cruzar por una operación concreta.

  En C:/Users/Desarrollos/pablo/purifreze_landinpage/backend/src/content-sections/dto/update-content-section.dto.ts:

  export class UpdateContentSectionDto {
    @IsOptional()
    @IsString()
    @MaxLength(120)
    label?: string;

    @IsOptional()
    @IsBoolean()
    isVisible?: boolean;
  }

  El archivo real incluye más campos, pero observa la idea:

  ¿Puede enviarse label?       Sí.
  ¿Puede enviarse isVisible?   Sí.
  ¿Puede enviarse id?          No.
  ¿Puede enviarse updatedAt?   No.

  Pregunta: ¿por qué conviene prohibir que el frontend envíe id o updatedAt?

  Porque son datos controlados por el servidor o por la base de datos. El navegador no debería decidirlos.

  El filtro se activa globalmente en C:/Users/Desarrollos/pablo/purifreze_landinpage/backend/src/main.ts:

  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  })

  Significa:

   Opción                  Función
  ━━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   whitelist               Solo admite propiedades declaradas en el DTO
  ──────────────────────  ──────────────────────────────────────────────────
   forbidNonWhitelisted    Devuelve error si llegan propiedades adicionales
  ──────────────────────  ──────────────────────────────────────────────────
   transform               Convierte el body al tipo esperado cuando aplica

  Por eso viste:

  property id should not exist
  property key should not exist

  El backend estaba diciendo: “estos campos no forman parte del contrato de actualización”.

  ## 4. El Service: la lógica de negocio

  Si el body supera la validación, el controller delega al service:

  return this.contentSectionsService.update(key, dto);

  Puedes seguir el recorrido en C:/Users/Desarrollos/pablo/purifreze_landinpage/backend/src/content-sections/content-sections.service.ts.

  Conceptualmente encontrarás algo similar a:

  return this.prisma.contentSection.update({
    where: { key },
    data: dto,
  });

  El service decide cómo se realiza la operación. El controller solamente conecta HTTP con esa lógica.

  Pregunta: si mañana quisieras impedir ocultar la sección hero, ¿dónde pondrías esa regla?

  En el service. No en Prisma y no en Angular. Es una regla del negocio.

  ## 5. Prisma: el puente a MySQL

  En C:/Users/Desarrollos/pablo/purifreze_landinpage/backend/prisma/schema.prisma defines el modelo persistido:

  model ContentSection {
    id          Int      @id @default(autoincrement())
    key         String   @unique
    label       String
    updatedAt   DateTime @updatedAt
  }

  Prisma conoce la forma de la tabla y genera métodos tipados para consultarla:

  prisma.contentSection.findMany()
  prisma.contentSection.create()
  prisma.contentSection.update()

  Pregunta importante: ¿DTO y modelo Prisma son duplicados?

  No. Se parecen, pero tienen responsabilidades diferentes:

   Pieza            Pregunta que responde
  ━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Modelo Prisma    ¿Cómo guardamos los datos?
  ───────────────  ───────────────────────────────────────
   DTO              ¿Qué permitimos recibir en esta ruta?
  ───────────────  ───────────────────────────────────────
   Controller       ¿Qué URL ejecuta qué operación?
  ───────────────  ───────────────────────────────────────
   Service          ¿Qué lógica aplicamos?

  El modelo Prisma puede incluir id, createdAt y updatedAt. El DTO de actualización puede excluirlos deliberadamente.

  ## Cómo rastrear cualquier petición

  Cuando quieras entender una operación, sigue siempre este orden:

  1. Busca el evento en Angular: por ejemplo, save().
  2. Localiza la llamada HTTP: busca .patch(, .post( o .get(.
  3. Anota método y URL: por ejemplo, PATCH /content-sections/:key.
  4. Busca en backend el decorador correspondiente: @Patch(':key').
  5. Identifica el DTO usado en @Body().
  6. Sigue el service invocado por el controller.
  7. Busca la llamada this.prisma....
  8. Consulta schema.prisma para entender la tabla.

  Tu turno: usando este mapa, ¿qué función dirías que cumple cada uno?

  @Controller('content-sections')
  @Patch(':key')
  @Param('key')
  @Body()
  UpdateContentSectionDto