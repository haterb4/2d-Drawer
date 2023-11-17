import React, { startTransition, useTransition } from 'react'
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
import { useAppDispatch } from '@/app/store/hooks'
import { clearSelectedElement, removeElement } from '@/app/store/features/drawer/drawerSlice'


function DeleteFormButton({ id }: { id: string}) {
    const dispatch = useAppDispatch()
    const [loading, startTransition] = useTransition()
    async function deleteForm(){
        try {
            dispatch(removeElement({id}))
            dispatch(clearSelectedElement())
        toast({
            title: "Success",
            description: "Your form is now available to the public"
        })
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
            <Button variant={'outline'} className='gap-2 text-primary bg-background w-full mt-6'>
            <MdPreview className="h-4 w-4" />
            Delete Form
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action can not be undone. After deleting you will not be able to see this form.
                <br />
                <br />
                <span className='font-medium'>
                By deleting this form you will make it permanently unavailable and unrecoverable.
                </span>
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
                disabled={loading}
                onClick={(e) => {
                e.preventDefault();
                startTransition(deleteForm)
                }}
            >
                Proceed {loading && <FaIcons className="animate-spin" />}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteFormButton
