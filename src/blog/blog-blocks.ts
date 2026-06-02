import { BadRequestException } from '@nestjs/common';
import { BlogBlockDto } from './dto/blog-post.dto';

const text = (value: unknown, field: string) => {
  if (typeof value !== 'string') throw new BadRequestException(`${field} must be text.`);
  return value.trim();
};
const url = (value: unknown, field: string) => {
  const parsed = text(value, field);
  if (!/^(https?:\/\/|\/)/i.test(parsed)) throw new BadRequestException(`${field} must be an HTTP URL or site path.`);
  return parsed;
};

export function validateBlocks(blocks: BlogBlockDto[]): BlogBlockDto[] {
  return blocks.map((block) => {
    const data = block.data ?? {};
    if (block.type === 'paragraph') return { ...block, data: { text: text(data.text, 'Paragraph') } };
    if (block.type === 'heading') {
      if (data.level !== 2 && data.level !== 3) throw new BadRequestException('Heading level must be 2 or 3.');
      return { ...block, data: { text: text(data.text, 'Heading'), level: data.level } };
    }
    if (block.type === 'list') {
      if (!Array.isArray(data.items) || !data.items.every((item) => typeof item === 'string')) {
        throw new BadRequestException('List items must be text.');
      }
      return { ...block, data: { items: data.items.map((item) => item.trim()).filter(Boolean) } };
    }
    if (block.type === 'link') {
      return { ...block, data: { text: text(data.text, 'Link text'), url: url(data.url, 'Link URL') } };
    }
    if (block.type === 'image') {
      return { ...block, data: { url: url(data.url, 'Image URL'), alt: text(data.alt, 'Image alt text') } };
    }
    throw new BadRequestException('Unsupported blog block.');
  });
}
