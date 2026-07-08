"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * RichTextEditor — Tiptap (StarterKit) WYSIWYG for the blog body. Emits sanitised
 * HTML via `onChange` (the backend re-sanitises server-side). Admin-only; loaded
 * with `dynamic(..., { ssr: false })` so it never ships to public bundles.
 *
 * Prose styling is done with Tailwind arbitrary selectors on the editor content
 * (no globals.css, no @tailwindcss/typography), per the Tailwind-only rule.
 */

const proseClass = cn(
  "min-h-[280px] max-w-none px-4 py-3.5 font-sans text-[14px] leading-relaxed text-fg outline-none",
  "[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:uppercase [&_h2]:italic [&_h2]:text-fg",
  "[&_h3]:mb-1.5 [&_h3]:mt-3.5 [&_h3]:font-display [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-gold",
  "[&_p]:my-2.5 [&_p]:text-fg-soft",
  "[&_ul]:my-2.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-fg-soft",
  "[&_ol]:my-2.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-fg-soft",
  "[&_li]:my-1",
  "[&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:pl-3.5 [&_blockquote]:text-fg-muted [&_blockquote]:italic",
  "[&_strong]:font-bold [&_strong]:text-fg",
  "[&_a]:text-gold [&_a]:underline",
  "[&_.is-editor-empty:first-child::before]:pointer-events-none [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:h-0 [&_.is-editor-empty:first-child::before]:text-fg-faint [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
);

export function RichTextEditor({
  initialHtml,
  onChange,
}: {
  initialHtml: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
    ],
    content: initialHtml || "",
    editorProps: {
      attributes: { class: proseClass, "data-placeholder": "Tulis isi artikel di sini…" },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) {
    return (
      <div className="border border-border bg-surface-sunken">
        <div className="h-[46px] border-b border-border bg-surface" />
        <div className="min-h-[280px] px-4 py-3.5 font-sans text-sm text-fg-faint">
          Memuat editor…
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border bg-surface-sunken focus-within:border-gold">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-surface px-2 py-2">
      <ToolBtn label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn label="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="h-4 w-4" />
      </ToolBtn>
      <Divider />
      <ToolBtn label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 className="h-4 w-4" />
      </ToolBtn>
      <Divider />
      <ToolBtn label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </ToolBtn>
      <Divider />
      <ToolBtn label="Undo" active={false} onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn label="Redo" active={false} onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className="h-4 w-4" />
      </ToolBtn>
    </div>
  );
}

function ToolBtn({
  children,
  label,
  active,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "grid h-8 w-8 place-items-center border transition-colors",
        active
          ? "border-gold bg-gold/15 text-gold"
          : "border-transparent text-fg-muted hover:bg-surface-sunken hover:text-fg"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-5 w-px bg-border" />;
}
