export const SKILL_COLORS = {
  cyan: 'bg-cyan-100 text-cyan-800',
  indigo: 'bg-indigo-100 text-indigo-700',
  teal: 'bg-teal-100 text-teal-800',
  violet: 'bg-violet-100 text-violet-800',
  sky: 'bg-sky-100 text-sky-800',
  emerald: 'bg-emerald-100 text-emerald-800',
  rose: 'bg-rose-100 text-rose-800',
  amber: 'bg-amber-100 text-amber-800',
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  pink: 'bg-pink-100 text-pink-800',
  orange: 'bg-orange-100 text-orange-800',
  fuchsia: 'bg-fuchsia-100 text-fuchsia-800',
  lime: 'bg-lime-100 text-lime-800',
  purple: 'bg-purple-100 text-purple-800',
  red: 'bg-red-100 text-red-800',
};

const COLOR_KEYS = Object.keys(SKILL_COLORS);

export function getSkillColorClass(skill) {
  return SKILL_COLORS[COLOR_KEYS[skill.id % COLOR_KEYS.length]];
}
