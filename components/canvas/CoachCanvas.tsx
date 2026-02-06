"use client"

import React, { useRef, useState, useCallback } from "react"
import type { CoachLayout, GraphicalElement, GraphicalElementCode, Orientation } from "@/lib/types/osdm"
import { getElementByCode } from "@/lib/constants/elements"
import { DEGREE_TO_ORIENTATION, DEFAULT_ORIENTATION } from "@/lib/types/osdm"
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
  RotateCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface CoachCanvasProps {
  layout: CoachLayout
  onLayoutChange: (layout: CoachLayout) => void
  selectedElementId: string | null
  onElementSelect: (id: string | null) => void
}

export function CoachCanvas({ layout, onLayoutChange, selectedElementId, onElementSelect }: CoachCanvasProps) {
  const tableRef = useRef<HTMLTableElement>(null)
  const [isVerticalView, setIsVerticalView] = useState(false)

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false)
  const [draggedElement, setDraggedElement] = useState<GraphicalElement | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 })

  // Resize state
  const [isResizing, setIsResizing] = useState(false)
  const [resizedElement, setResizedElement] = useState<GraphicalElement | null>(null)
  const [resizeHandle, setResizeHandle] = useState<string>('')
  const [resizeStartSize, setResizeStartSize] = useState({ width: 0, height: 0 })
  const [resizeStartPosition, setResizeStartPosition] = useState({ x: 0, y: 0 })

  const cellSize = 24 // Fixed square cell size in pixels

  const getElementSize = (element: GraphicalElement) => {
    // Use element.size if available, otherwise fallback to defaults
    if (element.size) {
      return { width: element.size.width, height: element.size.height }
    }

    // Fallback to code-based defaults
    switch (element.code) {
      case "SEAT":
        return { width: 3, height: 3 }
      case "TABLE":
        return { width: 4, height: 2 }
      case "ENTRY_EXIT":
        return { width: 2, height: 4 }
      case "TOILET_AREA":
        return { width: 3, height: 3 }
      case "LUGGAGE_AREA":
        return { width: 4, height: 3 }
      case "STAIR_UPWARDS_AREA":
        return { width: 3, height: 4 }
      default:
        return { width: 2, height: 2 }
    }
  }

  const handleElementClick = (elementId: string) => {
    onElementSelect(elementId)
  }

  // Convert pixel coordinates to grid coordinates
  const pixelToGrid = useCallback((pixelX: number, pixelY: number) => {
    const rect = tableRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }

    // Account for the 16px padding (p-4 = 1rem = 16px)
    const padding = 16
    const relativeX = pixelX - rect.left - padding
    const relativeY = pixelY - rect.top - padding

    return {
      x: Math.floor(relativeX / cellSize),
      y: Math.floor(relativeY / cellSize)
    }
  }, [cellSize])

  // Handle drag start
  const handleMouseDown = useCallback((e: React.MouseEvent, element: GraphicalElement) => {
    e.preventDefault()
    e.stopPropagation()

    const rect = tableRef.current?.getBoundingClientRect()
    if (!rect) return

    const elementRect = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - elementRect.left
    const offsetY = e.clientY - elementRect.top

    setDraggedElement(element)
    setDragOffset({ x: offsetX, y: offsetY })
    setDragPosition({ x: e.clientX, y: e.clientY })
    setIsDragging(true)
    onElementSelect(element.id)
  }, [onElementSelect])

  // Handle drag move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !draggedElement) return

    setDragPosition({ x: e.clientX, y: e.clientY })
  }, [isDragging, draggedElement])

  // Handle drag end
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isDragging || !draggedElement) return

    const gridPos = pixelToGrid(e.clientX, e.clientY)
    const elementSize = getElementSize(draggedElement)

    // Ensure element stays within bounds
    const newX = Math.max(0, Math.min(gridPos.x, layout.width - elementSize.width))
    const newY = Math.max(0, Math.min(gridPos.y, layout.height - elementSize.height))

    // Check for collisions with other elements
    const hasCollision = layout.elements.some(el => {
      if (el.id === draggedElement.id) return false

      const elSize = getElementSize(el)
      return !(newX >= el.x + elSize.width ||
               newX + elementSize.width <= el.x ||
               newY >= el.y + elSize.height ||
               newY + elementSize.height <= el.y)
    })

    // Only update position if no collision
    if (!hasCollision) {
      const updatedElements = layout.elements.map(el =>
        el.id === draggedElement.id
          ? { ...el, x: newX, y: newY }
          : el
      )

      onLayoutChange({
        ...layout,
        elements: updatedElements
      })
    }

    setIsDragging(false)
    setDraggedElement(null)
  }, [isDragging, draggedElement, layout, onLayoutChange, pixelToGrid])

  // Handle resize start
  const handleResizeStart = useCallback((e: React.MouseEvent, element: GraphicalElement, handle: string) => {
    e.preventDefault()
    e.stopPropagation()

    const elementSize = getElementSize(element)
    setResizedElement(element)
    setResizeHandle(handle)
    setResizeStartSize({ width: elementSize.width, height: elementSize.height })
    setResizeStartPosition({ x: element.x, y: element.y })
    setIsResizing(true)
    onElementSelect(element.id)
  }, [onElementSelect])

  // Handle resize move
  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizedElement) return

    const gridPos = pixelToGrid(e.clientX, e.clientY)
    const deltaX = gridPos.x - resizedElement.x
    const deltaY = gridPos.y - resizedElement.y

    let newWidth = resizeStartSize.width
    let newHeight = resizeStartSize.height
    let newX = resizeStartPosition.x
    let newY = resizeStartPosition.y

    // Calculate new dimensions based on resize handle
    switch (resizeHandle) {
      case 'se': // Southeast (bottom-right)
        newWidth = Math.max(1, resizeStartSize.width + deltaX)
        newHeight = Math.max(1, resizeStartSize.height + deltaY)
        break
      case 'sw': // Southwest (bottom-left)
        newWidth = Math.max(1, resizeStartSize.width - deltaX)
        newHeight = Math.max(1, resizeStartSize.height + deltaY)
        newX = resizeStartPosition.x + deltaX
        break
      case 'ne': // Northeast (top-right)
        newWidth = Math.max(1, resizeStartSize.width + deltaX)
        newHeight = Math.max(1, resizeStartSize.height - deltaY)
        newY = resizeStartPosition.y + deltaY
        break
      case 'nw': // Northwest (top-left)
        newWidth = Math.max(1, resizeStartSize.width - deltaX)
        newHeight = Math.max(1, resizeStartSize.height - deltaY)
        newX = resizeStartPosition.x + deltaX
        newY = resizeStartPosition.y + deltaY
        break
    }

    // Ensure element stays within bounds
    newX = Math.max(0, Math.min(newX, layout.width - newWidth))
    newY = Math.max(0, Math.min(newY, layout.height - newHeight))
    newWidth = Math.min(newWidth, layout.width - newX)
    newHeight = Math.min(newHeight, layout.height - newY)

    // Check for collisions with other elements
    const hasCollision = layout.elements.some(el => {
      if (el.id === resizedElement.id) return false

      const elSize = getElementSize(el)
      return !(newX >= el.x + elSize.width ||
               newX + newWidth <= el.x ||
               newY >= el.y + elSize.height ||
               newY + newHeight <= el.y)
    })

    // Only update if no collision and valid size
    if (!hasCollision && newWidth >= 1 && newHeight >= 1) {
      const updatedElements = layout.elements.map(el =>
        el.id === resizedElement.id
          ? {
              ...el,
              x: newX,
              y: newY,
              size: { width: newWidth, height: newHeight }
            }
          : el
      )

      onLayoutChange({
        ...layout,
        elements: updatedElements
      })
    }
  }, [isResizing, resizedElement, resizeHandle, resizeStartSize, resizeStartPosition, layout, onLayoutChange, pixelToGrid])

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false)
    setResizedElement(null)
    setResizeHandle('')
  }, [])

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Add global mouse event listeners for resize
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove)
      document.addEventListener('mouseup', handleResizeEnd)

      return () => {
        document.removeEventListener('mousemove', handleResizeMove)
        document.removeEventListener('mouseup', handleResizeEnd)
      }
    }
  }, [isResizing, handleResizeMove, handleResizeEnd])

  const getElementColor = (code: string) => {
    switch (code) {
      case "SEAT":
        return "bg-blue-500"
      case "TABLE":
        return "bg-amber-500"
      case "ENTRY_EXIT":
        return "bg-lime-300"
      case "TOILET_AREA":
        return "bg-purple-500"
      case "LUGGAGE_AREA":
        return "bg-gray-500"
      case "STAIR_UPWARDS_AREA":
        return "bg-orange-500"
      default:
        return "bg-gray-400"
    }
  }

  const getElementColorHex = (code: string) => {
    switch (code) {
      case "SEAT":
        return "#3b82f6" // blue-500
      case "TABLE":
        return "#f59e0b" // amber-500
      case "ENTRY_EXIT":
        return "#bef264" // lime-300
      case "TOILET_AREA":
        return "#a855f7" // purple-500
      case "LUGGAGE_AREA":
        return "#6b7280" // gray-500
      case "STAIR_UPWARDS_AREA":
        return "#f97316" // orange-500
      default:
        return "#9ca3af" // gray-400
    }
  }

  const getIconComponent = (code: string) => {
    const elementInfo = getElementByCode(code as GraphicalElementCode)
    const iconName = elementInfo?.icon || "Square"

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


  const getRotationAngle = (orientation: Orientation): number => {
    // Convert orientation degrees to CSS rotation angle for content alignment
    // The content should be rotated to align with the orientation direction
    const currentOrientation = orientation ?? DEFAULT_ORIENTATION;
    const normalizedDegrees = ((currentOrientation % 360) + 360) % 360;

    // For proper text alignment with orientation:
    // 0° (to right): content reads bottom to top → rotate -90° (anticlockwise)
    // 90° (bottom): content reads left to right → rotate 0°
    // 180° (to left): content reads top to bottom → rotate 90°
    // 270° (up): content reads right to left → rotate 180°

    switch (normalizedDegrees) {
      case 0: return -90;   // to right: bottom to top
      case 90: return 0;    // bottom: left to right
      case 180: return 90;  // to left: top to bottom
      case 270: return 180; // up: right to left
      default: return -90;  // default to "to right" alignment
    }
  }

  const getOrientationArrow = (orientation: Orientation): string => {
    // Convert degrees to arrow symbol
    const currentOrientation = orientation ?? DEFAULT_ORIENTATION;
    const normalizedDegrees = ((currentOrientation % 360) + 360) % 360;

    if (normalizedDegrees === 0) return "→";
    if (normalizedDegrees === 90) return "↓";
    if (normalizedDegrees === 180) return "←";
    if (normalizedDegrees === 270) return "↑";

    // For other angles, show the degree value
    return `${normalizedDegrees}°`;
  }

  const shouldShowOrientationArrow = (orientation: Orientation): boolean => {
    // Always show orientation arrow to help users understand element direction
    return true;
  }

  const getOrientationArrowStyle = (orientation: Orientation): string => {
    const currentOrientation = orientation ?? DEFAULT_ORIENTATION;
    const normalizedDegrees = ((currentOrientation % 360) + 360) % 360;
    // Make default orientation (0°) more subtle
    if (normalizedDegrees === 0) {
      return "absolute top-1 right-1 text-xs font-bold text-white bg-black bg-opacity-50 rounded px-1";
    }
    return "absolute top-1 right-1 text-xs font-bold text-white bg-black bg-opacity-70 rounded px-1";
  }

  return (
    <div className="relative w-full h-full bg-neutral-50 overflow-auto">
      {/* Vertical/Horizontal Toggle Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVerticalView(!isVerticalView)}
          className="gap-2 bg-white shadow-md"
        >
          <RotateCcw className="h-4 w-4" />
          {isVerticalView ? "Horizontal" : "Vertical"}
        </Button>
      </div>

      <div
        className={`relative w-full h-full flex items-center justify-center p-4 ${isVerticalView ? 'flex-col' : ''}`}
        style={{
          transform: isVerticalView ? "rotate(90deg)" : "none",
          transformOrigin: "center",
        }}
      >
        <div className="max-w-full max-h-full overflow-auto p-4">
          <table
            ref={tableRef}
            className="border-collapse bg-white border-2 border-dashed border-neutral-300 mx-auto"
            style={{
              width: `${layout.width * cellSize}px`,
              height: `${layout.height * cellSize}px`,
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
          <tbody>
            {Array.from({ length: layout.height }, (_, row) => (
              <tr key={row}>
                {Array.from({ length: layout.width }, (_, col) => {
                  // Find element that occupies this cell
                  const element = layout.elements.find(el => {
                    const size = getElementSize(el)
                    return el.x <= col && col < el.x + size.width &&
                           el.y <= row && row < el.y + size.height
                  })

                  const isElementTopLeft = element && element.x === col && element.y === row
                  const isSelected = element?.id === selectedElementId

                  return (
                    <td
                      key={`${row}-${col}`}
                      className={`
                        border border-neutral-200 relative
                        ${element ? 'cursor-pointer' : ''}
                      `}
                      style={{
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        minWidth: `${cellSize}px`,
                        minHeight: `${cellSize}px`,
                        maxWidth: `${cellSize}px`,
                        maxHeight: `${cellSize}px`,
                        padding: 0,
                        aspectRatio: '1 / 1',
                      }}
                      onClick={() => {
                        if (element && !isDragging && !isResizing) {
                          handleElementClick(element.id)
                        }
                      }}
                      onMouseDown={(e) => {
                        if (element && !isResizing) {
                          handleMouseDown(e, element)
                        }
                      }}
                    >
                      {isElementTopLeft && element && (
                        <div
                          className={`
                            absolute inset-0 flex items-center justify-center text-white rounded-sm shadow-md transition-all
                            ${getElementColor(element.code)}
                            ${isSelected ? "ring-4 ring-lime-300 ring-offset-2 scale-105" : "hover:scale-105"}
                            ${isDragging && draggedElement?.id === element.id ? "opacity-30" : ""}
                          `}
                          style={{
                            width: `${getElementSize(element).width * cellSize}px`,
                            height: `${getElementSize(element).height * cellSize}px`,
                          }}
                        >
                          {/* Rotated content container */}
                          <div
                            className="flex flex-col items-center justify-center"
                            style={{
                              transform: `rotate(${getRotationAngle(element.orientation)}deg)`,
                            }}
                          >
                            {getIconComponent(element.code)}
                            {element.code === "SEAT" && element.seatNumber && (
                              <div className="text-xs font-bold text-white mt-1">
                                {element.seatNumber}
                              </div>
                            )}
                          </div>

                          {/* Orientation arrow label */}
                          {shouldShowOrientationArrow(element.orientation) && (
                            <div className={getOrientationArrowStyle(element.orientation)}>
                              {getOrientationArrow(element.orientation)}
                            </div>
                          )}

                          {/* Resize handles - only show for selected elements */}
                          {isSelected && (
                            <>
                              {/* Corner resize handles */}
                              <div
                                className="absolute w-2 h-2 bg-white border border-gray-400 cursor-nw-resize hover:bg-gray-100"
                                style={{ top: -4, left: -4 }}
                                onMouseDown={(e) => handleResizeStart(e, element, 'nw')}
                              />
                              <div
                                className="absolute w-2 h-2 bg-white border border-gray-400 cursor-ne-resize hover:bg-gray-100"
                                style={{ top: -4, right: -4 }}
                                onMouseDown={(e) => handleResizeStart(e, element, 'ne')}
                              />
                              <div
                                className="absolute w-2 h-2 bg-white border border-gray-400 cursor-sw-resize hover:bg-gray-100"
                                style={{ bottom: -4, left: -4 }}
                                onMouseDown={(e) => handleResizeStart(e, element, 'sw')}
                              />
                              <div
                                className="absolute w-2 h-2 bg-white border border-gray-400 cursor-se-resize hover:bg-gray-100"
                                style={{ bottom: -4, right: -4 }}
                                onMouseDown={(e) => handleResizeStart(e, element, 'se')}
                              />
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Dragging preview */}
      {isDragging && draggedElement && (
        <div
          className="fixed pointer-events-none z-50 flex items-center justify-center text-white rounded-sm shadow-lg opacity-80 relative"
          style={{
            left: dragPosition.x - dragOffset.x,
            top: dragPosition.y - dragOffset.y,
            width: `${getElementSize(draggedElement).width * cellSize}px`,
            height: `${getElementSize(draggedElement).height * cellSize}px`,
            backgroundColor: getElementColorHex(draggedElement.code),
          }}
        >
          <div
            className="flex flex-col items-center justify-center"
            style={{
              transform: `rotate(${getRotationAngle(draggedElement.orientation)}deg)`,
            }}
          >
            {getIconComponent(draggedElement.code)}
            {draggedElement.code === "SEAT" && draggedElement.seatNumber && (
              <div className="text-xs font-bold text-white mt-1">
                {draggedElement.seatNumber}
              </div>
            )}
          </div>

          {/* Orientation arrow for dragging preview */}
          <div className={getOrientationArrowStyle(draggedElement.orientation)}>
            {getOrientationArrow(draggedElement.orientation)}
          </div>
        </div>
      )}
    </div>
  )
}
