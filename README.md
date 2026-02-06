# OSDM Coach Layout Editor

An interactive web-based editor for creating and editing OSDM (Open Sales and Distribution Model) coach layouts and seat reservations.

## Features

- **Bidirectional Editing**: Edit layouts both visually (drag-and-drop) and via JSON
- **Real-time Sync**: Changes in the JSON editor instantly update the visual canvas and vice versa
- **OSDM Compliance**: Supports official OSDM graphical elements and codes
- **Professional UI**: Clean, minimal interface using shadcn/ui components with lime-300 primary color
- **SVG Canvas**: High-quality vector graphics with grid alignment
- **Element Palette**: Categorized toolbar for adding new elements
- **Properties Panel**: Edit element properties like position, orientation, and seat numbers
- **Keyboard Shortcuts**: Delete key to remove elements, Escape to deselect

## Supported Elements

### Seats & Places
- SEAT (4 orientations)
- BERTH (left/right)
- COUCHETTE (left/right)
- WHEELCHAIR_SPACE

### Tables
- TABLE (top/bottom)
- BIG_TABLE (top/bottom)

### Walls
- WALL_LEFT_2, WALL_RIGHT_2 (small walls)
- WALL_COMPARTMENTS_2
- WALL_END_TO_END

### Doors
- DOOR_OPENING_LEFT, DOOR_OPENING_RIGHT (4 orientations each)
- SLIDING_DOOR (4 orientations)
- ENTRY_EXIT (4 orientations)

### Service Areas
- TOILET_AREA
- LUGGAGE_AREA
- BICYCLE_AREA
- FIRST_CLASS_AREA
- SECOND_CLASS_AREA
- WIFI_AREA

## Usage

1. **Adding Elements**: Click on an element in the toolbar to add it to the center of the canvas
2. **Moving Elements**: Drag elements around the canvas - they snap to the grid
3. **Selecting Elements**: Click on an element to select it and view its properties
4. **Editing Properties**: Use the properties panel to modify position, orientation, seat numbers, etc.
5. **JSON Editing**: Edit the JSON directly in the left panel for precise control
6. **Deleting Elements**: Select an element and press Delete key

## Technical Details

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **Editor**: Monaco Editor for JSON editing
- **Canvas**: SVG-based rendering with React
- **State Management**: React hooks with bidirectional synchronization
- **TypeScript**: Full type safety with OSDM-compliant interfaces

## Development

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

## OSDM Compliance

This editor follows the OSDM specification for graphical place reservation, supporting:
- Official element codes from the OSDM catalog
- Proper orientation handling
- Standard coach dimensions and grid system
- JSON schema compatible with OSDM APIs

## License

MIT License
