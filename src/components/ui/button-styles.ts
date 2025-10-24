export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline';
export type ButtonSize = 'default' | 'large';
export type ButtonShape = 'default' | 'round';

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  className?: string;
}

// Base Tailwind classes
const baseClasses =
  'inline-flex items-center justify-center font-source-sans-pro-semibold text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

// Variant classes
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-bordeaux text-white hover:bg-bordeaux-hover focus:ring-bordeaux shadow-md hover:shadow-lg',
  secondary:
    'bg-white text-bordeaux border-2 border-bordeaux hover:bg-cream focus:ring-bordeaux',
  tertiary:
    'bg-gold text-white hover:bg-gold-light focus:ring-gold shadow-md hover:shadow-lg',
  outline:
    'bg-transparent text-bordeaux border border-bordeaux hover:bg-cream focus:ring-bordeaux',
};

// Size classes
const sizeClasses: Record<ButtonSize, string> = {
  default: 'px-7 py-3.5',
  large: 'px-8 py-4 text-lg',
};

// Shape classes
const shapeClasses: Record<ButtonShape, string> = {
  default: 'rounded-md',
  round: 'rounded-full',
};

export function getButtonClasses(props: ButtonStyleProps): string {
  const appliedVariant = props.variant || 'primary';
  const appliedSize = props.size || 'default';
  const appliedShape = props.shape || 'default';
  const extraClasses = props.className || '';

  return `
    ${baseClasses}
    ${variantClasses[appliedVariant]}
    ${sizeClasses[appliedSize]}
    ${shapeClasses[appliedShape]}
    ${extraClasses}
  `
    .trim()
    .replace(/\s+/g, ' ');
}

export function getIconStyling(props: {
  size?: ButtonSize;
  iconPosition?: 'left' | 'right';
}): { iconSize: number; iconMargin: string } {
  const iconSize = (props.size || 'default') === 'large' ? 20 : 18;
  const iconMargin = (props.iconPosition || 'left') === 'left' ? 'mr-2' : 'ml-2';
  return { iconSize, iconMargin };
}
