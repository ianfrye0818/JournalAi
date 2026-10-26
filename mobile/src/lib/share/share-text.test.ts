import { shareToSnippetText } from './share-text';

describe('shareToSnippetText', () => {
  it('puts the page title above a shared link', () => {
    expect(
      shareToSnippetText({
        text: 'https://example.com/post',
        webUrl: 'https://example.com/post',
        meta: { title: 'A good post' },
      }),
    ).toBe('A good post\nhttps://example.com/post');
  });

  it('keeps shared text as is and skips a title it already contains', () => {
    expect(
      shareToSnippetText({ text: ' A good post: https://x.y ', webUrl: 'https://x.y', meta: { title: 'A good post' } }),
    ).toBe('A good post: https://x.y');
    expect(shareToSnippetText({ text: 'just a quote', webUrl: null })).toBe('just a quote');
  });

  it('falls back to the url, and is empty when nothing usable was shared', () => {
    expect(shareToSnippetText({ text: null, webUrl: 'https://x.y' })).toBe('https://x.y');
    expect(shareToSnippetText({ text: '  ', webUrl: null, meta: null })).toBe('');
  });
});
