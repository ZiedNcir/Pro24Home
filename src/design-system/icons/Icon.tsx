import React from 'react';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { colors } from '../foundations';
import { IconName, iconPaths } from './iconPaths';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

export interface IconProps {
  name: IconName;
  size?: IconSize;
  color?: string;
  strokeWidth?: number;
}

const sizeMap = { xs: 16, sm: 20, md: 24, lg: 32, xl: 40 };

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = colors.text,
  strokeWidth = 2,
}) => {
  const config = iconPaths[name];
  const finalSize = typeof size === 'number' ? size : sizeMap[size];

  return (
    <Svg width={finalSize} height={finalSize} viewBox="0 0 24 24" fill="none">
      {config.paths.map((d, index) => (
        <Path
          key={`path-${index}`}
          d={d}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {config.lines?.map((line, index) => (
        <Line
          key={`line-${index}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      ))}

      {config.circles?.map((circle, index) => (
        <Circle
          key={`circle-${index}`}
          cx={circle.cx}
          cy={circle.cy}
          r={circle.r}
          stroke={color}
          strokeWidth={strokeWidth}
        />
      ))}
    </Svg>
  );
};
