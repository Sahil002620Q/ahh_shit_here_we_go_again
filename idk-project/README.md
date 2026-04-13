# College Lost and Found Application

A TypeScript-based system for managing lost and found items in a college community.

## Project Structure

```
college-lost-found-app/
├── src/
│   └── types/          # Core type definitions
│       ├── user.ts     # User and admin types
│       ├── item.ts     # Lost and found item types
│       ├── claim.ts    # Claim verification types
│       ├── chat.ts     # Chat message types
│       ├── activity.ts # Activity logging types
│       ├── errors.ts   # Error types
│       ├── result.ts   # Result type for error handling
│       └── index.ts    # Central type exports
├── tests/              # Test files
├── dist/               # Compiled JavaScript output
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── jest.config.js      # Jest testing configuration
```

## Setup

Install dependencies:
```bash
npm install
```

## Scripts

- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run build` - Compile TypeScript to JavaScript
- `npm run type-check` - Check types without emitting files

## Features

- Admin authentication and authorization
- Lost and found item posting
- Ownership verification through text-based questions
- Anonymous and non-anonymous chat
- Activity logging and monitoring

## Technology Stack

- TypeScript (strict mode)
- Jest (testing framework)
- fast-check (property-based testing)
