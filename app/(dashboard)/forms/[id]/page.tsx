import { GetFormById, GetFormWithSubmissions } from '@/actions/form'
import FormBuilder from '@/components/FormBuider'
import FormLinkShare from '@/components/FormLinkShare'
import VisitButton from '@/components/VisitButton'
import React, { ReactNode } from 'react'
import { StatsCard } from '../../page'
import { LuView } from 'react-icons/lu'
import { FaWpforms } from 'react-icons/fa6'
import { HiCursorClick } from 'react-icons/hi'
import { TbArrowBounce } from 'react-icons/tb'
import { ElementsType, FormElementInstance } from '@/components/FormElements'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDistance } from 'date-fns'

async function FormDetailPage({ params }: { params: { id: string } }) {
    const { id } = params
    const form = await GetFormById(Number(id))

    if (!form ){
        throw new Error("Form not found")
    }

    const { visits, submissions } = form;
    let submissionRate = 0
    if(visits > 0 ){
        submissionRate = (submissions / visits) * 100
    }

    const bounceRate = 100 - submissionRate

    return (
        <>
            <div className="py-10 border-b border-muted">
                <div className='flex justify-between container'>
                    <h1 className='text-4xl font-bold truncate'>
                        {form.name}
                    </h1>
                    <VisitButton shareUrl={form.shareUrl} />
                </div>
            </div>
            <div className='py-4 border-b border-muted'>
                <div className='container flex gap-2 items-center justify-between'>
                    <FormLinkShare shareUrl={form.shareUrl} />
                </div>
            </div>
            <div className='w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container'>
                <StatsCard
                    title="Total Visits"
                    icon={<LuView className="text-blue-600" />}
                    helperText="All Time from visits"
                    value={visits.toLocaleString() || ""}
                    loading={false}
                    className="shadow-md shadow-blue-600"
                />
                <StatsCard
                    title="Total Submissions"
                    icon={<FaWpforms className="text-yellow-600" />}
                    helperText="All Time from submissions"
                    value={submissions.toLocaleString() || ""}
                    loading={false}
                    className="shadow-md shadow-yellow-600"
                />
                <StatsCard
                    title="Submission rate"
                    icon={<HiCursorClick className="text-green-600" />}
                    helperText="Visits that result in from submission"
                    value={submissionRate.toLocaleString() +"%" || ""}
                    loading={false}
                    className="shadow-md shadow-green-600"
                />
                <StatsCard
                    title="Bounce rate"
                    icon={<TbArrowBounce className="text-red-600" />}
                    helperText="Visits that leaves without interacting"
                    value={submissionRate.toLocaleString() +"%" || ""}
                    loading={false}
                    className="shadow-md shadow-red-600"
                />
            </div>

            <div className='container pt-10'>
                <SubmissionTable id={form.id} />
            </div>
        </>
    )
}

export default FormDetailPage

type Row = {[key: string]: string} & {
    submittedAt: Date;
}

interface IRDate {
    id: number;
    createdAt: Date;
    formId: number;
    content: string;
  }

async function SubmissionTable({ id }: { id: number }){
    const form = await GetFormWithSubmissions(id)
    if(!form){
        throw new Error("form not found");
    }

    const formElements = JSON.parse(form.content) as FormElementInstance[]

    const columns: {
        id: string;
        label: string;
        type: ElementsType;
    }[] = []

    formElements.forEach(element => {
        switch(element.type){
            case "SquareField":
                columns.push({
                    id: element.id,
                    label: element.extraAttributes?.label,
                    type: element.type
                })
                break
            default:
                break
        }
    })

    const rows: Row[] = [];
    form.FormSubmission.forEach((submission) => {
        const content = JSON.parse(submission.content)
        rows.push({
            ...content,
            submittedAt: submission
        })
    })

    return (
        <>
            <h1 className="text-2xl font-bold my-4">Submissions</h1>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => {
                                return (
                                    <TableHead key={column.id} className='uppercase'>
                                        {column.label}
                                    </TableHead>
                                )
                            })}
                            <TableHead className='text-muted-foreground text-right uppercase'>
                                Submitted at
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            rows.map((row, index) => {
                                const submittedAt = JSON.stringify(row.submittedAt)
                                const newSubmitedAt = JSON.parse(submittedAt)
                                console.log(new Date(newSubmitedAt.createdAt))
                                return(
                                    <TableRow key={index}>
                                        {columns.map(column => {
                                            return (
                                                <RowCell key={column.id} type={column.type} value={row[column.id]} />
                                            )
                                        })}
                                        <TableCell className='text-muted-foreground text-right'>
                                            {formatDistance(new Date(newSubmitedAt.createdAt), new Date(), {
                                                addSuffix: true,
                                            })}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </div>
        </>
    )
}


function RowCell({type, value}: { type: ElementsType, value: string}) {
    let node: ReactNode = value;


    return <TableCell>{node}</TableCell>
}