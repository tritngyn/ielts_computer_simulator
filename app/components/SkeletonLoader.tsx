import React from "react";

export default function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-paper-cream p-4 md:p-8 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="w-full h-16 bg-gray-200 rounded-sm mb-8" />
      
      {/* Content Layout Skeleton */}
      <div className="flex flex-col lg:flex-row gap-6 h-[70vh]">
        {/* Left pane (Passage) Skeleton */}
        <div className="w-full lg:w-1/2 bg-paper-white rounded-sm shadow-sm p-6 space-y-4">
          <div className="w-3/4 h-8 bg-gray-200 rounded-sm" />
          <div className="w-full h-4 bg-gray-200 rounded-sm mt-6" />
          <div className="w-full h-4 bg-gray-200 rounded-sm" />
          <div className="w-5/6 h-4 bg-gray-200 rounded-sm" />
          <div className="w-full h-4 bg-gray-200 rounded-sm mt-4" />
          <div className="w-full h-4 bg-gray-200 rounded-sm" />
          <div className="w-4/5 h-4 bg-gray-200 rounded-sm" />
        </div>
        
        {/* Right pane (Questions) Skeleton */}
        <div className="w-full lg:w-1/2 bg-paper-white rounded-sm shadow-sm p-6 space-y-6">
          <div className="w-1/2 h-6 bg-gray-200 rounded-sm mb-4" />
          
          {/* Question blocks */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="w-full h-5 bg-gray-200 rounded-sm" />
              <div className="w-3/4 h-5 bg-gray-200 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
