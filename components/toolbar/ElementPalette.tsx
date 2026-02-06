"use client"

import type React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { GraphicalElementCode } from "@/lib/types/osdm"
import { ELEMENT_CATEGORIES } from "@/lib/constants/elements"
import {
  Armchair,
  Bed,
  Table,
  Square,
  DoorOpen,
  Toilet,
  Luggage,
  Bike,
  Star,
  Wifi,
  Accessibility,
  Search
} from "lucide-react"

interface ElementPaletteProps {
  onElementSelectAction: (code: GraphicalElementCode) => void
}

export function ElementPalette({ onElementSelectAction }: ElementPaletteProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Armchair":
        return <Armchair className="h-4 w-4" />
      case "Bed":
        return <Bed className="h-4 w-4" />
      case "Table":
        return <Table className="h-4 w-4" />
      case "Square":
        return <Square className="h-4 w-4" />
      case "DoorOpen":
        return <DoorOpen className="h-4 w-4" />
      case "Wc":
        return <Toilet className="h-4 w-4" />
      case "Luggage":
        return <Luggage className="h-4 w-4" />
      case "Bike":
        return <Bike className="h-4 w-4" />
      case "Star":
        return <Star className="h-4 w-4" />
      case "Wifi":
        return <Wifi className="h-4 w-4" />
      case "Wheelchair":
        return <Accessibility className="h-4 w-4" />
      default:
        return <Square className="h-4 w-4" />
    }
  }

  // Flatten all elements and filter by search term
  const allElements = ELEMENT_CATEGORIES.flatMap(category => category.elements)
  const filteredElements = allElements.filter(element =>
    element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    element.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex items-center gap-3 h-12">
      {/* Horizontal Element Grid with Scroll */}
      <div className="flex-1 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 min-w-max px-1">
          {filteredElements.map((element) => (
            <Button
              key={element.code}
              variant="outline"
              size="sm"
              onClick={() => onElementSelectAction(element.code)}
              className="gap-2 border-neutral-300 hover:border-lime-300 hover:bg-lime-50 hover:text-neutral-900 whitespace-nowrap flex-shrink-0"
            >
              {getIconComponent(element.icon)}
              {element.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Fixed Search Bar on the Right */}
      <div className="relative w-64 flex-shrink-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input
          placeholder="Search elements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-neutral-300 focus:border-lime-300 focus:ring-lime-300 h-10"
        />
      </div>
    </div>
  )
}
