/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** ID of the Google Sheet that powers the site. See .env.example. */
  readonly VITE_SHEET_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
