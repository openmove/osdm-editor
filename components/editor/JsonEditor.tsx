"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
  hasError?: boolean
}

export function JsonEditor({ value, onChange, hasError = false }: JsonEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = value
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    onChange(value)
  }

  return (
    <div className="h-full relative">
      <textarea
        ref={textareaRef}
        onChange={handleChange}
        className={`w-full h-full p-6 font-mono text-sm resize-none focus:outline-none border-0 ${
          hasError
            ? 'bg-red-50 text-red-900 focus:bg-red-100 border-l-4 border-red-400'
            : 'bg-neutral-50 text-neutral-900 focus:bg-white'
        }`}
        spellCheck={false}
        defaultValue={value}
      />
    </div>
  )
}
