"use client"

import React from 'react'
import useDesigner from './hooks/useDesigner'
import { FormElements } from './FormElements'
import { useAppSelector } from '@/app/store/hooks'
import { selectDrawerActiveElement } from '@/app/store/features/drawer/drawerSlice'

function DesignerPropertySideBar() {
  const selectedElement = useAppSelector(selectDrawerActiveElement)

  if(!selectedElement) return null

  const PropertiesForm = FormElements[selectedElement?.type].propertiesComponent
  return (
    <aside className='w-[400px] maw-w-[400px] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full '>
        <PropertiesForm elementInstance={selectedElement}/>
    </aside>
  )
}

export default DesignerPropertySideBar
