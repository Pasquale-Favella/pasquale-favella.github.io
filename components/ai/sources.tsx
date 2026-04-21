'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/collapsible';
import { cn } from '@/utils';

import type { ComponentProps } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import { RiFileInfoLine } from 'react-icons/ri';

export type SourcesProps = ComponentProps<'div'>;

export const Sources = ({ className, ...props }: SourcesProps) => (
  <Collapsible
    className={cn('not-prose mb-4 text-primary text-xs', className)}
    {...props}
  />
);

export type SourcesTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  count: number;
};

export const SourcesTrigger = ({
  className,
  count,
  children,
  ...props
}: SourcesTriggerProps) => (
  <CollapsibleTrigger
    className={cn('flex items-center gap-2', className)}
    {...props}
  >
    {children ?? (
      <>
        <p className="font-medium">Used {count} sources</p>
        <BiChevronDown className="h-4 w-4" />
      </>
    )}
  </CollapsibleTrigger>
);

export type SourcesContentProps = ComponentProps<typeof CollapsibleContent>;

export const SourcesContent = ({
  className,
  ...props
}: SourcesContentProps) => (
  <CollapsibleContent
    className={cn(
      'mt-3 flex w-fit flex-col gap-2',
      'data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in',
      className,
    )}
    {...props}
  />
);

export type SourceProps = ComponentProps<'span'>;

export const Source = ({ title, children, ...props }: SourceProps) => (
  <span
    className="flex items-center gap-2"
    {...props}
  >
    {children ?? (
      <>
        <RiFileInfoLine className="h-4 w-4" />
        <span className=" font-medium">{title}</span>
      </>
    )}
  </span>
);
