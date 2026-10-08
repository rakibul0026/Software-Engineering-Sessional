import fs from "fs";
import path from "path";

const root = path.resolve(process.cwd(), "..");
const templatesDir = path.join(root, "templates");
const pagesDir = path.join(process.cwd(), "src", "pages");
const routesFile = path.join(process.cwd(), "src", "routes.generated.jsx");

function toPascalCase(name) {
  return name
    .replace(/\.html$/i, "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

function cleanTemplate(content) {
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let html = bodyMatch ? bodyMatch[1] : content;

  html = html
    .split("\n")
    .filter((line) => !/\{[%{].*[%}]\}/.test(line))
    .join("\n");

  html = html
    .replace(/\{\%[\s\S]*?\%\}/g, "")
    .replace(/\{\{[\s\S]*?\}\}/g, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*'[^']*'/gi, "");

  return html.trim();
}

function toRoutePath(fileName) {
  const base = fileName.replace(/\.html$/i, "");
  return base === "index" ? "/" : `/${base}`;
}

const templateFiles = fs
  .readdirSync(templatesDir)
  .filter((name) => name.toLowerCase().endsWith(".html"))
  .sort();

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

const routeDefs = [];

for (const fileName of templateFiles) {
  const fullPath = path.join(templatesDir, fileName);
  const source = fs.readFileSync(fullPath, "utf8");
  const cleanedHtml = cleanTemplate(source)
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");

  const componentBaseName = `${toPascalCase(fileName)}Page`;
  const componentFileName = `${componentBaseName}.jsx`;
  const componentPath = path.join(pagesDir, componentFileName);

  const componentContent = `import RawHtmlPage from "../components/RawHtmlPage";

const html = \`${cleanedHtml}\`;

export default function ${componentBaseName}() {
  return (
    <div className="page-shell">
      <RawHtmlPage html={html} />
    </div>
  );
}
`;

  fs.writeFileSync(componentPath, componentContent, "utf8");
  routeDefs.push({
    route: toRoutePath(fileName),
    componentBaseName
  });
}

const importLines = routeDefs
  .map(
    ({ componentBaseName }) =>
      `import ${componentBaseName} from "./pages/${componentBaseName}";`
  )
  .join("\n");

const routeEntries = routeDefs
  .map(
    ({ route, componentBaseName }) =>
      `  { path: "${route}", Component: ${componentBaseName} }`
  )
  .join(",\n");

const routesContent = `${importLines}

export const routeDefinitions = [
${routeEntries}
];
`;

fs.writeFileSync(routesFile, routesContent, "utf8");

console.log(`Generated ${routeDefs.length} React pages from templates.`);
