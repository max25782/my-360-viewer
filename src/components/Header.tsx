import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  variant?: 'default' | 'transparent';
  className?: string;
}

export default function Header({ variant = 'default', className = '' }: HeaderProps) {
  const baseClasses = variant === 'transparent' 
    ? 'bg-slate-400 bg-opacity-90 backdrop-blur-sm shadow-sm'
    : 'bg-slate-500 bg-opacity-90 backdrop-blur-sm shadow-sm';

  return (
    <header className={`${baseClasses} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/Website.png" 
                alt="Seattle ADU Logo" 
                width={250} 
                height={150}
                className="h-30 w-auto"
                priority
              />
            </Link>
          </div>
          <nav className="hidden md:flex text-2xl space-x-8">
            <Link href="/" className="text-gray-900 hover:text-gray-900 font-bold">ADU Catalog</Link>
            <Link href="/neo" className="text-gray-900 hover:text-gray-900 font-bold">Neo</Link>
            <Link href="/category/skyline" className="text-gray-900 hover:text-gray-900 font-bold">Skyline</Link>
            <Link href="/premium" className="text-gray-900 hover:text-gray-900 font-bold">Premium</Link>
            <a href="#about" className="text-gray-900 hover:text-gray-900 font-bold">About</a>
            <a href="#contact" className="text-gray-900 hover:text-gray-900 font-bold">Contact</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
