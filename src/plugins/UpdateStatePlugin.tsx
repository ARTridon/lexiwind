"use client";

import { InitialEditorStateType } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";

type UpdateStatePluginPropsType = {
  value: InitialEditorStateType | undefined;
};

export const UpdateStatePlugin = ({ value }: UpdateStatePluginPropsType) => {
  const [editor] = useLexicalComposerContext();
  const [isSetState, setIsSetState] = useState(false);

  useEffect(() => {
    if (editor && value && !isSetState) {
      try {
        const state = editor.parseEditorState(
          (value as string)
            ? JSON.parse(value as string)
            : `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"asdasdasdasdasdasdasdasdasdasdasdasdasd","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
        );

        editor.setEditorState(state);
        setIsSetState(true);
        console.log(state);
      } catch (error) {
        console.log(error);
      }
    }
  }, [editor, value, isSetState]);

  return null;
};
