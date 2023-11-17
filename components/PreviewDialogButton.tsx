import React from 'react'
import { Button } from './ui/button'
import { MdPreview } from 'react-icons/md'
import { useAppSelector } from '@/app/store/hooks'
import { selectDrawer } from '@/app/store/features/drawer/drawerSlice'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { FormElements } from './FormElements'

function PreviewDialogButton() {
  const elements = useAppSelector(selectDrawer)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'outline'} className='gap-2'>
          <MdPreview className="h-6 w-6" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className='w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0'>
        <div className="px-4 py-2 border-b">
          <p className='text-lg font-bold text-muted-foreground'>
            Form preview
          </p>
        </div>
        <div className='bg-accent flex flex-col flex-grow items-center justify-center p-4 bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)] overflow-y-auto'>
          <div className='max-w-[620px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto'>
            {
              elements.map((element, index) => {
                const FormComponent = FormElements[element.type].formComponent

                return <FormComponent key={index} elementInstance={element}/>
              })
            }
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PreviewDialogButton
