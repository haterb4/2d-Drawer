import { GetFormById } from '@/actions/form'
import FormBuilder from '@/components/FormBuider'
import React from 'react'

async function BuiderPage({ params }: { params: { id: string } }) {
    const { id } = params
    const form = await GetFormById(Number(id))

    if (!form ){
        throw new Error("Form not found")
    }
    return <FormBuilder form={form} />
}

export default BuiderPage
