
import React from 'react';
import { Input } from "@/components/ui/input";

interface QualificationInputProps {
  minQualification: number;
  currencySymbol: string;
  onUpdateMinQualification: (value: number) => void;
}

const QualificationInput: React.FC<QualificationInputProps> = ({
  minQualification,
  currencySymbol,
  onUpdateMinQualification
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-app-gray-700 mb-2">
        Minimum Qualification Threshold
      </label>
      <div className="flex items-center">
        <div className="relative w-60">
          <input
            type="number"
            className="form-input pl-8 w-full"
            value={minQualification}
            onChange={(e) => onUpdateMinQualification(parseFloat(e.target.value))}
            step="1"
            min="0"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-app-gray-400">{currencySymbol}</span>
          </div>
        </div>
        <span className="ml-3 text-sm text-app-gray-600">Minimum revenue for commission eligibility</span>
      </div>
    </div>
  );
};

export default QualificationInput;
