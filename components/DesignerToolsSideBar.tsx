"use client"

import React from 'react'
import { FormElements } from './FormElements'
import ToolbarButtonElement from './design/ToolbarButtonElement'
import { Separator } from './ui/separator'

function DesignerToolsSideBar() {
  return (
    <aside className='w-[400px] maw-w-[400px] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full '>
      <p className='text-sm text-foreground/70'>Drag and Drop 2D Forms</p>
      <Separator className='my-2' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center '>
        <p className='text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start'>
          4 Sides Forms
        </p>
        <ToolbarButtonElement formElement={FormElements.SquareField} />
        <ToolbarButtonElement formElement={FormElements.RectangleField} />
        <p className='text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start'>
          3 Sides Forms
        </p>
        <ToolbarButtonElement formElement={FormElements.TriangleField} />
        <p className='text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start'>
          rounded Sides Forms
        </p>
        <ToolbarButtonElement formElement={FormElements.CircleField} />
        <ToolbarButtonElement formElement={FormElements.ElipseField} />
        <p className='text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start'>
          Others Forms
        </p>
      </div>
    </aside>
  )
}

export default DesignerToolsSideBar
