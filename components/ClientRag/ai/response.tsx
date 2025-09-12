"use client";

import { memo, useMemo } from "react";
import { cn } from "@/utils";

import md from 'markdown-it';
import highlightjs from 'markdown-it-highlightjs';
import codecopy from 'markdown-it-code-copy'

export const Response = memo(
  function Response({responseText = '', className}: {className?: string,responseText?: string}) {

      const responseContent = useMemo(()=> md().use(highlightjs).use(codecopy,{
          buttonClass : 'btn btn-ghost btn-circle btn-sm',
          iconClass : 'fa fa-solid fa-clone text-neutral-content'
        }).render(responseText) , [responseText]);

    return (
      <div
        className={cn(
          'size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 prose',
          className,
        )}
        dangerouslySetInnerHTML={{ __html: responseContent }} 
      />
    );
  },
  (prevProps, nextProps) => prevProps.responseText === nextProps.responseText,
);
