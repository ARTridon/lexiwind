"use client";

import { useState, useEffect } from "react";
import { Lexiwind } from "./Lexiwind";

export const Preview = () => {
  const [value, setValue] = useState(
    () => (localStorage.getItem("lexiwind-editor") as string) ?? "",
  );

  useEffect(() => {
    if (value) {
      localStorage.setItem("lexiwind-editor", JSON.stringify(value));
    }
  }, [value]);

  return (
    <>
      <Lexiwind value={value} onChange={setValue} />
      <Lexiwind
        value={value}
        // only show content
        preview
      />
    </>
  );
};
