import { Active, DragOverlay, useDndMonitor } from '@dnd-kit/core'
import React, { useState } from 'react'
import { ToolbarButtonElementDragOverlay } from './design/ToolbarButtonElement'
import { ElementsType, FormElements } from './FormElements'
import useDesigner from './hooks/useDesigner'
import { useAppSelector } from '@/app/store/hooks'
import { selectDrawer } from '@/app/store/features/drawer/drawerSlice'

function DragOverlayWrapper() {
    const elements = useAppSelector(selectDrawer)
    const [draggedItem, setDraggerdItem] = useState<Active | null>(null)
    useDndMonitor({
        onDragStart: (event) => {
            setDraggerdItem(event.active)
        },
        onDragCancel: () => {
            setDraggerdItem(null)
        },
        onDragEnd: () => {
            setDraggerdItem(null)
        },
    })

    if(!draggedItem) return null;

    let node = <div>No drag overlay</div>
    const isToolbarButtonElement = draggedItem.data?.current?.isDesignerButtonElement
    

    if(isToolbarButtonElement){
        const type = draggedItem.data?.current?.type as ElementsType
        node = <ToolbarButtonElementDragOverlay formElement={FormElements[type]} />
    }

    const isDesignerElement = draggedItem.data?.current?.isDesignerElement
    if(isDesignerElement){
        const elementId = draggedItem.data?.current?.elementId
        console.log(elementId)
        const element = elements.find(el => el.id === elementId)

        if(!element) node = <div>Element not found</div>
        else{
            const DesignerElementComponent = FormElements[element.type].designComponent
            node = (
                <div className='flex bg-accent border border-md h-[120px] w-full py-2 px-4 opacity-80 pointer pointer-events-none'>
                    <DesignerElementComponent elementInstance={element} />
                </div>
            )
        }
    }
    return (
        <DragOverlay>
            {node}
        </DragOverlay>
    )
}

export default DragOverlayWrapper
