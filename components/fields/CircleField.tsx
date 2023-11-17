"use client"

import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "../FormElements"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useAppDispatch } from "@/app/store/hooks"
import { updateElement } from "@/app/store/features/drawer/drawerSlice"
import { FaRegCircle } from "react-icons/fa6";
import DeleteFormButton from "../DeleteFormButton"
import { cn } from "@/lib/utils"

const type: ElementsType = "CircleField"

const extraAttributes = {
    radius: '5',
    origin: {
        x: "0",
        y: "0",
    },
    surface: `${Math.PI*5*5}`,
    perimeter: `${2*Math.PI*5}`,
    label: "new Circle",
    color: 'rgb(21 128 61 / 1)',
    helperText: "click to edit"
}

const propertiesSchema = z.object({
    radius: z.string().min(1),
    origin: z.object({
        x: z.string().min(1),
        y: z.string().min(1),
    }),
    surface: z.string().min(1),
    perimeter: z.string().min(1),
    color: z.string().min(3).default('rgb(21 128 61 / 1)'),
    label: z.string().min(3).max(100),
    helperText: z.string().min(3).max(100).default('click to edit'),
})

export const CircleFieldFormElement: FormElement = {
    type,

    construct:  (id: string): FormElementInstance => {
        return ({
            id,
            type,
            extraAttributes,
        })
    },

    designerButtonElement: {
        icon: FaRegCircle,
        label: "Circle"
    },

    designComponent: DesignerComponent ,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: (formElement: FormElementInstance, currentValue: string): boolean => {
        return true
    }
}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes;
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>

