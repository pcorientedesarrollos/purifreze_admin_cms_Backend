import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

interface UploadedVideo {
  buffer: Buffer;
  mimetype: string;
  size: number;
}

@Injectable()
export class MediaService {
  private readonly videosDirectory = join(process.cwd(), 'uploads', 'videos');
  private readonly imagesDirectory = join(process.cwd(), 'uploads', 'images');

  async saveVideo(file: UploadedVideo | undefined) {
    if (!file) {
      throw new BadRequestException('Select an MP4 video to upload.');
    }

    if (file.mimetype !== 'video/mp4') {
      throw new BadRequestException('Only MP4 videos are allowed.');
    }

    if (file.size > 25 * 1024 * 1024) {
      throw new BadRequestException('Videos must be 25 MB or smaller.');
    }

    await mkdir(this.videosDirectory, { recursive: true });
    const filename = `${randomUUID()}.mp4`;
    await writeFile(join(this.videosDirectory, filename), file.buffer);

    return {
      filename,
      url: `/uploads/videos/${filename}`,
    };
  }

  async deleteVideo(filename: string) {
    if (
      basename(filename) !== filename ||
      !/^[0-9a-f-]{36}\.mp4$/i.test(filename)
    ) {
      throw new BadRequestException('The requested video cannot be deleted.');
    }

    try {
      await unlink(join(this.videosDirectory, filename));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new NotFoundException('The requested video does not exist.');
      }

      throw error;
    }

    return { deleted: true };
  }

  async saveImage(file: UploadedVideo | undefined) {
    if (!file) throw new BadRequestException('Selecciona una imagen.');
    const extensions: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };
    const extension = extensions[file.mimetype];
    if (!extension) throw new BadRequestException('Solo se permiten imágenes JPG, PNG o WebP.');
    if (file.size > 5 * 1024 * 1024) throw new BadRequestException('La imagen debe pesar 5 MB o menos.');
    await mkdir(this.imagesDirectory, { recursive: true });
    const filename = `${randomUUID()}.${extension}`;
    await writeFile(join(this.imagesDirectory, filename), file.buffer);
    return { filename, url: `/uploads/images/${filename}` };
  }
}
