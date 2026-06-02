import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { AdminAuthGuard } from '../auth/admin-auth.guard';

interface UploadedVideo {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('videos')
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 25 * 1024 * 1024 },
    }),
  )
  uploadVideo(@UploadedFile() file: UploadedVideo | undefined) {
    return this.mediaService.saveVideo(file);
  }

  @Delete('videos/:filename')
  @UseGuards(AdminAuthGuard)
  deleteVideo(@Param('filename') filename: string) {
    return this.mediaService.deleteVideo(filename);
  }

  @Post('images')
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  uploadImage(@UploadedFile() file: UploadedVideo | undefined) {
    return this.mediaService.saveImage(file);
  }
}
