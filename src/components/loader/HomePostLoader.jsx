import React from 'react'

function HomePostLoader() {
  return (
    <div className="w-full lg:px-10 lg:p-0 mb-8 mr-2 h-max rounded-md border-none shadow-md bg-white border animate-pulse">
    <div className='flex justify-between items-center'>
        {/* user details */}
        <div className='flex cursor-pointer'>
            <div className="flex items-center justify-center bg-gray-300 rounded-full w-12 h-12 overflow-hidden"></div>
            <div className=' mb-1'>
                <div className='h-6 bg-gray-200 rounded w-24 mb-1'></div>
                <div className='h-4 bg-gray-200 rounded w-20'></div>
            </div>
        </div>

        <div className='relative'>
            {/* edit or delete post */}
            {/* <div className='flex cursor-pointer'>
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            </div> */}
            {/* <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10'>
                <div className='w-full px-4 py-2 text-left text-gray-800 hover:text-blue-600 hover:bg-gray-200 rounded-md'>
                    <div className='h-4 bg-gray-200 rounded w-32 mb-2'></div>
                </div>
                <div className="w-full px-4 py-2 text-left text-gray-800 hover:text-red-600 hover:bg-gray-200 rounded-md">
                    <div className='h-4 bg-gray-200 rounded w-32'></div>
                </div>
            </div> */}
        </div>
    </div>

    <div className="lg:p-4 sm:p-0">
        <div className="relative w-full bg-gray-200">
            <div className="relative h-56 overflow-hidden md:h-96">
                <div className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" data-carousel-item>
                    <div className='h-full bg-gray-300'></div>
                </div>
            </div>
            {/* <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <div className='w-4 h-4 bg-black rounded'></div>
                </span>
            </button>
            <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <div className='w-4 h-4 bg-black rounded'></div>
                </span>
            </button> */}
        </div>
    </div>

    <div className='text-gray-200 flex justify-between'>
        {/* like, comment, share */}
        <div className='py-1 mt-0 flex gap-3'>
            <div className='group relative'>
                <div className='w-10 h-10 bg-gray-300 rounded-full'></div>
            </div>
            <div className='group relative'>
                <div className='w-10 h-10 bg-gray-300 rounded-full'></div>
            </div>
            <div className='group relative'>
                <div className='w-10 h-10 bg-gray-300 rounded-full'></div>
            </div>
        </div>

        {/* save post */}
        <div className='py-1 mt-0 flex cursor-pointer relative group'>
            <div className='w-6 h-6 bg-gray-300 rounded-full'></div>
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity">
                <div className='h-4 bg-gray-200 rounded w-24'></div>
            </div>
        </div>
    </div>

    <div className='text-black block pb-2'>
        <div className='font-semibold h-6 bg-gray-200 rounded w-32 mb-1'></div>
        <div className='text-sm h-4 bg-gray-200 rounded w-48'></div>
    </div>
</div>
  )
}

export default HomePostLoader