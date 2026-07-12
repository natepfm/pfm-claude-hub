import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const registryPath = path.join(root, "content", "skillsRegistry.ts");
const publicRoot = path.join(root, "public", "skills");
const pluginPath = path.join(root, "public", "pfm-cowork-skills.plugin");
const source = fs.readFileSync(registryPath, "utf8");

const rows = source
  .split("\n")
  .filter((line) => line.trimStart().startsWith("{ num:"))
  .map((line) => {
    const read = (field) => line.match(new RegExp(`${field}: "([^"]+)"`))?.[1];
    return { num: read("num"), id: read("id"), folder: read("folder"), tier: read("tier") };
  });

const coworkBlock = source.match(/export const coworkSkillFolders = \[(.*?)\] as const;/s)?.[1];
if (!coworkBlock) throw new Error("coworkSkillFolders is missing from skillsRegistry.ts");
const cowork = [...coworkBlock.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
const liveFolders = rows
  .filter((row) => row.tier === "live")
  .map((row) => row.folder.split(" · trigger ")[0].replace(/\.md$/, ""));

function duplicates(values) {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}

const errors = [];
for (const [label, values] of [["num", rows.map((r) => r.num)], ["id", rows.map((r) => r.id).filter((id) => id !== "—")], ["live folder", liveFolders]]) {
  const dupes = duplicates(values);
  if (dupes.length) errors.push(`Duplicate ${label}: ${dupes.join(", ")}`);
}

for (const folder of liveFolders) {
  if (!fs.existsSync(path.join(publicRoot, folder, "SKILL.md"))) {
    errors.push(`Missing public skill: public/skills/${folder}/SKILL.md`);
  }
}

const publicFolders = fs.readdirSync(publicRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
for (const folder of publicFolders.filter((folder) => !liveFolders.includes(folder))) {
  errors.push(`Public skill is not team-live in registry: ${folder}`);
}

for (const folder of cowork.filter((folder) => !liveFolders.includes(folder))) {
  errors.push(`Cowork skill is not team-live: ${folder}`);
}

const archive = execFileSync("unzip", ["-Z1", pluginPath], { encoding: "utf8" });
const pluginSkills = [...archive.matchAll(/pfm-cowork-skills\/skills\/([^/]+)\/SKILL\.md/g)].map((match) => match[1]);
for (const folder of cowork.filter((folder) => !pluginSkills.includes(folder))) {
  errors.push(`Cowork plugin is missing: ${folder}`);
}
for (const folder of pluginSkills.filter((folder) => !cowork.includes(folder))) {
  errors.push(`Cowork plugin has unregistered skill: ${folder}`);
}

if (errors.length) {
  console.error(errors.map((error) => `ERROR: ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Registry valid: ${rows.length} tracked · ${liveFolders.length} team-live · ${cowork.length} Cowork · ${publicFolders.length} downloads`);
