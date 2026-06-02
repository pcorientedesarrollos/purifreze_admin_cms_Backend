import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { ContentSectionsService } from './content-sections.service';
import { CreateContentSectionDto } from './dto/create-content-section.dto';
import { UpdateContentSectionDto } from './dto/update-content-section.dto';

@Controller('content-sections')
export class ContentSectionsController {
  constructor(
    private readonly contentSectionsService: ContentSectionsService,
  ) {}

  @Get()
  findAll() {
    return this.contentSectionsService.findAll();
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() createContentSectionDto: CreateContentSectionDto) {
    return this.contentSectionsService.create(createContentSectionDto);
  }

  @Patch(':key')
  @UseGuards(AdminAuthGuard)
  update(
    @Param('key') key: string,
    @Body() updateContentSectionDto: UpdateContentSectionDto,
  ) {
    console.log('UPDATE', key, updateContentSectionDto);
    return this.contentSectionsService.update(key, updateContentSectionDto);
  }
}
