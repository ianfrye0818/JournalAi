import { issueForError, joinTranscript, levelFromVolume, pickInstalledLocale } from './dictation';

describe('joinTranscript', () => {
  it('returns the dictation alone when the box is empty', () => {
    expect(joinTranscript('', ' hello world ')).toBe('hello world');
  });

  it('adds one space between typed text and dictation', () => {
    expect(joinTranscript('Coffee with Sam.  ', 'it was great')).toBe('Coffee with Sam. it was great');
  });

  it('leaves the base untouched when nothing was dictated yet', () => {
    expect(joinTranscript('Typed ', '  ')).toBe('Typed ');
  });
});

describe('levelFromVolume', () => {
  it('clamps silence to 0 and loud input to 1', () => {
    expect(levelFromVolume(-2)).toBe(0);
    expect(levelFromVolume(0)).toBe(0);
    expect(levelFromVolume(5)).toBe(0.5);
    expect(levelFromVolume(12)).toBe(1);
  });
});

describe('pickInstalledLocale', () => {
  it('prefers an exact match regardless of separator or case', () => {
    expect(pickInstalledLocale('en-US', ['en_GB', 'en_us'])).toBe('en_us');
  });

  it('falls back to another variant of the same language', () => {
    expect(pickInstalledLocale('en-AU', ['de-DE', 'en-US'])).toBe('en-US');
  });

  it('returns null when the language is not installed', () => {
    expect(pickInstalledLocale('fr-FR', ['en-US'])).toBeNull();
    expect(pickInstalledLocale('en-US', [])).toBeNull();
  });
});

describe('issueForError', () => {
  it('stays quiet for a user abort', () => {
    expect(issueForError('aborted')).toBeNull();
  });

  it('maps permission and network errors to their own kinds', () => {
    expect(issueForError('not-allowed')?.kind).toBe('denied');
    expect(issueForError('network')?.kind).toBe('offline');
    expect(issueForError('no-speech')?.kind).toBe('no-speech');
  });
});
