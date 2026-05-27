import { Progress } from '@/components/ui/progress';

function getColorClasses(value) {
  if (value < 80) return { text: 'text-green-700', bar: 'bg-green-500' };
  if (value < 100) return { text: 'text-amber-700', bar: 'bg-amber-500' };
  return { text: 'text-red-700', bar: 'bg-red-500' };
}

export default function Workload({ value, max }) {
  const { text, bar } = getColorClasses(value);
  return (
    <>
      <label htmlFor="workload" className={text}>
        {value}%
      </label>
      <Progress value={value} max={max} id="workload" indicatorClassName={bar} />
    </>
  );
}
