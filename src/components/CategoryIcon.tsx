import React from 'react';
import {
  Gamepad2,
  Zap,
  Flame,
  Puzzle,
  Trophy,
  Car,
  Boxes,
  Sparkles,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-4 h-4' }) => {
  switch (name) {
    case 'Gamepad2':
      return <Gamepad2 className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Puzzle':
      return <Puzzle className={className} />;
    case 'Trophy':
      return <Trophy className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Boxes':
      return <Boxes className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};
