declare module '@hugeicons/react' {
  import * as React from 'react';
  export interface HugeiconsIconProps {
    icon: any;
    altIcon?: any;
    showAlt?: boolean;
    size?: number | string;
    color?: string;
    strokeWidth?: number;
    absoluteStrokeWidth?: boolean;
    primaryColor?: string;
    secondaryColor?: string;
    disableSecondaryOpacity?: boolean;
    className?: string;
  }
  export const HugeiconsIcon: React.FC<HugeiconsIconProps>;
}

declare module '@hugeicons/core-free-icons' {
  export const Settings01Icon: any;
  export const Cancel01Icon: any;
  export const RefreshIcon: any;
  export const Layers01Icon: any;
  export const SlidersHorizontalIcon: any;
  export const SwatchIcon: any;
  export const ColorPickerIcon: any;
  export const ZapIcon: any;
  export const CodeIcon: any;
  export const CheckmarkCircle02Icon: any;
  export const Copy01Icon: any;
  export const DocumentCodeIcon: any;
  export const SourceCodeIcon: any;
  export const ComputerTerminal01Icon: any;
  export const CodeSquareIcon: any;
}
