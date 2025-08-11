import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <div className={`bg-slate-700 bg-opacity-90 ${className}`}>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            {items.map((item, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <span className="text-gray-400 mr-4">/</span>
                )}
                {item.href ? (
                  <Link 
                    href={item.href} 
                    className="text-gray-500 text-2xl hover:text-gray-700 font-bold"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-bold text-2xl">
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
