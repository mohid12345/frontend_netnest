import React from 'react'

function Header() {
  return (
    <div className='h-28 w-full flex items-center justify-start border-b-2 p-8'>
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center gap-4">
            {/* Circular Container */}
            <div className='flex flex-col justify-center items-center'>
              <div className="flex items-center justify-center bg-gray-200 rounded-full h-14 w-14">
                <span className="text-center font-semibold text-xs p-2 ">Add stories</span>
              </div>
              <div className='flex items-center justify-center mt-1'>
                <p className='text-black text-xs font-normal'>ajzal_muhammed</p>
              </div>
            </div>
            {/* <div className='flex flex-col justify-center items-center'>
              <div className="flex items-center justify-center bg-gray-200 rounded-full h-14 w-14">
                <span className="text-center font-semibold text-xs p-2">Add stories</span>
              </div>
              <div className='flex items-center justify-center mt-1'>
                <p className='text-white text-xs font-normal'>salvi_shajan</p>
              </div>
            </div> */}
          </li>
        </ol>
      </nav>
    </div>

  )
}

export default Header