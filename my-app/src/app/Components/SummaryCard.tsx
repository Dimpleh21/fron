import React from "react";

// Define the types for the props
interface SummaryCardProps {
  title: string;
  value: string | number; // Allow value to be a string or number
  description?: string; // Description is optional
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  description,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      {/* Handle different types for value (string or number) */}
      <p className="mt-2 text-2xl font-bold text-purple-600">
        {value.toString()}
      </p>
      {description && (
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      )}
    </div>
  );
};

export default SummaryCard;
