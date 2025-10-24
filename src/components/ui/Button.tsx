import { ButtonHTMLAttributes, forwardRef } from 'react';
import Icon from './Icon';
import {
  getButtonClasses,
  getIconStyling,
  ButtonVariant,
  ButtonSize,
  ButtonShape,
} from './button-styles';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  icon?: string;
  iconPosition?: 'left' | 'right';
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'default',
      shape = 'default',
      icon,
      iconPosition = 'left',
      type = 'button',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const finalClasses = getButtonClasses({ variant, size, shape, className });
    const { iconSize, iconMargin } = getIconStyling({ size, iconPosition });

    return (
      <button ref={ref} type={type} className={finalClasses} {...props}>
        {icon && iconPosition === 'left' && (
          <Icon name={icon} size={iconSize} className={iconMargin} />
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <Icon name={icon} size={iconSize} className={iconMargin} />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
