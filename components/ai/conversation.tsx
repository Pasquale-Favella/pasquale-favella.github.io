"use client";

import { cn } from "@/utils";

import type { ComponentProps } from "react";
import { useCallback } from "react";
import { VscArrowDown } from "react-icons/vsc";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";

export type ConversationProps = ComponentProps<typeof StickToBottom>;

export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom
    className={cn("relative flex-1 overflow-y-auto", className)}
    initial="smooth"
    resize="smooth"
    role="log"
    {...props}
  />
);

export type ConversationContentProps = ComponentProps<
  typeof StickToBottom.Content
>;

export const ConversationContent = ({
  className,
  ...props
}: ConversationContentProps) => (
  <StickToBottom.Content className={cn("p-4", className)} {...props} />
);

export type ConversationScrollButtonProps = ComponentProps<"button">;

export const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  return (
    !isAtBottom && (
      <button
        className={cn(
          "absolute bottom-4 left-[50%] translate-x-[-50%] btn btn-circle",
          className,
        )}
        onClick={handleScrollToBottom}
        type="button"
        {...props}
      >
        <VscArrowDown className="size-4" />
      </button>
    )
  );
};
