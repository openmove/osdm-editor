"use client"

import type { GraphicalElement, Orientation } from "@/lib/types/osdm"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import { DEGREE_TO_ORIENTATION, ORIENTATION_MAPPING, DEFAULT_ORIENTATION } from "@/lib/types/osdm"

interface PropertiesPanelProps {
  element: GraphicalElement
  onElementChange: (element: GraphicalElement) => void
  onDeleteElement: (elementId: string) => void
}

export function PropertiesPanel({ element, onElementChange, onDeleteElement }: PropertiesPanelProps) {
  const handleChange = (field: keyof GraphicalElement, value: string | number | { width: number; height: number }) => {
    onElementChange({ ...element, [field]: value })
  }

  // Convert orientation degrees to display string
  const getOrientationDisplayValue = (orientation: Orientation): string => {
    return DEGREE_TO_ORIENTATION[orientation] || `${orientation}°`;
  }

  // Convert orientation string back to degrees
  const getOrientationFromString = (orientationString: string): Orientation => {
    return ORIENTATION_MAPPING[orientationString] || DEFAULT_ORIENTATION;
  }

  // Get current orientation or default
  const currentOrientation = element.orientation ?? DEFAULT_ORIENTATION;

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">Element ID</Label>
        <Input
          value={element.id}
          onChange={(e) => handleChange("id", e.target.value)}
          className="border-neutral-300 focus:border-lime-300 focus:ring-lime-300"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">Type</Label>
        <Input value={element.code} disabled className="bg-neutral-50" />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">Orientation</Label>
        <Select
          value={getOrientationDisplayValue(currentOrientation)}
          onValueChange={(value: string) => handleChange("orientation", getOrientationFromString(value))}
        >
          <SelectTrigger className="border-neutral-300 focus:border-lime-300 focus:ring-lime-300 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="to right">To Right (0°)</SelectItem>
            <SelectItem value="to left">To Left (180°)</SelectItem>
            <SelectItem value="up">Up (270°)</SelectItem>
            <SelectItem value="bottom">Bottom (90°)</SelectItem>
            <SelectItem value="Right">Right (0°)</SelectItem>
            <SelectItem value="Left">Left (180°)</SelectItem>
            <SelectItem value="Top">Top (270°)</SelectItem>
            <SelectItem value="Bottom">Bottom (90°)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">Orientation (Degrees)</Label>
        <Input
          type="number"
          value={currentOrientation}
          onChange={(e) => handleChange("orientation", Number.parseInt(e.target.value) || DEFAULT_ORIENTATION)}
          min="0"
          max="359"
          className="border-neutral-300 focus:border-lime-300 focus:ring-lime-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">X Position</Label>
          <Input
            type="number"
            value={element.x}
            onChange={(e) => handleChange("x", Number.parseFloat(e.target.value))}
            className="border-neutral-300 focus:border-lime-300 focus:ring-lime-300"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">Y Position</Label>
          <Input
            type="number"
            value={element.y}
            onChange={(e) => handleChange("y", Number.parseFloat(e.target.value))}
            className="border-neutral-300 focus:border-lime-300 focus:ring-lime-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">Width</Label>
          <Input
            type="number"
            value={element.size?.width || 1}
            onChange={(e) => handleChange("size", {
              width: Number.parseFloat(e.target.value) || 1,
              height: element.size?.height || 1
            })}
            className="border-neutral-300 focus:border-lime-300 focus:ring-lime-300"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">Height</Label>
          <Input
            type="number"
            value={element.size?.height || 1}
            onChange={(e) => handleChange("size", {
              width: element.size?.width || 1,
              height: Number.parseFloat(e.target.value) || 1
            })}
            className="border-neutral-300 focus:border-lime-300 focus:ring-lime-300"
          />
        </div>
      </div>

      {element.code === "SEAT" && (
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">Seat Number</Label>
          <Input
            value={element.seatNumber || ""}
            onChange={(e) => handleChange("seatNumber", e.target.value)}
            placeholder="e.g., 1A"
            className="border-neutral-300 focus:border-lime-300 focus:ring-lime-300"
          />
        </div>
      )}

      <div className="pt-4 border-t border-neutral-200">
        <Button
          variant="destructive"
          size="sm"
          className="w-full gap-2"
          onClick={() => onDeleteElement(element.id)}
        >
          <Trash2 className="h-4 w-4" />
          Delete Element
        </Button>
      </div>
    </div>
  )
}
