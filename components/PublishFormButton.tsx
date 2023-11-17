import React, { useTransition } from 'react'
import { MdPreview } from 'react-icons/md'
import { Button } from './ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog'
import { FaIcons } from 'react-icons/fa6'
import { toast } from './ui/use-toast'
import { PublishForm } from '@/actions/form'
import { useRouter } from 'next/navigation'


function PublishFormButton({ id }: { id: number}) {
  const [loading, startTransition] = useTransition()
  const router = useRouter()

  async function publishForm(){
    try {
      await PublishForm(id)
      toast({
        title: "Success",
        description: "Your form is now available to the public"
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Success",
        description: "Something went wrong"
      })
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={'outline'} className='gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400'>
          <MdPreview className="h-4 w-4" />
          Publish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action can not be undone. After publishing you will not be able to edit this form.
            <br />
            <br />
            <span className='font-medium'>
              By publishing this form you will make it available to the public an you will be able to collect submission.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              startTransition(publishForm)
            }}
          >
            Proceed {loading && <FaIcons className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PublishFormButton
