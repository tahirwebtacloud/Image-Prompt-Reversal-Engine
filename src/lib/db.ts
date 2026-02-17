import { sql } from "@vercel/postgres";

export async function initializeDatabase() {
  try {
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        google_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Credentials table (stores encrypted API keys)
    await sql`
      CREATE TABLE IF NOT EXISTS credentials (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        provider VARCHAR(50) DEFAULT 'gemini',
        api_key_encrypted TEXT NOT NULL,
        is_valid BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, provider)
      );
    `;

    // Analysis history table
    await sql`
      CREATE TABLE IF NOT EXISTS analysis_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        image_name VARCHAR(255),
        image_thumbnail TEXT,
        analysis_json JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // API Keys table for external access
    await sql`
      CREATE TABLE IF NOT EXISTS api_keys (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        hashed_key TEXT UNIQUE NOT NULL,
        last_four VARCHAR(4) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // API Usage/Throttling table
    await sql`
      CREATE TABLE IF NOT EXISTS api_usage (
        id SERIAL PRIMARY KEY,
        key_id INTEGER NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}

export async function getOrCreateUser(profile: {
  googleId: string;
  email: string;
  name: string;
  avatarUrl: string;
}) {
  const existing = await sql`
    SELECT * FROM users WHERE google_id = ${profile.googleId}
  `;

  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  const result = await sql`
    INSERT INTO users (google_id, email, name, avatar_url)
    VALUES (${profile.googleId}, ${profile.email}, ${profile.name}, ${profile.avatarUrl})
    RETURNING *
  `;

  return result.rows[0];
}

export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
  return result.rows[0] || null;
}

export async function saveCredential(
  userId: number,
  apiKeyEncrypted: string,
  isValid: boolean
) {
  const result = await sql`
    INSERT INTO credentials (user_id, api_key_encrypted, is_valid)
    VALUES (${userId}, ${apiKeyEncrypted}, ${isValid})
    ON CONFLICT (user_id, provider)
    DO UPDATE SET api_key_encrypted = ${apiKeyEncrypted}, is_valid = ${isValid}, updated_at = NOW()
    RETURNING *
  `;
  return result.rows[0];
}

export async function getCredential(userId: number) {
  const result = await sql`
    SELECT * FROM credentials WHERE user_id = ${userId} AND provider = 'gemini'
  `;
  return result.rows[0] || null;
}

export async function deleteCredential(userId: number) {
  await sql`
    DELETE FROM credentials WHERE user_id = ${userId} AND provider = 'gemini'
  `;
}

export async function saveAnalysis(
  userId: number,
  imageName: string,
  imageThumbnail: string,
  analysisJson: object
) {
  const result = await sql`
    INSERT INTO analysis_history (user_id, image_name, image_thumbnail, analysis_json)
    VALUES (${userId}, ${imageName}, ${imageThumbnail}, ${JSON.stringify(analysisJson)})
    RETURNING *
  `;
  return result.rows[0];
}

export async function getAnalysisHistory(userId: number, limit: number = 20) {
  const result = await sql`
    SELECT * FROM analysis_history
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return result.rows;
}

export async function getAnalysisById(id: number, userId: number) {
  const result = await sql`
    SELECT * FROM analysis_history
    WHERE id = ${id} AND user_id = ${userId}
  `;
  return result.rows[0] || null;
}

// API Key Management
export async function createApiKey(userId: number, name: string, hashedKey: string, lastFour: string) {
  const result = await sql`
    INSERT INTO api_keys (user_id, name, hashed_key, last_four)
    VALUES (${userId}, ${name}, ${hashedKey}, ${lastFour})
    RETURNING id, name, last_four, created_at
  `;
  return result.rows[0];
}

export async function getApiKeys(userId: number) {
  const result = await sql`
    SELECT id, name, last_four, created_at
    FROM api_keys
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
  return result.rows;
}

export async function revokeApiKey(id: number, userId: number) {
  await sql`
    DELETE FROM api_keys
    WHERE id = ${id} AND user_id = ${userId}
  `;
}

export async function validateApiKey(hashedKey: string) {
  const result = await sql`
    SELECT k.*, u.email
    FROM api_keys k
    JOIN users u ON k.user_id = u.id
    WHERE k.hashed_key = ${hashedKey}
  `;
  return result.rows[0] || null;
}

export async function logApiUsage(keyId: number, userId: number) {
  await sql`
    INSERT INTO api_usage (key_id, user_id)
    VALUES (${keyId}, ${userId})
  `;
}

export async function getApiUsageCount(keyId: number, windowSeconds: number = 60) {
  const result = await sql`
    SELECT COUNT(*) as count
    FROM api_usage
    WHERE key_id = ${keyId}
    AND timestamp > NOW() - ((${windowSeconds} || ' seconds')::interval)
  `;
  return parseInt(result.rows[0].count);
}
