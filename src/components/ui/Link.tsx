import { AnchorHTMLAttributes, forwardRef } from 'react';
import NextLink from 'next/link';
import Icon from './Icon';
import {
  getButtonClasses,
  getIconStyling,
  ButtonVariant,
  ButtonSize,
  ButtonShape,
} from './button-styles';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  icon?: string;
  iconPosition?: 'left' | 'right';
  className?: string;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      href,
      variant = 'primary',
      size = 'default',
      shape = 'default',
      icon,
      iconPosition = 'left',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const finalClasses = getButtonClasses({ variant, size, shape, className });
    const { iconSize, iconMargin } = getIconStyling({ size, iconPosition });

    return (
      <NextLink
        href={href}
        ref={ref}
        className={finalClasses}
        role="button"
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <Icon name={icon} size={iconSize} className={iconMargin} />
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <Icon name={icon} size={iconSize} className={iconMargin} />
        )}
      </NextLink>
    );
  }
);

Link.displayName = 'Link';

export default Link;
