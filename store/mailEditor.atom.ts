import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { OutputData } from '@editorjs/editorjs'; // Ensure this type is correctly imported or defined

// Define an initial empty state for the editor
const initialEditorData: OutputData = {
  time: new Date().getTime(),
  blocks: [],
  version: "2.22.2" // Use a version compatible with your @editorjs/editorjs installation
};

// Atom to store the OutputData from Editor.js
export const mailEditorContentAtom = atomWithStorage<OutputData>(
  'mailEditorContent',
  initialEditorData
);

// Atom to get and set the content, handling updates
export const currentMailEditorContentAtom = atom(
  (get) => get(mailEditorContentAtom),
  (_get, set, newContent: OutputData) => {
    set(mailEditorContentAtom, newContent);
  }
);
