'use client';
import { PRESETS, type Preset } from '@/lib/constants';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type PresetSelectorProps = {
  onSelect: (preset: Preset) => void;
  disabled: boolean;
};

export default function PresetSelector({ onSelect, disabled }: PresetSelectorProps) {
  const categories = [...new Set(PRESETS.map((p) => p.category))];

  const handleSelect = (value: string) => {
    const preset = PRESETS.find((p) => p.name === value);
    if (preset) {
      onSelect(preset);
    }
  };

  return (
    <Select onValueChange={handleSelect} disabled={disabled}>
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
  );
}
