"use client";
import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, ImagePlus, Italic, List } from "lucide-react";
import { useCallback } from "react";

interface RichTextEditorProps {
  content: string;
  setContent: (value: string) => void;
}

export default function RichTextEditor({
  content,
  setContent,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const bold = () => {
    if (!editor) {
      return "No editor found";
    }
    editor.chain().focus().toggleBold().run();
  };
  const italic = () => {
    if (!editor) {
      return "No editor found";
    }
    editor.chain().focus().toggleItalic().run();
  };
  const list = () => {
    if (!editor) {
      return "No editor found";
    }
    editor.chain().focus().toggleBulletList().run();
  };
  const image = useCallback(() => {
    const url = window.prompt("URL");
    if (url) {
      if (!editor) {
        return "No editor found";
      }
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return;
  }

  return (
    <div>
      <EditorContent editor={editor} />

      <div className="mt-2 space-x-1">
        <button
          className="bg-black text-white rounded px-1"
          onClick={bold}
          type="button"
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          <Bold />
        </button>
        <button
          className="bg-black text-white rounded px-1"
          onClick={italic}
          type="button"
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          <Italic />
        </button>
        <button
          className="bg-black text-white rounded px-1"
          onClick={list}
          type="button"
          disabled={!editor.can().chain().focus().toggleBulletList().run()}
        >
          <List />
        </button>
        <button className="bg-black text-white rounded px-1" onClick={image}>
          <ImagePlus />
        </button>
      </div>
    </div>
  );
}
