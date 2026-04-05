import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center border border-surface-300 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-10 h-10 flex items-center justify-center text-surface-600 hover:bg-surface-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Giảm số lượng"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold text-surface-800 border-x border-surface-300 select-none">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center text-surface-600 hover:bg-surface-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Tăng số lượng"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
