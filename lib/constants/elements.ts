import { ElementCategory, GraphicalElementCode, Orientation, ORIENTATION_MAPPING, DEFAULT_ORIENTATION } from "../types/osdm";

export const ELEMENT_CATEGORIES: ElementCategory[] = [
  {
    id: "seats",
    name: "Seats & Places",
    elements: [
      {
        code: "SEAT",
        name: "Seat",
        icon: "Armchair",
        orientations: [ORIENTATION_MAPPING["to right"], ORIENTATION_MAPPING["to left"], ORIENTATION_MAPPING["up"], ORIENTATION_MAPPING["bottom"]]
      },
      {
        code: "BERTH",
        name: "Berth",
        icon: "Bed",
        orientations: [ORIENTATION_MAPPING["to left"], ORIENTATION_MAPPING["to right"]]
      },
      {
        code: "COUCHETTE",
        name: "Couchette",
        icon: "Bed",
        orientations: [ORIENTATION_MAPPING["to right"], ORIENTATION_MAPPING["to left"]]
      },
      {
        code: "WHEELCHAIR_SPACE",
        name: "Wheelchair Space",
        icon: "Wheelchair",
        orientations: [ORIENTATION_MAPPING["-"]]
      }
    ]
  },
  {
    id: "tables",
    name: "Tables",
    elements: [
      {
        code: "TABLE",
        name: "Table",
        icon: "Table",
        orientations: [ORIENTATION_MAPPING["top"], ORIENTATION_MAPPING["bottom"]]
      },
      {
        code: "BIG_TABLE",
        name: "Big Table",
        icon: "Table",
        orientations: [ORIENTATION_MAPPING["top"], ORIENTATION_MAPPING["bottom"]]
      }
    ]
  },
  {
    id: "walls",
    name: "Walls",
    elements: [
      {
        code: "WALL_LEFT_2",
        name: "Small Wall Left",
        icon: "Square",
        orientations: [ORIENTATION_MAPPING["bottom"], ORIENTATION_MAPPING["top"]]
      },
      {
        code: "WALL_RIGHT_2",
        name: "Small Wall Right",
        icon: "Square",
        orientations: [ORIENTATION_MAPPING["bottom"], ORIENTATION_MAPPING["top"]]
      },
      {
        code: "WALL_COMPARTMENTS_2",
        name: "Compartment Wall",
        icon: "Square",
        orientations: [ORIENTATION_MAPPING["bottom"], ORIENTATION_MAPPING["top"]]
      },
      {
        code: "WALL_END_TO_END",
        name: "End-to-End Wall",
        icon: "Square",
        orientations: [ORIENTATION_MAPPING["top-to-bottom"]]
      }
    ]
  },
  {
    id: "doors",
    name: "Doors",
    elements: [
      {
        code: "DOOR_OPENING_LEFT",
        name: "Door Left",
        icon: "DoorOpen",
        orientations: [ORIENTATION_MAPPING["Left"], ORIENTATION_MAPPING["Top"], ORIENTATION_MAPPING["Right"], ORIENTATION_MAPPING["Bottom"]]
      },
      {
        code: "DOOR_OPENING_RIGHT",
        name: "Door Right",
        icon: "DoorOpen",
        orientations: [ORIENTATION_MAPPING["Left"], ORIENTATION_MAPPING["Top"], ORIENTATION_MAPPING["Right"], ORIENTATION_MAPPING["Bottom"]]
      },
      {
        code: "SLIDING_DOOR",
        name: "Sliding Door",
        icon: "DoorOpen",
        orientations: [ORIENTATION_MAPPING["Left"], ORIENTATION_MAPPING["Top"], ORIENTATION_MAPPING["Right"], ORIENTATION_MAPPING["Bottom"]]
      },
      {
        code: "ENTRY_EXIT",
        name: "Entry/Exit",
        icon: "DoorOpen",
        orientations: [ORIENTATION_MAPPING["Left"], ORIENTATION_MAPPING["Top"], ORIENTATION_MAPPING["Right"], ORIENTATION_MAPPING["Bottom"]]
      }
    ]
  },
  {
    id: "services",
    name: "Service Areas",
    elements: [
      {
        code: "TOILET_AREA",
        name: "Toilet",
        icon: "Wc",
        orientations: [ORIENTATION_MAPPING["-"]]
      },
      {
        code: "LUGGAGE_AREA",
        name: "Luggage Area",
        icon: "Luggage",
        orientations: [ORIENTATION_MAPPING["-"]]
      },
      {
        code: "BICYCLE_AREA",
        name: "Bicycle Area",
        icon: "Bike",
        orientations: [ORIENTATION_MAPPING["-"]]
      },
      {
        code: "FIRST_CLASS_AREA",
        name: "First Class",
        icon: "Star",
        orientations: [ORIENTATION_MAPPING["-"]]
      },
      {
        code: "SECOND_CLASS_AREA",
        name: "Second Class",
        icon: "Star",
        orientations: [ORIENTATION_MAPPING["-"]]
      },
      {
        code: "WIFI_AREA",
        name: "WiFi Area",
        icon: "Wifi",
        orientations: [ORIENTATION_MAPPING["-"]]
      }
    ]
  }
];

export const getElementByCode = (code: GraphicalElementCode) => {
  for (const category of ELEMENT_CATEGORIES) {
    const element = category.elements.find(el => el.code === code);
    if (element) return element;
  }
  return null;
};

export const getDefaultOrientation = (code: GraphicalElementCode): Orientation => {
  const element = getElementByCode(code);
  return element?.orientations[0] || DEFAULT_ORIENTATION;
};
