export const SKILL_COLORS = {
  rose:    'bg-rose-500 text-white',
  pink:    'bg-pink-500 text-white',
  fuchsia: 'bg-fuchsia-500 text-white',
  purple:  'bg-purple-500 text-white',
  indigo:  'bg-indigo-500 text-white',
  blue:    'bg-blue-500 text-white',
  sky:     'bg-sky-500 text-white',
  cyan:    'bg-cyan-500 text-white',
  teal:    'bg-teal-500 text-white',
  emerald: 'bg-emerald-500 text-white',
  green:   'bg-green-500 text-white',
  lime:    'bg-lime-500 text-gray-900',
  yellow:  'bg-yellow-400 text-gray-900',
  amber:   'bg-amber-500 text-white',
  orange:  'bg-orange-500 text-white',
  red:     'bg-red-500 text-white',
};

const COLOR_KEYS = Object.keys(SKILL_COLORS);

export function getSkillColorClass(skill) {
  return SKILL_COLORS[COLOR_KEYS[skill.id % COLOR_KEYS.length]];
}
