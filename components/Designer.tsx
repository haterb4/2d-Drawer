"use client"

import React, { useRef, useState } from 'react'
import DesignerToolsSideBar from './DesignerToolsSideBar'
import DesignerPropertySideBar from './DesignerPropertySideBar'
import { DragEndEvent, useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import { ElementsType, FormElementInstance, FormElements } from './FormElements'
import { idGenerator } from '@/lib/idGenerator'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { addElement, clearSelectedElement, removeElement, selectDrawer, selectDrawerActiveElement, setSelectedElement } from '@/app/store/features/drawer/drawerSlice'


function Designer() {

    const dispatch = useAppDispatch()
    const elements = useAppSelector(selectDrawer)
    const selectedElement = useAppSelector(selectDrawerActiveElement)

    const droppable = useDroppable({
        id: 'designer-drop-area',
        data: {
            isDesignerDropArea: true,
        }
    })
    
    useDndMonitor({
        onDragEnd: (event: DragEndEvent) => {
            const { active, over} = event
            if(!active || !over) return;

            const isDesignerButtonElement = active.data?.current?.isDesignerButtonElement
            const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea

            const croppingSideBarBtnOverDesignerDropArea = isDesignerButtonElement && isDroppingOverDesignerDropArea

            if(croppingSideBarBtnOverDesignerDropArea){
                const type = active.data?.current?.type;
                const newElement = FormElements[type as ElementsType].construct(elements.length.toString())
                dispatch(addElement({index: elements.length, element: newElement}))
                return
            }

            const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement
            const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isBottompHalfDesignerElement

            const isDroppingOverDesignerElement = isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf;

            const croppingToolbarButtonOverDesignerElement: boolean = isDesignerButtonElement && isDroppingOverDesignerElement;

            //second scenario
            if(croppingToolbarButtonOverDesignerElement){
                const type = active.data?.current?.type;
                const newElement = FormElements[type as ElementsType].construct(idGenerator())

                const overId = over.data?.current?.elementId

                const overElementIndex = elements.findIndex(el => el.id === overId)

                if(overElementIndex === -1){
                    throw new Error("element not found")
                }

                let indexForNewElement = overElementIndex

                if(isDroppingOverDesignerElementBottomHalf){
                    indexForNewElement = overElementIndex + 1
                }
                dispatch(addElement({index: indexForNewElement, element: newElement}))
                return
            }

        }
    })
    return (
        <div className='flex w-full h-full'>
            <DesignerToolsSideBar />
            <div className="w-full p-4 relative" onClick={() => {
                if(selectedElement) dispatch(clearSelectedElement())
            }}>
                <div
                    ref={droppable.setNodeRef}
                    className={cn(
                        ' w-full h-full m-auto rounded-xl flex items-center flex-col justify-start flex-grow flex-1 overflow-auto scroll-hidden',
                        droppable.isOver && "ring-2 ring-primary/20"
                    )}
                >
                    {!droppable.isOver && elements.length === 0 && (
                        <p className="text-3xl text-muted-foreground flex items-center flex-grow font-bold">
                            Drop Here
                        </p>
                    )}
                    {droppable.isOver && elements.length === 0 && (
                        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 !w-[120px] h-[120px]'>
                            <div className='h-[120px] rounded-md bg-primary/20 '></div>
                        </div>
                    )}
                    {elements.length > 0 && (
                        <div className='flex justify-center items-center flex-wrap text-background w-full h-full gap-2 p-4 relative'>
                            {elements.map((element, index) => {
                                return <DesignerElementWrapper key={index} element={element} index={index}/>
                            })}
                        </div>
                    )}
                </div>
            </div>
            <DesignerPropertySideBar />
        </div>
    )
}

function DesignerElementWrapper({element, index}: { element: FormElementInstance, index: number}){
    const selectedElement = useAppSelector(selectDrawerActiveElement)
    const dispatch = useAppDispatch()

    const DesignerElement = FormElements[element.type].designComponent
    const [mouseIsOver, setMouseIsOver] = useState<boolean>(false)
    const ref = useRef(null)
    const topHalf = useDroppable({
        id: element.id + "-top",
        data: {
            type: element.type,
            elementId: element.id,
            isTopHalfDesignerElement: true,
        }
    })

    const bottompHalf = useDroppable({
        id: element.id + "-bottom",
        data: {
            type: element.type,
            elementId: element.id,
            isBottomHalfDesignerElement: true,
        }
    })

    const draggable = useDraggable({
        id: element.id+"-drag-handler",
        data: {
            type: element.type,
            elementId: element.id,
            isDesignerElement: true,
        }
    })

    if(draggable.isDragging) return null
    return (
        <div
            ref={draggable.setNodeRef}
            {...draggable.listeners}
            {...draggable.attributes}
            onMouseEnter={() => {
                setMouseIsOver(true)
            }}
            onMouseLeave={() => {
                setMouseIsOver(false)
            }}
            onClick={(e) => {
                e.stopPropagation()
                dispatch(setSelectedElement({index: index, element}))
            }}
            className={`text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset absolute`}
            style={{
                top: `${460-Number.parseInt(element.extraAttributes?.origin.y)}px`,
                left: `${460+Number.parseInt(element.extraAttributes?.origin.x)}px`,
            }}
        >
            <DesignerElement elementInstance={element}/>
        </div>
    )
}

export default Designer
