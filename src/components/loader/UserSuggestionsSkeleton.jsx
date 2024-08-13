import { ArrowBigDownDash } from 'lucide-react';
import React from 'react';

function UserSuggestionsSkeleton() {
  const skeletonArray = Array(4).fill(0); // Adjust the number of skeleton items as needed

  return (
    <div className="w-full max-w-md rounded-md border-none shadow-md bg-white border sm:p-8 dark:bg-black dark:border-gray-700 dark:shadow-gray-500">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-md font-semibold leading-none text-gray-700 dark:text-white">Suggested for you</h5>
        <span className="text-sm font-normal text-gray-600 hover:underline dark:text-blue-500 mr-1">
          <ArrowBigDownDash />
        </span>
      </div>
      {skeletonArray.map((_, index) => (
        <div key={index} className="flow-root">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            <li className="py-3 sm:py-2">
              <div className="flex items-center justify-between gap-3 animate-pulse">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-11 h-11 rounded-full bg-gray-300 dark:bg-gray-400"></div>
                  </div>
                  <div className="flex-1 min-w-0 ml-2 text-center flex items-center mb-1">
                    <div className="flex flex-col justify-start text-start">
                      <div className="h-4 bg-gray-300 dark:bg-gray-400 rounded w-24 mb-2"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-400 rounded w-16"></div>
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-black cursor-pointer dark:text-white text-center mb-1">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
}

export default UserSuggestionsSkeleton;
