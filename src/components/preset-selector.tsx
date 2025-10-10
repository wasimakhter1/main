"use client"
import * as React from "react"
import { PRESETS, type Preset } from "@/lib/constants"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type PresetSelectorProps = {
  onSelect: (preset: Preset) => void
  onClear: () => void
  disabled: boolean
  value?: string
}

export default function PresetSelector({
  onSelect,
  onClear,
  disabled,
  value,
}: PresetSelectorProps) {
  const categories = [...new Set(PRESETS.map((p) => p.category))]

  const handleSelect = (value: string) => {
    const preset = PRESETS.find((p) => p.name === value)
    if (preset) {
      onSelect(preset)
    }
  }

  return (
    <div className="relative">
      <Select
        onValueChange={handleSelect}
        disabled={disabled}
        value={value || ""}
      >
        <SelectTrigger className="w-full" id="presets">
          <SelectValue placeholder="Select a preset..." />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectGroup key={category}>
              <SelectLabel>{category}</SelectLabel>
              {PRESETS.filter((p) => p.category === category).map((preset) => (
                <SelectItem key={preset.name} value={preset.name}>
                  {preset.name} ({preset.width} x {preset.height})
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute right-10 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:bg-transparent",
          !value && "hidden"
        )}
        onClick={onClear}
        disabled={disabled}
        aria-label="Clear preset"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
