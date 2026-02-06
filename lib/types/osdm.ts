// OSDM 4.0.0 Types - Based on UIC 90918-10 specification

// Orientation is now an integer representing degrees (0-359)
export type Orientation = number;

// Default orientation constant
export const DEFAULT_ORIENTATION: Orientation = 0; // "to right"

// Grid position in 3D space
export interface GridPosition {
  x: number; // integer, format: int32
  y: number; // integer, format: int32
  z: number; // integer, format: int32
}

// Grid dimension with optional border radius
export interface GridDimension {
  width: number; // integer, format: int32
  height: number; // integer, format: int32
  borderRadius?: BorderRadius;
}

// Border radius for rounded corners
export interface BorderRadius {
  topLeft?: number | null;
  topRight?: number | null;
  bottomRight?: number | null;
  bottomLeft?: number | null;
}

// Rectangle geometry combining position and dimension
export interface RectangleGeometry {
  position: GridPosition;
  dimension: GridDimension;
}

// Graphic element code - extensible enum from OSDM code list
// Reference: https://osdm.io/spec/catalog-of-code-lists/#GraphicsItems
export type GraphicElementCode = string;

// Graphic element in coach deck layout
export interface GraphicElement {
  rectangle: RectangleGeometry;
  orientation: Orientation;
  code: GraphicElementCode;
}

// Service icon code - extensible enum from OSDM code list
export type ServiceIconCode = string;

// Service icon representing a service
export interface ServiceIcon {
  rectangle: RectangleGeometry;
  code: ServiceIconCode;
}

// Place property - extensible enum from OSDM code list
export type PlaceProperty = string;

// Place layout (seat, bicycle hook, etc.)
export interface PlaceLayout {
  number: string; // unique per coach deck
  rectangle: RectangleGeometry;
  orientation: Orientation;
  placeProperties?: PlaceProperty[];
}

// Service class type
export type ServiceClassType = string;

// Accommodation type
export type AccommodationType = string;

// Accommodation sub type
export type AccommodationSubType = string;

// Place group grouping places by service class
export interface PlaceGroup {
  serviceClass: ServiceClassType;
  accommodationType?: AccommodationType;
  accommodationSubType?: AccommodationSubType;
  places: PlaceLayout[];
}

// Coach deck level
export type CoachDeckLevel =
  | "SINGLE_DECK"
  | "LOWER_DECK"
  | "MIDDLE_DECK"
  | "UPPER_DECK";

// Coach deck layout - OSDM 4.0.0 compliant structure
export interface CoachDeckLayout {
  id: string;
  name: string;
  dimension: GridDimension;
  lowFloorEntry?: boolean | null;
  deckLevel: CoachDeckLevel;
  placeGroups?: PlaceGroup[];
  graphicElements?: GraphicElement[];
  serviceIcons?: ServiceIcon[];
}

// Legacy types for backward compatibility during migration
export type GraphicalElementCode = GraphicElementCode;

export interface GraphicalElement {
  id: string;
  code: GraphicalElementCode;
  orientation: Orientation;
  x: number;
  y: number;
  size?: {
    width: number;
    height: number;
  };
  width?: number;
  height?: number;
  // Additional properties for specific elements
  seatNumber?: string;
  placeProperties?: string[];
  // Visual properties
  color?: string;
  opacity?: number;
}

export interface CoachLayout {
  id: string;
  name: string;
  description?: string;
  width: number; // in grid units
  height: number; // in grid units
  elements: GraphicalElement[];
  metadata?: {
    version: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ElementCategory {
  id: string;
  name: string;
  elements: {
    code: GraphicalElementCode;
    name: string;
    icon: string;
    orientations: Orientation[];
  }[];
}

// Default coach dimensions (scaled to grid)
export const DEFAULT_COACH_WIDTH = 120; // 24m scaled to 120 units
export const DEFAULT_COACH_HEIGHT = 14; // 2.8m scaled to 14 units
export const GRID_SIZE = 20; // pixels per grid unit

// Orientation mapping from legacy string values to degrees
export const ORIENTATION_MAPPING: Record<string, number> = {
  "to right": 0,
  "to left": 180,
  "up": 270,
  "bottom": 90,
  "top": 270,
  "Left": 180,
  "Top": 270,
  "Right": 0,
  "Bottom": 90,
  "top-to-bottom": 270,
  "-": 0,
};

// Reverse mapping for display purposes
export const DEGREE_TO_ORIENTATION: Record<number, string> = {
  0: "to right",
  90: "bottom",
  180: "to left",
  270: "up",
};
