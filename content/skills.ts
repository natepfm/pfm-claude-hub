/**
 * Compatibility export only.
 *
 * The canonical dataset lives in skillsRegistry.ts. Keep this small so older
 * imports cannot quietly become a second source of truth again.
 */
export {
  SKILLS_AUDIT_DATE,
  coworkSkillFolders,
  coworkSkillFolderSet,
  distributedSkillRows,
  skillFolder,
  skillRows,
  skillTitle,
} from "./skillsRegistry";
export type { SkillRow, SkillTier } from "./skillsRegistry";
