```chatagent
---
description: Add a new card entry to the Solution Catalog from a URL reference
---

## User Input

```text
$ARGUMENTS
```

You **MUST** use the provided URL to gather information. If `$ARGUMENTS` is empty, ask the user for a URL.

## Purpose

This agent automates adding new entries to the Solution Catalog by:
1. Extracting information from a provided URL (typically a GitHub repository)
2. Filling in card fields based on the extracted content
3. Asking the user for any details that cannot be reliably inferred
4. Adding the entry to `cards-export.xlsx`
5. Running the import script to update `cards.json`

---

## Card Schema

Each card requires the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Display name of the solution |
| description | string | Yes | Brief description (recommend 100-250 characters) |
| categories | string[] | Yes | One or more from allowed list |
| types | string[] | Yes | One or more from allowed list |
| visibility | string | Yes | `public` or `private` |
| link | string | Yes | The provided URL |
| hidden | boolean | No | Set to `false` by default (omit from Excel or set to `false`) |

### Allowed Categories
- `data` - Data platform, storage, or data engineering solutions
- `analytics` - Analytics, reporting, BI solutions
- `ai-application` - AI-powered applications (chatbots, assistants, RAG implementations)
- `ai-agent` - Autonomous or semi-autonomous AI agents with tool use or orchestration

### Allowed Types
- `code` - Source code repository or sample
- `design guidance` - Architecture or design documentation
- `migration guidance` - Migration guides or tools
- `blog` - Blog post or article
- `public documentation` - Official Microsoft/Azure documentation
- `level up` - Training or learning material
- `onlinedemo` - Hosted live demo
- `deployabledemo` - Deployable demo with infrastructure-as-code

---

## Execution Steps

### Step 1: Validate Input

- If `$ARGUMENTS` is empty or does not contain a valid URL, **STOP** and ask:
  > "Please provide a URL to add to the Solution Catalog (e.g., a GitHub repository link)."

### Step 2: Fetch and Analyze the URL

Use web fetching capabilities to retrieve content from the provided URL.

**For GitHub repositories**, extract:
- Repository name → Candidate for **title**
- README description/content → Candidate for **description**
- Topics/tags → Hints for **categories** and **types**
- Primary language → Hints for technology stack
- Repository description → Candidate for **description**

**For other URLs** (blogs, documentation, etc.):
- Page title → Candidate for **title**
- Meta description or first paragraph → Candidate for **description**
- Content analysis → Hints for **categories** and **types**

### Step 3: Determine Field Values

For each field, follow this decision process:

#### Title
- **If extractable**: Use repository name or page title, optionally with a descriptive suffix
- **If unclear**: Ask user: "What title should be used for this card?"

#### Description
- **If extractable**: Summarize the README or page content (100-250 characters)
- **If unclear or too vague**: Ask user: "Please provide a description for this card."

#### Categories
Map based on content analysis:
- AI agents, orchestration, tool use, autonomous systems → `ai-agent`
- AI applications, chatbots, assistants, RAG, LLM apps → `ai-application`
- Data platforms, databases, ETL, data engineering → `data`
- BI, reporting, dashboards, analytics → `analytics`

- **If unclear or no strong signal**: Ask user:
  > "Which category best fits this resource? Options: `data`, `analytics`, `ai-application`, `ai-agent`"

#### Types
Map based on content analysis:
- GitHub repo with source code → `code`
- Has deployment scripts (Bicep, Terraform, ARM) → add `deployabledemo`
- Live demo link mentioned → add `onlinedemo`
- Architecture/design focus → `design guidance`
- Migration-related content → `migration guidance`
- Blog post URL → `blog`
- Microsoft Learn/docs.microsoft.com → `public documentation`
- Training/workshop content → `level up`

- **If unclear or no strong signal**: Ask user:
  > "Which type(s) best describe this resource? Options: `code`, `design guidance`, `migration guidance`, `blog`, `public documentation`, `level up`, `onlinedemo`, `deployabledemo`"

#### Visibility
- **Default**: `public`
- Ask user if they need it private: "Should this card be public or private? (Default: public)"
- If user doesn't respond or confirms, use `public`

#### Hidden
- **Default**: `false`
- Only set to `true` if the user explicitly requests hiding the card

### Step 4: Confirm with User

Before proceeding, display the proposed card values:

```
## Proposed Card Entry

| Field | Value |
|-------|-------|
| title | [extracted/proposed title] |
| description | [extracted/proposed description] |
| categories | [proposed categories] |
| types | [proposed types] |
| visibility | public |
| link | [provided URL] |
| hidden | false |

Do you want to proceed with these values? (yes/no/edit)
```

- **If "yes"**: Proceed to Step 5
- **If "no"**: Cancel the operation
- **If "edit"**: Ask which field(s) to modify, then re-confirm

### Step 5: Add to Excel File

Execute the following to add the new row to `cards-export.xlsx`:

```javascript
// Using xlsx library via Node.js
const XLSX = require('xlsx');
const wb = XLSX.readFile('cards-export.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, {header: 1});

const newRow = [
  '[title]',
  '[description]',
  '[categories]',  // comma-separated if multiple
  '[types]',       // comma-separated if multiple
  '[visibility]',
  '[link]',
  '[hidden]'       // 'false' or empty
];

data.push(newRow);
const newWs = XLSX.utils.aoa_to_sheet(data);
wb.Sheets[wb.SheetNames[0]] = newWs;
XLSX.writeFile(wb, 'cards-export.xlsx');
```

### Step 6: Run Import Script

Execute:
```sh
npm run import-cards
```

This runs `scripts/excel-to-cards.js` to regenerate `src/data/cards.json`.

### Step 7: Verify and Report

1. Read the updated `cards.json` to confirm the new entry exists
2. Report success with the final card JSON:

```
✓ Successfully added new card to the Solution Catalog!

**Added Entry:**
{
  "title": "...",
  "description": "...",
  "categories": ["..."],
  "types": ["..."],
  "visibility": "public",
  "link": "..."
}

The card is now in:
- cards-export.xlsx (row XX)
- src/data/cards.json
```

---

## Error Handling

### URL Fetch Failures
If the URL cannot be fetched or analyzed:
> "I couldn't retrieve content from the provided URL. Please provide the following details manually:
> - Title:
> - Description:
> - Categories (data, analytics, ai-application, ai-agent):
> - Types (code, design guidance, migration guidance, blog, public documentation, level up, onlinedemo, deployabledemo):"

### Missing Required Fields
If any required field cannot be determined and user doesn't provide it:
> "Cannot proceed without [field name]. Please provide a value for [field name]."

### Duplicate Title
If the import script reports a duplicate:
> "A card with this title already exists. Please choose a different title or update the existing entry instead."

---

## Important Rules

1. **NEVER hallucinate or guess** values for fields. If information cannot be extracted from the URL, **ASK the user**.
2. **Always confirm** the proposed values before making changes.
3. **Categories and types must be from the allowed lists** - do not invent new values.
4. **Preserve the exact URL** provided by the user for the link field.
5. **Default hidden to false** unless explicitly requested otherwise.
6. **Run the import script** after modifying the Excel file to keep cards.json in sync.
```
