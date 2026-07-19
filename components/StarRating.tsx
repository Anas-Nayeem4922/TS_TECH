'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
}

export function StarRating({ value, onChange, size = 24, readOnly = false }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = hoverValue || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayValue;
        const isPartial = !isFilled && star - 0.5 <= displayValue;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(0)}
            className={`transition-transform ${!readOnly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          >
            <motion.div
              animate={isFilled && !readOnly ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.2 }}
            >
              <Star
                size={size}
                className={`${
                  isFilled
                    ? 'fill-gold-400 text-gold-400'
                    : isPartial
                    ? 'fill-gold-400/50 text-gold-400/50'
                    : 'fill-transparent text-silver-600'
                }`}
              />
            </motion.div>
          </button>
        );
      })}
    </div>
  );
}
