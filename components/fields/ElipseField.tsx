"use client"

import { TbOvalVertical } from "react-icons/tb";
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
import DeleteFormButton from "../DeleteFormButton"
import { cn } from "@/lib/utils"

const type: ElementsType = "ElipseField"

const extraAttributes = {
    smallFoci: '5',
    largeFoci: '8',
    origin: {
        x: "0",
        y: "0",
    },
    surface: `${Math.PI*5*8}`,
    perimeter: `${Math.PI*Math.sqrt(2*(Math.pow(5, 2) + Math.pow(8, 2)))}`,
    label: "new Elipse",
    color: 'rgb(220 38 38 / 1)',
    helperText: "click to edit"
}

const propertiesSchema = z.object({
    smallFoci: z.string().min(1),
    largeFoci: z.string().min(1),
    origin: z.object({
        x: z.string().min(1),
        y: z.string().min(1),
    }),
    surface: z.string().min(1),
    perimeter: z.string().min(1),
    color: z.string().min(3).default('rgb(220 38 38 / 1)'),
    label: z.string().min(3).max(100),
    helperText: z.string().min(3).max(100).default('click to edit'),
})

export const ElipseFieldFormElement: FormElement = {
    type,

    construct:  (id: string): FormElementInstance => {
        return ({
            id,
            type,
            extraAttributes,
        })
    },

    designerButtonElement: {
        icon: TbOvalVertical,
        label: "Elipse"
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
            largeFoci: element.extraAttributes.largeFoci,
            smallFoci: element.extraAttributes.smallFoci,
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
                    surface: `${Math.PI*Number.parseInt(value.largeFoci)*Number.parseInt(value.smallFoci)}`,
                    perimeter: `${Math.PI*Math.sqrt(2*(Math.pow(Number.parseInt(value.largeFoci), 2) + Math.pow(Number.parseInt(value.smallFoci), 2)))}`
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
                        <div className="flex space-x-4 items-center">
                            <FormField
                                control={propertieForm.control}
                                name="largeFoci"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Length</FormLabel>
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
                                name="smallFoci"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Width</FormLabel>
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
                        </div>
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
                                            Formula. <br /> Surface = PI * smallFoci * largeFoci
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
                                                Formula. <br /> Perimeter = PI * sqrt(2*(smallFoci^2 + largeFoci^2))
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
                'flex border w-full h-full items-center rounded-[50%] bg-accent/40 px-4 py-2 pointer-events-none opacity-100 justify-center',
                mouseIsOver && "opacity-30",
            )}
            style={{
                width: `${Number.parseInt(element.extraAttributes?.largeFoci)*25}px`,
                height: `${Number.parseInt(element.extraAttributes?.smallFoci)*25}px`,
                backgroundColor: element.extraAttributes?.color,
                borderColor: element.extraAttributes?.color,
            }}
        >
            <div
                className="flex flex-col justify-center items-center gap-2 h-full w-full"
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

    const { label, helperText, perimeter, surface, side, origin, color } = element.extraAttributes

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
                    <h1>Side</h1>
                    <span>{side}</span>
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
            <div className="w-[250px]">
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