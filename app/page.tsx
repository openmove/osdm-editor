"use client"

import { useState, useCallback } from "react"
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"
import { Button } from "@/components/ui/button"
import { CoachCanvas } from "@/components/canvas/CoachCanvas"
import { JsonEditor } from "@/components/editor/JsonEditor"
import { ElementPalette } from "@/components/toolbar/ElementPalette"
import { PropertiesPanel } from "@/components/properties/PropertiesPanel"
import type { CoachLayout, GraphicalElement, CoachDeckLayout, GraphicElement, PlaceLayout, PlaceGroup } from "@/lib/types/osdm"
import { DEFAULT_COACH_WIDTH, DEFAULT_COACH_HEIGHT, ORIENTATION_MAPPING, DEFAULT_ORIENTATION } from "@/lib/types/osdm"
import { Download, Upload, X, Settings, Sofa } from "lucide-react"

// OSDM 4.0.0 compliant default coach deck layout
const defaultCoachDeckLayout: CoachDeckLayout = {
  id: "default-coach-deck",
  name: "Standard Coach Deck",
  dimension: {
    width: DEFAULT_COACH_WIDTH,
    height: DEFAULT_COACH_HEIGHT,
  },
  lowFloorEntry: false,
  deckLevel: "SINGLE_DECK",
  placeGroups: [
    {
      serviceClass: "SECOND_CLASS",
      accommodationType: "SEAT",
      places: [
        {
          number: "1A",
          rectangle: {
            position: { x: 10, y: 5, z: 0 },
            dimension: { width: 3, height: 3 },
          },
          orientation: ORIENTATION_MAPPING["to right"],
        },
        {
          number: "1B",
          rectangle: {
            position: { x: 10, y: 9, z: 0 },
            dimension: { width: 3, height: 3 },
          },
          orientation: ORIENTATION_MAPPING["to left"],
        },
      ],
    },
  ],
  graphicElements: [
    {
      rectangle: {
        position: { x: 15, y: 7, z: 0 },
        dimension: { width: 4, height: 2 },
      },
      orientation: ORIENTATION_MAPPING["top"],
      code: "TABLE",
    },
    {
      rectangle: {
        position: { x: 5, y: 7, z: 0 },
        dimension: { width: 2, height: 4 },
      },
      orientation: ORIENTATION_MAPPING["Right"],
      code: "ENTRY_EXIT",
    },
    {
      rectangle: {
        position: { x: 115, y: 7, z: 0 },
        dimension: { width: 2, height: 4 },
      },
      orientation: ORIENTATION_MAPPING["Left"],
      code: "ENTRY_EXIT",
    },
  ],
};

