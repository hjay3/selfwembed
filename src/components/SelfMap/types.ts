export interface IdentityData {
  Strength: number;
  Title?: string;
  Beliefs?: string;
  Style?: string;
}

export interface ProcessedDataPoint {
  name: string;
  strength: number;
  x: number;
  y: number;
  details: IdentityData;
}

export interface QuadrantLabel {
  x: number;
  y: number;
  text: string;
}

export interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}