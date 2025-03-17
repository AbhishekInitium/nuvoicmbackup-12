
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionPanelProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  id?: string;
  badge?: React.ReactNode;
}

const SectionPanel: React.FC<SectionPanelProps> = ({
  title,
  children,
  defaultExpanded = false,
  className,
  headerClassName,
  contentClassName,
  id,
  badge
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(expanded ? contentRef.current.scrollHeight : 0);
    }
  }, [expanded, children]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div 
      className={cn(
        'glass-panel overflow-hidden mb-6',
        className
      )}
      id={id}
    >
      <div
        className={cn(
          'section-header',
          expanded ? 'bg-app-blue-light text-app-blue' : 'bg-app-gray-50 text-app-gray-700',
          headerClassName
        )}
        onClick={toggleExpand}
      >
        <div className="flex items-center">
          <h3 className="text-lg font-medium">{title}</h3>
          {badge && <div className="ml-3">{badge}</div>}
        </div>
        <ChevronDown 
          className={cn(
            'transition-transform duration-300',
            expanded ? 'rotate-180' : 'rotate-0'
          )}
          size={20} 
        />
      </div>
      
      <div 
        className={cn(
          'overflow-hidden transition-all duration-300 ease-apple',
          expanded ? 'opacity-100' : 'opacity-0'
        )}
        style={{ height: expanded ? contentHeight : 0 }}
      >
        <div 
          ref={contentRef} 
          className={cn('p-6', contentClassName)}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default SectionPanel;
