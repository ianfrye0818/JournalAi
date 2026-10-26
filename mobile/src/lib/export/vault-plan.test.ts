import { describeVaultUri, planVaultWrite } from '@/lib/export/vault-plan';

describe('planVaultWrite', () => {
  it('creates a missing file', () => {
    expect(planVaultWrite({ currentHash: null, lastHash: 'a', nextHash: 'b' })).toBe('create');
  });

  it('leaves a file that already matches', () => {
    expect(planVaultWrite({ currentHash: 'b', lastHash: null, nextHash: 'b' })).toBe('unchanged');
  });

  it('overwrites a file nobody touched since the last export', () => {
    expect(planVaultWrite({ currentHash: 'a', lastHash: 'a', nextHash: 'b' })).toBe('overwrite');
  });

  it('flags a file edited outside the app', () => {
    expect(planVaultWrite({ currentHash: 'edited', lastHash: 'a', nextHash: 'b' })).toBe('conflict');
  });

  it('flags a file it has no record of writing', () => {
    expect(planVaultWrite({ currentHash: 'x', lastHash: null, nextHash: 'b' })).toBe('conflict');
  });
});

describe('describeVaultUri', () => {
  const base = 'content://com.android.externalstorage.documents/tree/';

  it('shows the path on internal storage', () => {
    expect(describeVaultUri(`${base}primary%3ADocuments%2FVault%2FDaily`)).toBe('Documents/Vault/Daily');
    expect(describeVaultUri(`${base}primary%3A`)).toBe('Internal storage');
  });

  it('keeps the volume for SD cards', () => {
    expect(describeVaultUri(`${base}1A2B-3C4D%3ANotes`)).toBe('1A2B-3C4D/Notes');
  });

  it('returns anything else as is', () => {
    expect(describeVaultUri('file:///data/vault')).toBe('file:///data/vault');
  });
});
