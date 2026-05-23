// Import React (required for JSX)
import React from "react";

// Import icons from react-icons library
import {
  AiOutlineCheckCircle,      // Success icon
  AiOutlineCloseCircle,      // Error icon
  AiOutlineLoading3Quarters, // Loading spinner icon
} from "react-icons/ai";

// Functional component that takes props: type and message
const StatusMessage = ({ type, message }) => {
  let icon;        // Variable to store selected icon
  let colorClass;  // Variable to store Tailwind CSS classes

  // Decide UI based on type (error, success, loading)
  switch (type) {
    case "error":
      // Show error icon with red color
      icon = <AiOutlineCloseCircle className="text-red-500 text-3xl" />;
      
      // Background + text color for error
      colorClass = "bg-red-100 text-red-700";
      break;

    case "success":
      // Show success icon with green color
      icon = <AiOutlineCheckCircle className="text-green-500 text-3xl" />;
      
      // Background + text color for success
      colorClass = "bg-green-100 text-green-700";
      break;

    case "loading":
      // Show loading spinner with animation
      icon = (
        <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-3xl" />
      );
      
      // Background + text color for loading
      colorClass = "bg-blue-100 text-blue-700";
      break;

    default:
      // If no valid type is passed, no icon will be shown
      icon = null;
  }

  // JSX returned to UI
  return (
    // Container with flex layout, spacing, padding, rounded corners
    <div className={`flex items-center p-4 rounded-lg ${colorClass} space-x-3`}>
      
      {/* Display icon (based on type) */}
      {icon}

      {/* Display message text */}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

// Export component so it can be used in other files
export default StatusMessage;