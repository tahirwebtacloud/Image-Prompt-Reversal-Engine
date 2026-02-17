# Public API Design (Draft)

- **Date**: 2026-02-18
- **Topic**: Public API with Key Management & Documentation

## Overview

Expose a technical API for "Post Analyzer" to allow external apps to reverse-engineer images.

## Core Components

1. **API Key Management**:
   - Keys stored as SHA-256 hashes in DB.
   - User identifies via `Authorization: Bearer <key>`
   - UI for generating/revoking keys.
2. **Analysis Endpoint**:
   - Returns filtered JSON (Prompt, Sample, Colors, Typography).
3. **Documentation**:
   - In-app technical guide with visual examples.

## Next Steps (Brainstorming)

- [x] Decide on 3-layer architecture vs Next.js native. (Chose: Next.js Native)
- [x] Decide on Rate Limiting infrastructure. (Chose: DB-based)

## Final Design Decisions

- **Next.js Integration**: API routes in `src/app/api/v1` using TypeScript.
- **Key Storage**: Table `api_access_keys` in PostgreSQL. Hashed using `SHA-256`.
- **Authentication**: `Authorization: Bearer sk_[random]` header.
- **Throttling**: Middleware-level check against a `usage_log` table or atomic counter in DB.
- **Documentation**: Static page in Dashboard with code snippets for Curl and Fetch.
