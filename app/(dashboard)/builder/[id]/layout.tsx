import React, { ReactNode } from 'react'

function layout({children}: { children: ReactNode}) {
  return (
    <div className='w-full flex flex-grow mw-auto'>
      {children}
    </div>
  )
}

export default layout