// Legacy default layout for backward compatibility
const defaultCoachLayout: CoachLayout = {
  id: "default-coach",
  name: "Standard Coach",
  description: "A standard coach layout with basic elements",
  width: DEFAULT_COACH_WIDTH,
  height: DEFAULT_COACH_HEIGHT,
  elements: [
    {
      id: "seat-1",
      code: "SEAT",
      orientation: ORIENTATION_MAPPING["to right"],
      x: 10,
      y: 5,
      size: { width: 3, height: 3 },
      seatNumber: "1A",
    },
    {
      id: "seat-2",
      code: "SEAT",
      orientation: ORIENTATION_MAPPING["to left"],
      x: 10,
      y: 9,
      size: { width: 3, height: 3 },
      seatNumber: "1B",
    },
    {
      id: "table-1",
      code: "TABLE",
      orientation: ORIENTATION_MAPPING["top"],
      x: 15,
      y: 7,
      size: { width: 4, height: 2 },
    },
    {
      id: "door-1",
      code: "ENTRY_EXIT",
      orientation: ORIENTATION_MAPPING["Right"],
      x: 5,
      y: 7,
      size: { width: 2, height: 4 },
    },
    {
      id: "door-2",
      code: "ENTRY_EXIT",
      orientation: ORIENTATION_MAPPING["Left"],
      x: 115,
      y: 7,
      size: { width: 2, height: 4 },
    },
  ],
  metadata: {
    version: "4.0.0",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
}

export default function OSDMEditor() {
  const [coachLayout, setCoachLayout] = useState<CoachLayout>(defaultCoachLayout)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [jsonString, setJsonString] = useState<string>(JSON.stringify(defaultCoachLayout, null, 2))
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [isPropertiesPanelVisible, setIsPropertiesPanelVisible] = useState(true)

  // Sync JSON changes to coach layout
  const handleJsonChange = useCallback((newJson: string) => {
    setJsonString(newJson)
    setJsonError(null) // Clear previous errors

    try {
      // Sanitize the input by removing any problematic control characters
      const sanitizedJson = newJson
        .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters except newlines and tabs
        .replace(/\r\n/g, '\n') // Normalize line endings
        .replace(/\r/g, '\n') // Convert remaining carriage returns to newlines
        .trim() // Remove leading/trailing whitespace

      // Only attempt to parse if the string is not empty
      if (sanitizedJson.length === 0) {
        return
      }

      const parsed = JSON.parse(sanitizedJson)

      // Validate that the parsed object has the expected structure
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.elements)) {
        setCoachLayout(parsed)
      } else {
        setJsonError("Invalid JSON structure: missing required fields")
      }
    } catch (error) {
      // Invalid JSON, keep previous state and show error
      console.error("Invalid JSON:", error)
      setJsonError(error instanceof Error ? error.message : "Invalid JSON syntax")
      // Don't update the layout if JSON is invalid
    }
  }, [])

  // Sync coach layout changes to JSON
  const handleLayoutChange = useCallback((newLayout: CoachLayout) => {
    setCoachLayout(newLayout)
    setJsonString(JSON.stringify(newLayout, null, 2))
    setJsonError(null) // Clear any JSON errors when layout is updated from other sources
  }, [])

  const selectedElement = coachLayout.elements.find((el) => el.id === selectedElementId)

  const handleDeleteElement = useCallback((elementId: string) => {
    const newElements = coachLayout.elements.filter((el) => el.id !== elementId)
    handleLayoutChange({
      ...coachLayout,
      elements: newElements,
    })
    // Clear selection if the deleted element was selected
    if (selectedElementId === elementId) {
      setSelectedElementId(null)
    }
  }, [coachLayout, handleLayoutChange, selectedElementId])

  return (
    <div className="h-screen flex flex-col bg-neutral-50">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-gradient-to-r from-white to-neutral-50 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-300 shadow-md">
              <Sofa className="h-5 w-5 text-neutral-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">OSDM Coach Layout Editor</h1>
              <p className="text-sm text-neutral-600">Design and configure train coach layouts</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-neutral-300 hover:border-lime-300 hover:bg-lime-50 bg-transparent"
            >
              <Upload className="h-4 w-4" />
              Load Template
            </Button>
            <Button size="sm" className="gap-2 bg-lime-300 text-neutral-900 hover:bg-lime-400 shadow-md">
              <Download className="h-4 w-4" />
              Export JSON
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - JSON Editor */}
        <PanelGroup direction="horizontal" className="flex-1">
          <Panel defaultSize={40} minSize={30}>
            <div className="h-full flex flex-col bg-white">
              <div className="border-b border-neutral-200 px-6 py-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-1 w-1 rounded-full ${jsonError ? 'bg-red-400' : 'bg-lime-300'}`}></div>
                    <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">JSON Editor</h2>
                  </div>
                  {jsonError && (
                    <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                      Invalid JSON
                    </div>
                  )}
                </div>
                {jsonError && (
                  <div className="mt-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded border border-red-200">
                    {jsonError}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <JsonEditor value={jsonString} onChange={handleJsonChange} hasError={!!jsonError} />
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-neutral-200 hover:bg-lime-300 transition-colors" />

          {/* Right Panel - Canvas and Tools */}
          <Panel defaultSize={60} minSize={40}>
            <div className="h-full flex flex-col bg-white">
              <div className="border-b border-neutral-200 px-6 py-3 bg-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-1 w-1 rounded-full bg-lime-300"></div>
                  <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">Element Palette</h2>
                </div>
                <ElementPalette
                  onElementSelectAction={(code) => {
                    const newElement: GraphicalElement = {
                      id: `element-${Date.now()}`,
                      code,
                      orientation: DEFAULT_ORIENTATION, // Use default orientation
                      x: coachLayout.width / 2,
                      y: coachLayout.height / 2,
                      size: { width: 2, height: 2 },
                    }
                    handleLayoutChange({
                      ...coachLayout,
                      elements: [...coachLayout.elements, newElement],
                    })
                  }}
                />
              </div>

              <div className="flex-1 flex bg-neutral-50">
                <div className="flex-1 p-6 overflow-auto">
                  <div className="h-full rounded-lg border-2 border-neutral-200 bg-white shadow-sm overflow-hidden">
                    <CoachCanvas
                      layout={coachLayout}
                      onLayoutChange={handleLayoutChange}
                      selectedElementId={selectedElementId}
                      onElementSelect={(id) => {
                        setSelectedElementId(id)
                        if (id) {
                          setIsPropertiesPanelVisible(true)
                        }
                      }}
                    />
                  </div>
                </div>

                {selectedElement && isPropertiesPanelVisible && (
                  <div className="w-80 border-l border-neutral-200 bg-white shadow-lg flex-shrink-0">
                    <div className="border-b border-neutral-200 px-6 py-3 bg-gradient-to-b from-lime-50 to-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-lime-300"></div>
                          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">Properties</h2>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsPropertiesPanelVisible(false)}
                          className="h-6 w-6 p-0 hover:bg-neutral-100"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <PropertiesPanel
                      element={selectedElement}
                      onElementChange={(updatedElement) => {
                        const newElements = coachLayout.elements.map((el) =>
                          el.id === updatedElement.id ? updatedElement : el,
                        )
                        handleLayoutChange({
                          ...coachLayout,
                          elements: newElements,
                        })
                      }}
                      onDeleteElement={handleDeleteElement}
                    />
                  </div>
                )}

                {/* Properties panel toggle button when closed */}
                {selectedElement && !isPropertiesPanelVisible && (
                  <div className="w-12 border-l border-neutral-200 bg-white shadow-lg flex-shrink-0 flex flex-col items-center py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPropertiesPanelVisible(true)}
                      className="h-8 w-8 p-0 hover:bg-neutral-100"
                      title="Show Properties Panel"
                    >
                      <Settings className="h-4 w-4 text-neutral-600" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}
