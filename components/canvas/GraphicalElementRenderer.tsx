"use client";

import { GraphicalElement, GRID_SIZE, Orientation, DEFAULT_ORIENTATION } from "@/lib/types/osdm";

interface GraphicalElementRendererProps {
  element: GraphicalElement;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

export function GraphicalElementRenderer({
  element,
  isSelected,
  onMouseDown
}: GraphicalElementRendererProps) {
  const x = element.x * GRID_SIZE;
  const y = element.y * GRID_SIZE;
  const width = (element.width || 1) * GRID_SIZE;
  const height = (element.height || 1) * GRID_SIZE;

  const getElementColor = (code: string) => {
    switch (code) {
      case "SEAT":
      case "BERTH":
      case "COUCHETTE":
        return "#8b5cf6"; // purple
      case "TABLE":
      case "BIG_TABLE":
        return "#f59e0b"; // amber
      case "WHEELCHAIR_SPACE":
        return "#10b981"; // emerald
      case "TOILET_AREA":
        return "#ef4444"; // red
      case "LUGGAGE_AREA":
        return "#6b7280"; // gray
      case "FIRST_CLASS_AREA":
        return "#fbbf24"; // yellow
      case "SECOND_CLASS_AREA":
        return "#84cc16"; // lime
      case "ENTRY_EXIT":
      case "DOOR_OPENING_LEFT":
      case "DOOR_OPENING_RIGHT":
      case "SLIDING_DOOR":
        return "#3b82f6"; // blue
      default:
        return "#64748b"; // slate
    }
  };

  const renderSeat = () => {
    const rotation = getRotation(element.orientation);
    return (
      <rect
        x={x + 2}
        y={y + 2}
        width={width - 4}
        height={height - 4}
        fill={getElementColor(element.code)}
        stroke="white"
        strokeWidth="1"
        rx="2"
        transform={`rotate(${rotation} ${x + width/2} ${y + height/2})`}
      />
    );
  };

  const renderTable = () => {
    return (
      <rect
        x={x + 1}
        y={y + 1}
        width={width - 2}
        height={height - 2}
        fill={getElementColor(element.code)}
        stroke="white"
        strokeWidth="1"
        rx="1"
      />
    );
  };

  const renderWall = () => {
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={getElementColor(element.code)}
        stroke="white"
        strokeWidth="1"
      />
    );
  };

  const renderDoor = () => {
    return (
      <g>
        <rect
          x={x + 1}
          y={y + 1}
          width={width - 2}
          height={height - 2}
          fill="none"
          stroke={getElementColor(element.code)}
          strokeWidth="2"
          strokeDasharray="3,3"
        />
        <line
          x1={x + width/2}
          y1={y + 2}
          x2={x + width/2}
          y2={y + height - 2}
          stroke={getElementColor(element.code)}
          strokeWidth="1"
        />
      </g>
    );
  };

  const renderServiceArea = () => {
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={getElementColor(element.code)}
        fillOpacity="0.3"
        stroke={getElementColor(element.code)}
        strokeWidth="2"
        strokeDasharray="5,5"
      />
    );
  };

  const renderWheelchairSpace = () => {
    return (
      <g>
        <rect
          x={x + 2}
          y={y + 2}
          width={width - 4}
          height={height - 4}
          fill={getElementColor(element.code)}
          stroke="white"
          strokeWidth="1"
          rx="3"
        />
        <circle
          cx={x + width/2}
          cy={y + height/2}
          r="3"
          fill="white"
        />
      </g>
    );
  };

  const getRotation = (orientation: Orientation) => {
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
  };

  const renderElement = () => {
    switch (element.code) {
      case "SEAT":
      case "BERTH":
      case "COUCHETTE":
        return renderSeat();
      case "TABLE":
      case "BIG_TABLE":
        return renderTable();
      case "WALL_LEFT_2":
      case "WALL_RIGHT_2":
      case "WALL_COMPARTMENTS_2":
      case "WALL_END_TO_END":
        return renderWall();
      case "ENTRY_EXIT":
      case "DOOR_OPENING_LEFT":
      case "DOOR_OPENING_RIGHT":
      case "SLIDING_DOOR":
        return renderDoor();
      case "WHEELCHAIR_SPACE":
        return renderWheelchairSpace();
      case "TOILET_AREA":
      case "LUGGAGE_AREA":
      case "BICYCLE_AREA":
      case "FIRST_CLASS_AREA":
      case "SECOND_CLASS_AREA":
      case "WIFI_AREA":
        return renderServiceArea();
      default:
        return (
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={getElementColor(element.code)}
            stroke="white"
            strokeWidth="1"
          />
        );
    }
  };

  return (
    <g
      onMouseDown={onMouseDown}
      className="cursor-move"
    >
      {renderElement()}

      {/* Selection indicator */}
      {isSelected && (
        <rect
          x={x - 2}
          y={y - 2}
          width={width + 4}
          height={height + 4}
          fill="none"
          stroke="#bef264"
          strokeWidth="2"
          strokeDasharray="3,3"
        />
      )}

      {/* Element label - positioned below the icon */}
      {element.seatNumber && (
        <text
          x={x + width/2}
          y={y + height/2 + 6}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="8"
          fill="white"
          fontWeight="bold"
        >
          {element.seatNumber}
        </text>
      )}
    </g>
  );
}
