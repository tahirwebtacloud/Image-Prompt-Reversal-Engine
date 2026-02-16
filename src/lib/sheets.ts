import { google } from "googleapis";

function getSheetsClient() {
  const email = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  );

  if (!email || !privateKey) {
    console.warn("Google Sheets credentials not configured");
    return null;
  }

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function ensureUserSheet(userEmail: string): Promise<boolean> {
  const sheets = getSheetsClient();
  if (!sheets) return false;

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) return false;

  try {
    // Check if user's sheet tab already exists
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheets = spreadsheet.data.sheets || [];
    const sheetName = sanitizeSheetName(userEmail);

    const exists = existingSheets.some(
      (s) => s.properties?.title === sheetName
    );

    if (!exists) {
      // Create new sheet tab for this user
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      });

      // Add header row
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `'${sheetName}'!A1:H1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [
            [
              "Timestamp",
              "Image Name",
              "Overall Score",
              "Reverse Engineered Prompt",
              "Colors",
              "Fonts",
              "Hooks",
              "Full Analysis",
            ],
          ],
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Error ensuring user sheet:", error);
    return false;
  }
}

export async function logAnalysisToSheet(
  userEmail: string,
  imageName: string,
  analysis: Record<string, unknown>
): Promise<boolean> {
  const sheets = getSheetsClient();
  if (!sheets) return false;

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) return false;

  try {
    const sheetName = sanitizeSheetName(userEmail);
    await ensureUserSheet(userEmail);

    const recommendations = analysis.recommendations as Record<string, unknown> | undefined;
    const colorAnalysis = analysis.colorAnalysis as Record<string, unknown> | undefined;
    const typographyAnalysis = analysis.typographyAnalysis as Record<string, unknown> | undefined;
    const hookAnalysis = analysis.hookAnalysis as Record<string, unknown> | undefined;

    const colors = (colorAnalysis?.extractedColors as Array<Record<string, unknown>> || [])
      .map((c) => `${c.name} (${c.hex})`)
      .join(", ");

    const fonts = (typographyAnalysis?.identifiedFonts as Array<Record<string, unknown>> || [])
      .map((f) => f.font)
      .join(", ");

    const hooks = (hookAnalysis?.alternativeHooks as string[] || []).join(" | ");

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${sheetName}'!A:H`,
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            imageName,
            (recommendations?.overallScore as number) || "N/A",
            (analysis.reverseEngineeredPrompt as string) || "",
            colors,
            fonts,
            hooks,
            JSON.stringify(analysis).substring(0, 50000), // Google Sheets cell limit
          ],
        ],
      },
    });

    return true;
  } catch (error) {
    console.error("Error logging to sheet:", error);
    return false;
  }
}

function sanitizeSheetName(email: string): string {
  // Sheet names have a 100 char limit and can't contain certain chars
  return email
    .replace(/@/g, "_at_")
    .replace(/\./g, "_")
    .substring(0, 100);
}
