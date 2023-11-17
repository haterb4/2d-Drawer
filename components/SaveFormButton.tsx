import React, { useCallback, useEffect, useTransition } from 'react'
import { Button } from './ui/button'
import { HiSaveAs } from 'react-icons/hi'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { selectDrawer, selectDrawerStatus, setWorkIsSaved } from '@/app/store/features/drawer/drawerSlice'
import { UpdateFormContent } from '@/actions/form'
import { toast } from './ui/use-toast'
import { FaSpinner } from 'react-icons/fa6'


function SaveFormButton({ id }: { id: number}) {
  const elements = useAppSelector(selectDrawer)
  const drawerisSaved = useAppSelector(selectDrawerStatus)
  const [loading, startTransition] = useTransition()
  const dispatch = useAppDispatch()

  const updateFormContent = useCallback(async () => {
    try {
      const jsonElement = JSON.stringify(elements);
      await UpdateFormContent(id, jsonElement)
      toast({
        title: "Success",
        description: "Your form has been saved"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      })
    }
  }, [elements, id])

  useEffect(() => {
    const interval = setInterval(() => {
      if(!drawerisSaved){
        startTransition(updateFormContent)
        dispatch(setWorkIsSaved())
        console.log("saved")
      }
      else{
        console.log("everthinh is up to date")
      }
    }, 50000)

    return () => {
      clearInterval(interval)
    }
  }, [dispatch, drawerisSaved, updateFormContent])
  return (
    <Button variant={'outline'} className='gap-2' disabled={loading || drawerisSaved} onClick={() => {
      startTransition(updateFormContent)
    }}>
      <HiSaveAs className="h-6 w-6" />
      Save
      {loading && <FaSpinner className="animate-spin" />}
    </Button>
  )
}

export default SaveFormButton
