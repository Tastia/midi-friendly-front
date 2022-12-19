import { deepmerge } from "deepmerge-ts";

export const DefaultThemeOverrides = {
  common: {
    borderRadius: "6px",
    primaryColor: "#F18669",
    primaryColorHover: "#DF6E50",
    primaryColorPressed: "#F18669",
    primaryColorSuppl: "#DF6E50",
    heightTiny: "26px",
    heightSmall: "32px",
    heightMedium: "38px",
    heightLarge: "44px",
    heightHuge: "50px",
  },
  DataTable: {
    borderRadius: "6px",
  },
  TableHeader: {
    borderRadius: "6px",
  },
  Alert: {
    padding: "5px 8px",
  },
  Tag: {
    borderRadius: "6px",
  },
  LoadingBar: {
    height: "4.5px",
  },
};

const _lightThemeOverrides = {
  common: {
    bodyColor: "#f7f7f7",
  },
};

const _darkThemeOverrides = {
  common: {
    bodyColor: "#242424",
    cardColor: "#1A1A1A",
    modalColor: "#1A1A1A",
    scrollbarWidth: "5px",
    fontFamily: "Lato",
    popoverColor: "#1A1A1A",
  },
  Input: {
    color: "#363434",
  },
  InternalSelection: {
    color: "#363434",
  },
  ColorPicker: {
    color: "#363434",
  },
  Slider: {
    fillColor: "rgba(185, 38, 180, 1)",
  },
  Card: {
    colorEmbedded: "rgba(49, 51, 65, 1)",
  },
};

export const DarkThemeOverrides = deepmerge(
  DefaultThemeOverrides,
  _darkThemeOverrides
);
export const LightThemeOverrides = deepmerge(
  DefaultThemeOverrides,
  _lightThemeOverrides
);

export const GMapsThemeOverridesDark = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];
