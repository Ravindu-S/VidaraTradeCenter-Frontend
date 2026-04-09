import React from "react";

const steps = [
  { key: "PREPARING", label: "Preparing", description: "Order is being prepared" },
  { key: "SHIPPED", label: "Shipped", description: "Package has been shipped" },
  { key: "IN_TRANSIT", label: "In Transit", description: "Package is on the way" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", description: "Package is out for delivery" },
  { key: "DELIVERED", label: "Delivered", description: "Package has been delivered" },
];

const getStepIndex = (status) => {
  const index = steps.findIndex((step) => step.key === status);
  return index === -1 ? 0 : index;
};

const DeliveryTracker = ({ status, estimatedDate, actualDate, trackingNumber, courierName }) => {
  const currentStepIndex = getStepIndex(status);
  const isDelivered = status === "DELIVERED";
  const isReturned = status === "RETURNED";
  const isFailed = status === "FAILED";

  // Handle special statuses
  if (isReturned || isFailed) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className={`flex items-center gap-3 mb-4 ${isFailed ? "text-red-600" : "text-orange-600"}`}>
          <div className={`p-2 rounded-full ${isFailed ? "bg-red-100" : "bg-orange-100"}`}>
            {isFailed ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="font-semibold">{isFailed ? "Delivery Failed" : "Package Returned"}</h3>
            <p className="text-sm opacity-80">
              {isFailed ? "There was an issue with delivery" : "Package has been returned to sender"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {/* Tracking Info Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Delivery Progress</h3>
          {trackingNumber && (
            <p className="text-sm text-gray-500 mt-1">
              Tracking: <span className="font-mono font-medium text-gray-700">{trackingNumber}</span>
            </p>
          )}
        </div>
        <div className="text-right">
          {courierName && (
            <p className="text-sm text-gray-600">
              Courier: <span className="font-medium">{courierName}</span>
            </p>
          )}
          {estimatedDate && !isDelivered && (
            <p className="text-sm text-gray-600">
              Est. Delivery: <span className="font-medium text-indigo-600">{estimatedDate}</span>
            </p>
          )}
          {actualDate && isDelivered && (
            <p className="text-sm text-green-600">
              Delivered: <span className="font-medium">{actualDate}</span>
            </p>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200">
          <div
            className="absolute top-0 left-0 w-full bg-indigo-600 transition-all duration-500"
            style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.key} className="relative flex items-start gap-4 pl-10">
                {/* Step Circle */}
                <div
                  className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all
                    ${isCompleted 
                      ? "border-indigo-600 bg-indigo-600 text-white" 
                      : "border-gray-300 bg-white text-gray-400"
                    }
                    ${isCurrent ? "ring-4 ring-indigo-100" : ""}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Step Content */}
                <div className={`pt-1 ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                  <p className={`font-medium ${isCurrent ? "text-indigo-600" : ""}`}>
                    {step.label}
                  </p>
                  <p className="text-sm">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracker;