import React from 'react'

const Buttons = ({childern,
    type='button',
     bgColor = 'bg-blue-600',
    textColor = 'text-white',
    className='',
    ...props
    }) => {
  return (
    <button
    type={type}
    className={`w-full px-4 py-2 rounded-lg ${bgColor} ${textColor} ${className} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
    {...props}
    >
        {childern}
    </button>
  )
}

export default Buttons