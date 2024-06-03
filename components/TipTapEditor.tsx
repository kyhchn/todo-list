"use client";
import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TipTapTopbar from "./TipTapTopbar";
import { TaskType } from "@/lib/db/schema";

type Props = {
  task: TaskType;
  setDesc: (desc: string) => void;
};

const TipTapEditor = ({ task, setDesc }: Props) => {
  const [content, setContent] = React.useState(task.desc || "");

  const editor = useEditor({
    extensions: [StarterKit],
    autofocus: true,
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    const update = setTimeout(() => {
      setDesc(content);
    }, 500);

    return () => clearTimeout(update);
  }, [content]);

  return (
    <>
      <div className="flex justify-between">
        {editor && <TipTapTopbar editor={editor} />}
      </div>
      <div className="w-full prose-sm">
        <EditorContent editor={editor} />
      </div>
    </>
  );
};

export default TipTapEditor;
