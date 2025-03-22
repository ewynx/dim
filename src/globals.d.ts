// src/globals.d.ts
import type process from 'process';
import type { Buffer } from 'buffer';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: typeof process;
  }
}
export {};