function PropertiesComponent({
    elementInstance
}: {
    elementInstance: FormElementInstance
}){
    const dispatch = useAppDispatch()
    const element = elementInstance as CustomInstance
    
    const propertieForm = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            radius: element.extraAttributes.radius,
            origin: element.extraAttributes.origin,
            surface: element.extraAttributes.surface,
            perimeter: element.extraAttributes.perimeter,
            label: element.extraAttributes.label,
            helperText: element.extraAttributes.helperText,
            color: element.extraAttributes.color,
        }
    })

    useEffect(() => {
        propertieForm.reset(element.extraAttributes);
    }, [element, propertieForm])

    function applyChanges(value: propertiesFormSchemaType){
        console.log("update")

        dispatch(updateElement({
            element: {
                ...element,
                extraAttributes: {
                    ...value,
                    surface: `${Math.PI*Number.parseInt(value.radius)*Number.parseInt(value.radius)}`,
                    perimeter: `${2*Math.PI*Number.parseInt(value.radius)}`
                }
            }
        }))
    }
    return (
        <div>
            <div>
                <Form {...propertieForm}>
                    <form
                        onBlur={propertieForm.handleSubmit(applyChanges)}
                        className="space-y-3"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <FormField
                            control={propertieForm.control}
                            name="label"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Label</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                onKeyDown={(e) => {
                                                    if(e.key === "Enter") e.currentTarget.blur()
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            te label of the square field. <br /> It will be displayed above de field
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField
                            control={propertieForm.control}
                            name="helperText"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Helper Text</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                onKeyDown={(e) => {
                                                    if(e.key === "Enter") e.currentTarget.blur()
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            the elper text of the square field. <br /> It will be displayed above de field
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <div>
                            <h4 className="mb-2">Origin:</h4>
                            <div className="flex space-x-4 items-center">
                                <FormField
                                    control={propertieForm.control}
                                    name="origin.x"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>X</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        max={456}
                                                        min={-456}
                                                        onKeyDown={(e) => {
                                                            if(e.key === "Enter") e.currentTarget.blur()
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                                <FormField
                                    control={propertieForm.control}
                                    name="origin.y"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Y</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        max={456}
                                                        min={-456}
                                                        onKeyDown={(e) => {
                                                            if(e.key === "Enter") e.currentTarget.blur()
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                            </div>
                        </div>
                        <FormField
                            control={propertieForm.control}
                            name="radius"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Radius</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                onKeyDown={(e) => {
                                                    if(e.key === "Enter") e.currentTarget.blur()
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            te label of the square field. <br /> It will be displayed above de field
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField
                            control={propertieForm.control}
                            name="color"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>Color</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                onKeyDown={(e) => {
                                                    if(e.key === "Enter") e.currentTarget.blur()
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            the background color of the square field. <br /> all css color type
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <div>
                            <h4 className="mb-3">Computed caracteristics values</h4>
                            <FormField
                                control={propertieForm.control}
                                name="surface"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Surface</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={true}
                                                    type="number"
                                                    onKeyDown={(e) => {
                                                        if(e.key === "Enter") e.currentTarget.blur()
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                            Formula. <br /> Surface = PI * Radius^2
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />
                            <FormField
                                control={propertieForm.control}
                                name="perimeter"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Perimeter</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={true}
                                                    type="number"
                                                    onKeyDown={(e) => {
                                                        if(e.key === "Enter") e.currentTarget.blur()
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Formula. <br /> Perimeter = 2 * PI * Radius
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />
                        </div>
                    </form>
                </Form>
            </div>
            <DeleteFormButton id={element.id} />
        </div>
    )
}


function DesignerComponent({
    elementInstance,
    mouseIsOver
}: { elementInstance: FormElementInstance; mouseIsOver?: boolean }){
    const element = elementInstance as CustomInstance

    const { label, helperText, origin } = element.extraAttributes

    return (
        <div
            className={cn(
                'border flex w-full h-full items-center !rounded-full bg-accent/40 px-4 py-2 pointer-events-none opacity-100 justify-center',
                mouseIsOver && "opacity-30",
            )}
            style={{
                width: `${Number.parseInt(element.extraAttributes?.radius)*25}px`,
                height: `${Number.parseInt(element.extraAttributes?.radius)*25}px`,
                backgroundColor: element.extraAttributes?.color,
                borderColor: '#'+element.extraAttributes?.color,
            }}
        >
            <div
                className="flex flex-col justify-center items-center"
            >
                <Label>
                    {label}
                </Label>
                <Label className="animate-pulse">
                    {helperText}
                </Label>
            </div>
        </div>
    )
}

function FormComponent({
    elementInstance,
    submitValue,
    isInvalid,
}: {
    elementInstance: FormElementInstance;
    submitValue?: SubmitFunction,
    isInvalid?: boolean
}){
    const element = elementInstance as CustomInstance

    const [value, setValue] = useState("")
    const [error, setError] = useState(false)

    useEffect(() => {
        setError(isInvalid === true)
    }, [isInvalid])

    const { label, helperText, perimeter, surface, radius, origin, color } = element.extraAttributes

    return (
        <div className="!h-[350px] !min-h-[550px] w-full border  flex flex-col justify-center items-center space-y-5" style={{borderColor: color}}>
            <div className="flex flex-col w-[250px]">
                <Label className="text-2xl">
                    {label}
                </Label>
                <Label className="animate-pulse">
                    {helperText}
                </Label>
            </div>

            <div className="flex flex-col w-[250px]">
                <div className="flex items-center justify-between space-x-8">
                    <h1>Origin</h1>
                    <span>{`(x: ${origin.x}, y: ${origin.y})`}</span>
                </div>
                <div className="flex items-center justify-between space-x-8">
                    <h1>Radius</h1>
                    <span>{radius}</span>
                </div>
            </div>
            
            <div className="w-[250px]">
                <div className="flex items-center justify-between space-x-8">
                    <h1>Perimeter</h1>
                    <span>{perimeter}</span>
                </div>
                <div className="flex items-center justify-between space-x-8">
                    <h1>Surface</h1>
                    <span>{surface}</span>
                </div>
            </div>
            <div className="w-[250px] flex flex-col">
                <Input
                    className={cn(error && "w-full")}
                    placeholder="give a note"
                    onChange={(e) => setValue(e.target.validationMessage)}
                    type="number"
                    max={5}
                    min={0}
                    onBlur={(e) => {
                        if(!submitValue) return
                        submitValue(element.id, e.target.value)
                    }}
                />
                <Input
                    className={cn(error && "w-full")}
                    placeholder="Add any comment to the form"
                    onChange={(e) => setValue(e.target.validationMessage)}
                    max={5}
                    min={0}
                    onBlur={(e) => {
                        if(!submitValue) return
                        submitValue(element.id, e.target.value)
                    }}
                />
            </div>
            
        </div>
    )
}