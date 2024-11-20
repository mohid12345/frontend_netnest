import React from "react";

function Button({ text, className }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button className={`z-30 w-full py-1.5 px-4 hover:bg-blue-700 rounded-md text-white relative font-bold font-sans overflow-hidden transition-all duration-700 ${className}`}>
          {text}
        </button>
      </div>
    </div>
  );
}

export default Button;
