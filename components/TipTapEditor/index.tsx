import { FC, useCallback } from 'react';
import { useEditor, EditorContent, Editor, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaParagraph,
  FaHeading,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaUndo,
  FaRedo,
  FaRulerHorizontal,
  FaTextWidth,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaTable,
  FaTrash,
  FaLink,
  FaImage,
  FaUnlink,
} from 'react-icons/fa';
import {
  TbColumnInsertRight,
  TbColumnRemove,
  TbRowInsertBottom,
  TbRowRemove,
} from 'react-icons/tb';

type MenuBarProps = {
  editor: Editor | null;
  setLink: () => void;
  addImage: () => void;
};

const MenuBar: FC<MenuBarProps> = ({ editor, setLink, addImage }) => {
  if (!editor) {
    return null;
  }

  const menuItems = [
    {
      icon: FaBold,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      disabled: !editor.can().chain().focus().toggleBold().run(),
      title: 'Bold',
    },
    {
      icon: FaItalic,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      disabled: !editor.can().chain().focus().toggleItalic().run(),
      title: 'Italic',
    },
    {
      icon: FaStrikethrough,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
      disabled: !editor.can().chain().focus().toggleStrike().run(),
      title: 'Strike',
    },
    {
      icon: FaCode,
      onClick: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
      disabled: !editor.can().chain().focus().toggleCode().run(),
      title: 'Code',
    },
    {
      icon: FaParagraph,
      onClick: () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive('paragraph'),
      title: 'Paragraph',
    },
    {
      icon: FaHeading,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
      title: 'H1',
    },
    {
      icon: FaHeading,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      title: 'H2',
    },
    {
      icon: FaHeading,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
      title: 'H3',
    },
    {
      icon: FaListUl,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      title: 'Bullet List',
    },
    {
      icon: FaListOl,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      title: 'Ordered List',
    },
    {
      icon: FaQuoteLeft,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
      title: 'Blockquote',
    },
    {
      icon: FaRulerHorizontal,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      title: 'Horizontal Rule',
    },
    {
      icon: FaTextWidth,
      onClick: () => editor.chain().focus().setHardBreak().run(),
      title: 'Hard Break',
    },
    {
      icon: FaAlignLeft,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: editor.isActive({ textAlign: 'left' }),
      title: 'Align Left',
    },
    {
      icon: FaAlignCenter,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: editor.isActive({ textAlign: 'center' }),
      title: 'Align Center',
    },
    {
      icon: FaAlignRight,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: editor.isActive({ textAlign: 'right' }),
      title: 'Align Right',
    },
    {
      icon: FaLink,
      onClick: setLink,
      isActive: editor.isActive('link'),
      title: 'Set Link',
    },
    {
      icon: FaImage,
      onClick: addImage,
      title: 'Add Image',
    },
    {
      icon: FaTable,
      onClick: () =>
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
      title: 'Insert Table',
    },
    {
      icon: FaTrash,
      onClick: () => editor.chain().focus().deleteTable().run(),
      title: 'Delete Table',
    },
    {
      icon: TbColumnInsertRight,
      onClick: () => editor.chain().focus().addColumnAfter().run(),
      title: 'Add Column After',
    },
    {
      icon: TbColumnRemove,
      onClick: () => editor.chain().focus().deleteColumn().run(),
      title: 'Delete Column',
    },
    {
      icon: TbRowInsertBottom,
      onClick: () => editor.chain().focus().addRowAfter().run(),
      title: 'Add Row After',
    },
    {
      icon: TbRowRemove,
      onClick: () => editor.chain().focus().deleteRow().run(),
      title: 'Delete Row',
    },
    {
      icon: FaUndo,
      onClick: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().chain().focus().undo().run(),
      title: 'Undo',
    },
    {
      icon: FaRedo,
      onClick: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().chain().focus().redo().run(),
      title: 'Redo',
    },
  ];

  return (
    <div className="flex items-center flex-wrap gap-2 mb-4 p-2 border rounded">
      {menuItems.map((item, index) => (
        <div key={index} className="tooltip" data-tip={item.title}>
          <button
            onClick={item.onClick}
            disabled={item.disabled}
            className={`btn btn-ghost btn-sm ${
              item.isActive ? 'btn-active' : ''
            }`}
          >
            <item.icon />
          </button>
        </div>
      ))}
    </div>
  );
};

type TipTapEditorProps = {
  content: string;
  onUpdate: (html: string) => void;
  placeholder?: string;
  className?: string;
};

const TipTapEditor: FC<TipTapEditorProps> = ({
  content,
  onUpdate,
  placeholder = 'Insert text here...',
  className = 'min-h-[150px]',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer nofollow',
          class: 'cursor-pointer',
        },
      }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl min-w-full focus:outline-none border rounded-lg p-4 shadow-sm ${className}`,
      },
    },
    immediatelyRender: false,
  });

  const addImage = useCallback(() => {
    const url = window.prompt('URL');

    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) {
      return;
    }

    const previousUrl = editor.getAttributes('link').href;
    const { from, to } = editor.state.selection;
    const isLink = editor.isActive('link');

    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    if (from !== to) {
      editor.chain().focus().setTextSelection({ from, to }).setLink({ href: url }).run();
    } else if (isLink) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    } else {
      const text = url;
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${url}" target="_blank">${text}</a>`)
        .run();
    }
  }, [editor]);

  return (
    <div>
      <MenuBar editor={editor} setLink={setLink} addImage={addImage} />
      {editor && (
        <BubbleMenu
          className="bg-base-200 shadow-xl p-2 rounded-lg flex gap-2"
          editor={editor}
          tippyOptions={{ duration: 100 }}
          shouldShow={({ editor, view, state, from, to }) => {
            return from !== to;
          }}
        >
          {editor.isActive('link') ? (
            <>
              <button onClick={setLink} className="btn btn-ghost btn-sm">
                <FaLink />
              </button>
              <button
                onClick={() => editor.chain().focus().unsetLink().run()}
                className="btn btn-ghost btn-sm"
              >
                <FaUnlink />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`btn btn-ghost btn-sm ${
                  editor.isActive('bold') ? 'btn-active' : ''
                }`}
              >
                <FaBold />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`btn btn-ghost btn-sm ${
                  editor.isActive('italic') ? 'btn-active' : ''
                }`}
              >
                <FaItalic />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`btn btn-ghost btn-sm ${
                  editor.isActive('strike') ? 'btn-active' : ''
                }`}
              >
                <FaStrikethrough />
              </button>
            </>
          )}
        </BubbleMenu>
      )}
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
};

export default TipTapEditor;
