import { Progress } from '@/components/ui/progress';

function getColorClasses(value) {
  if (value < 30) return { text: 'text-yellow-500', bar: 'bg-yellow-500' };
  if (value <= 60) return { text: 'text-green-600', bar: 'bg-green-500' };
  if (value <= 80) return { text: 'text-yellow-500', bar: 'bg-yellow-500' };
  return { text: 'text-red-600', bar: 'bg-red-500' };
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
