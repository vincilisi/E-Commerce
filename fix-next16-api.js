#!/usr/bin/env node
import fs from "fs";
import path from "path";

const API_DIR = path.join(process.cwd(), "app/api");

function walk(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) walk(full);
    else if (f.name === "route.ts") fixFile(full);
  }
}

function fixFile(file) {
  let code = fs.readFileSync(file, "utf8");
  let updated = false;

  // Firma vecchia → nuova
  const oldSig =
    /\(\s*(request:\s*NextRequest\s*,\s*)\{\s*params\s*\}:\s*\{\s*params:\s*\{\s*(\w+):\s*string\s*\}\s*\}\s*\)/g;

  code = code.replace(oldSig, (_, req, param) => {
    updated = true;
    return `(${req}context: { params: Promise<{ ${param}: string }> })`;
  });

  // Inserisce await context.params
  if (updated && !code.includes("await context.params")) {
    code = code.replace(
      /{[\s\n]*const\s*\{\s*(\w+)\s*\}\s*=\s*params;/,
      ""
    );

    code = code.replace(
      /{([\s\S]*?)}/,
      (match) =>
        match +
        `\n  const { id } = await context.params;\n`
    );
  }

  // Runtime + dynamic
  if (!code.includes('runtime = "nodejs"')) {
    code =
      `export const runtime = "nodejs";\nexport const dynamic = "force-dynamic";\n\n` +
      code;
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(file, code);
    console.log("✔ fixed", file.replace(process.cwd(), ""));
  }
}

if (fs.existsSync(API_DIR)) {
  walk(API_DIR);
} else {
  console.error("❌ app/api non trovata");
}