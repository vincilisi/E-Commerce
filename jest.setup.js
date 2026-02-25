// Jest setup for Node.js TextEncoder polyfill
const { TextEncoder, TextDecoder } = require('util');
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Mock fetch globale per i test React
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({}),
  }));
}

// Import jest-dom per matchers come toBeInTheDocument
require('@testing-library/jest-dom');
