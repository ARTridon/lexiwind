# Lexiwind

This is a simple React application where I utilize Lexiwind, a custom Tailwind CSS variant, for styling and shadcn/ui for UI components.

## Installation

1. npm i lexiwind or pnpm i

## Preview

<img src='/public/preview.png' width='100%' >

```sh
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
```

## Technologies Used

- React.js
- tailwind
- shadcn/ui
- lexical

## Credits

- [react](https://react.dev)
- [lexical](https://lexical.dev)
- [tailwind](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## License

This project is licensed under the [MIT License](LICENSE).
