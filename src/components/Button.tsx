import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'slate' | 'green';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  href, 
  onClick, 
  className = '',
  type = 'button'
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-gray-600 text-white',
    slate: 'bg-slate-400 text-white',
    green: 'bg-green-600 text-white'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const allClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  if (href) {
    return (
      <Link href={href} className={allClasses}>
        {children}
      </Link>
    );
  }
  
  return (
    <button 
      type={type}
      onClick={onClick} 
      className={allClasses}
    >
      {children}
    </button>
  );
}
