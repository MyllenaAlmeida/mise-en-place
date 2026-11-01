import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-sans font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-ivory-50 hover:shadow-glow hover:scale-105 focus:ring-burgundy-500',
      secondary: 'bg-gradient-to-r from-gold-400 to-gold-500 text-charcoal-900 hover:shadow-soft hover:scale-105 focus:ring-gold-400',
      ghost: 'bg-transparent text-burgundy-600 hover:bg-burgundy-50 hover:shadow-soft focus:ring-burgundy-500',
      icon: 'bg-transparent text-burgundy-600 hover:bg-burgundy-50 hover:shadow-soft focus:ring-burgundy-500 p-2',
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
