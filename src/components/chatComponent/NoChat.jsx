import React from 'react'
import chatImg from "../../../public/images/chat.jpg"
import { useSelector } from 'react-redux'

function NoChat() {
  const selectUser = (state) => state.auth.user
  const user  = useSelector(selectUser)

  return (
    <>
      <div className='relative z-0 flex flex-col flex-1 bg-gray-300 justify-center items-center'>
      <div className=' h-auto'>
        {/* <img src={chatImg} alt="chat logo" /> */}
        <div class="group relative text-center">
          <button>
            <svg
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              height="44"
              width="44"
              xmlns="http://www.w3.org/2000/svg"
              class="w-10 hover:scale-125 duration-200 hover:stroke-blue-500"
              fill="none"
            >
              <path fill="none" d="M0 0h24v24H0z" stroke="none"></path>
              <path d="M8 9h8"></path>
              <path d="M8 13h6"></path>
              <path
                d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"
              ></path>
            </svg>
          </button>
          <span
            class="absolute -top-20 left-[50%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100"
            >Hello {user.userName} <span> </span
          ></span>
        </div>

      </div>
      <div className='mt-2 text-center w-72'>
        <p className='font-semibold text-lg text-black'>Your messages</p>
        <button className='mt-0 p-2  text-slate-950 rounded'>Send a message to start a chat.</button>
      </div>
    </div>
    </>
  )
}

export default NoChat