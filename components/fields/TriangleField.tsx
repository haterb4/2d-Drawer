"use client"

import { BsTriangle } from "react-icons/bs";
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
import { calculerPerimetreTriangle, calculerSurfaceTriangle } from "@/lib/math/tiangle";
import { convertToDot, dotDistance } from "@/lib/math/point";
import { maxInt, minInt } from "@/lib/math/functions";

const type: ElementsType = "TriangleField"
const extraAttributes = {
    origin: {
        x: "0",
        y: "0",
    },
    point1: {
        x: "-50",
        y: "0",
    },
    point2: {
        x: "0",
        y: "50",
    },
    point3: {
        x: "50",
        y: "0",
    },
    surface: `${3.14*5*5}`,
    perimeter: `${2*3.14*5}`,
    label: "new triangle",
    color: 'rgb(21 128 61 / 1)',
    helperText: "click to edit"
}

const propertiesSchema = z.object({
    origin: z.object({
        x: z.string().min(1),
        y: z.string().min(1),
    }),
    point1: z.object({
        x: z.string().min(1),
        y: z.string().min(1),
    }),
    point2: z.object({
        x: z.string().min(1),
        y: z.string().min(1),
    }),
    point3: z.object({
        x: z.string().min(1),
        y: z.string().min(1),
    }),
    surface: z.string().min(1),
    perimeter: z.string().min(1),
    color: z.string().min(3).default('rgb(217 119 6 / 1)'),
    label: z.string().min(3).max(100),
    helperText: z.string().min(3).max(100).default('click to edit'),
})

export const TriangleFieldFormElement: FormElement = {
    type,

    construct:  (id: string): FormElementInstance => {
        return ({
            id,
            type,
            extraAttributes,
        })
    },

    designerButtonElement: {
        icon: BsTriangle,
        label: "Triangle"
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
            origin: element.extraAttributes.origin,
            point1: element.extraAttributes.point1,
            point2: element.extraAttributes.point2,
            point3: element.extraAttributes.point3,
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
        const side1 = dotDistance(convertToDot(value.point1), convertToDot(value.point2))
        const side2 = dotDistance(convertToDot(value.point2), convertToDot(value.point3))
        const side3 = dotDistance(convertToDot(value.point3), convertToDot(value.point1))
        dispatch(updateElement({
            element: {
                ...element,
                extraAttributes: {
                    ...value,
                    surface: `${calculerSurfaceTriangle(side1, side2 , side3)}`,
                    perimeter: `${calculerPerimetreTriangle(side1, side2 , side3)}`
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
                                                        placeholder="X"
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
                                                        placeholder="Y"
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
                        <div>
                            <h4 className="mb-2">1st Point:</h4>
                            <div className="flex space-x-4 items-center">
                                <FormField
                                    control={propertieForm.control}
                                    name="point1.x"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>X</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder="X"
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
                                    name="point1.y"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Y</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder="Y"
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
                        <div>
                            <h4 className="mb-2">2nd Point:</h4>
                            <div className="flex space-x-4 items-center">
                                <FormField
                                    control={propertieForm.control}
                                    name="point2.x"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>X</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="X"
                                                        type="number"
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
                                    name="point2.y"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Y</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder="Y"
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
                        <div>
                            <h4 className="mb-2">3rd Point:</h4>
                            <div className="flex space-x-4 items-center">
                                <FormField
                                    control={propertieForm.control}
                                    name="point3.x"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>X</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="X"
                                                        type="number"
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
                                    name="point3.y"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Y</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        placeholder="Y"
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
                                            Formula. <br /> Surface = 1/2 * base* height
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
                                                Formula. <br /> Perimeter = s1 + side2 + side3
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
    const { origin, point1, point2, point3, color, label, helperText } = element.extraAttributes
    const side1 = dotDistance(convertToDot(point1), convertToDot(point2))
    const side2 = dotDistance(convertToDot(point2), convertToDot(point3))
    const side3 = dotDistance(convertToDot(point3), convertToDot(point1))

    const conainerSize = `${maxInt(side1, maxInt(side2, side3)) + minInt(side1, minInt(side2, side3))}px`
    const contentSize = maxInt(side1, maxInt(side2, side3)) +(minInt(side1, minInt(side2, side3))/2)

    const triangleStyle = {
        backgroundColor: color,
        clipPath: `polygon(
            ${Number.parseInt(point1.x)+(contentSize/2)}px ${-Number.parseInt(point1.y)+(contentSize/2)}px,
            ${Number.parseInt(point2.x)+(contentSize/2)}px ${-Number.parseInt(point2.y)+(contentSize/2)}px,
            ${Number.parseInt(point3.x)+(contentSize/2)}px ${-Number.parseInt(point3.y)+(contentSize/2)}px
        )`,
        width: conainerSize,
        height: conainerSize,
    }

    return (
        <div
            className={cn(
                'border flex items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100 justify-center',
                mouseIsOver && "opacity-30",
            )}
            style={{
                width: conainerSize,
                height: conainerSize,
                borderColor: color,
            }}
        >
            <div className="!relative" style={{
                height: contentSize,
                width: contentSize,
            }}>
                <div className="absolute top-0 left-0 flex flex-col justify-center items-center gap-2" style={triangleStyle} />
                <div
                    className="flex flex-col justify-center items-center gap-2 h-full w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                    <Label>
                        {label}
                    </Label>
                    <Label className="animate-pulse">
                        {helperText}
                    </Label>
                </div>
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