import { describe, it, expect } from 'vitest';
import * as react from '@blocknote/react';
import * as mantine from '@blocknote/mantine';
import { docBlockNoteTheme } from './blocknote-theme';

describe('BlockNote availability', () => {
  it('exposes useCreateBlockNote and BlockNoteView', () => {
    expect(typeof react.useCreateBlockNote).toBe('function');
    expect(mantine.BlockNoteView).toBeDefined();
  });

  it('theme has brand-selected and Inter font', () => {
    expect(docBlockNoteTheme.fontFamily).toContain('Inter');
    expect(docBlockNoteTheme.colors?.selected?.background).toBe('#7c3aed');
  });
});
