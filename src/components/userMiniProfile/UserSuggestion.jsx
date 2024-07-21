import React from 'react'

function UserSuggestion() {
  return (
    <div>
      <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
              <li className="py-3 sm:py-4">
                  <div className="flex items-center">
                      <div className="flex-shrink-0">
                          <img className="w-8 h-8 rounded-full bg-black" src="" alt="" />
                      </div>
                      <div className="flex-1 min-w-0 ms-4">
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                              Neil Sims
                          </p>
                          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                              email@windster.com
                          </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                          Follow
                      </div>
                  </div>
              </li>
          </ul>
      </div>
    </div>
  )
}

export default UserSuggestion