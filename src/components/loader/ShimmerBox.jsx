import React from "react";

export default function ShimmerBox({ className = "" }) {
  console.log("hello");
  
  return (
    <div
      className={`w-full min-h-60 rounded-xl bg-gray-200 animate-pulse ${className}`}
    />
  );
}
