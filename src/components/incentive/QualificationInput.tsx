
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
        <div className="w-60">
          <Input
            type="number"
            value={minQualification}
            onChange={(e) => onUpdateMinQualification(parseFloat(e.target.value))}
            step="1"
            min="0"
          />
        </div>
        <span className="ml-3 text-sm text-app-gray-600">Minimum revenue for commission eligibility</span>
      </div>
    </div>
  );
};

export default QualificationInput;
