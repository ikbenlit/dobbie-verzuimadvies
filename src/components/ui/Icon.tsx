import { icons, LucideProps } from 'lucide-react';
import { ComponentType } from 'react';
import { cn } from '@/lib/utils/cn';

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: string;
  className?: string;
}

export default function Icon({ name, className, ...props }: IconProps) {
  // Get the icon component from lucide-react
  const LucideIcon = icons[name as keyof typeof icons] as ComponentType<LucideProps>;

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react library.`);
    return (
      <span
        className="text-transparent text-xs"
        aria-label={`Icon ${name} not found`}
      />
    );
  }

  return (
    <LucideIcon
      className={cn(className)}
      aria-hidden="true"
      {...props}
    />
  );
}
