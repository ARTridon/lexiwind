# @lexiwind/config-eslint

Shared ESLint configuration for Lexiwind packages — consistent code quality across all packages.

## Overview

This package provides the ESLint configuration used across all Lexiwind packages. Use it in your Lexiwind projects or custom plugins to maintain code quality standards.

## Installation

```bash
npm install --save-dev @lexiwind/config-eslint
```

## Setup

Add to your `.eslintrc.cjs`:

```javascript
module.exports = {
  extends: ["@lexiwind/config-eslint"],
};
```

## Included Rules

- React best practices
- TypeScript type safety
- Unused variable detection
- Import organization
- Code quality standards

## Customization

Override specific rules:

```javascript
module.exports = {
  extends: ["@lexiwind/config-eslint"],
  rules: {
    "no-console": "warn",
    "react/prop-types": "off",
  },
};
```

## Learn More

See the main [Lexiwind documentation](https://github.com/ARTridon/lexiwind) for ESLint customization.
