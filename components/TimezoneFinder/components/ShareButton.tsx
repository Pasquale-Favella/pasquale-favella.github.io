import { useCallback } from 'react'
import { FiClipboard } from 'react-icons/fi'

interface ShareButtonProps {
  disabled?: boolean
}

export default function ShareButton({ disabled }: ShareButtonProps) {
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(window.location.href)
  }, [])

  if (disabled) return null

  return (
    <button
      onClick={handleCopy}
      className="btn btn-ghost btn-sm border border-base-300"
      title="Copy shareable link"
    >
      <FiClipboard className="w-4 h-4" /> Copy Link
    </button>
  )
}
