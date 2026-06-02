import { BadRequestException } from '@nestjs/common';
import { validateBlocks } from './blog-blocks';
import { slugify } from './blog.service';

describe('blog content helpers', () => {
  it('creates stable URL slugs from Spanish titles', () => {
    expect(slugify('  Cómo cuidar tu purificador en Mérida  ')).toBe(
      'como-cuidar-tu-purificador-en-merida',
    );
  });

  it('accepts safe site links', () => {
    expect(
      validateBlocks([
        { id: 'link-1', type: 'link', data: { text: 'Conoce más', url: '/blog' } },
      ]),
    ).toEqual([
      { id: 'link-1', type: 'link', data: { text: 'Conoce más', url: '/blog' } },
    ]);
  });

  it('rejects unsafe link schemes', () => {
    expect(() =>
      validateBlocks([
        { id: 'link-1', type: 'link', data: { text: 'Abrir', url: 'javascript:alert(1)' } },
      ]),
    ).toThrow(BadRequestException);
  });
});
