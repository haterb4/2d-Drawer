"use client"

import { MdTextFields } from "react-icons/md"
import { ElementsType, FormElement, FormElementInstance } from "../FormElements"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import useDesigner from "../hooks/useDesigner"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Switch } from "../ui/switch"

const type: ElementsType = "TextField"

const extraAttributes = {
    label: "Text field",
    helperText: "Helper text",
    required: false,
    placeHolder: "Value here..."
}
export const TextFieldFormElement: FormElement = {
    type,

    construct:  (id: string): FormElementInstance => {
        return ({
            id,
            type,
            extraAttributes,
        })
    },

    designerButtonElement: {
        icon: MdTextFields,
        label: "Text Field"
    },

    designComponent: DesignerComponent ,
    formComponent: () => <div>Form Component</div>,
    propertiesComponent: PropertiesComponent,

}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes;
}

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(20),
    required: z.boolean().default(false),
    placeHolder: z.string().max(50)
})

type propertiesFormSchemaTypes = z.infer<typeof propertiesSchema>

function PropertiesComponent({
    elementInstance
}: {
    elementInstance: FormElementInstance
}){
    const element = elementInstance as CustomInstance
    const { updateElement } = useDesigner()
    const form = useForm<propertiesFormSchemaTypes>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            label: element.extraAttributes.label,
            helperText: element.extraAttributes.helperText,
            required: element.extraAttributes.required,
            placeHolder: element.extraAttributes.placeHolder,
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes)
    }, [element, form])

    function applyChanges(values: propertiesFormSchemaTypes){
        const { label, helperText, required, placeHolder} = values
        console.log(element.id)
        updateElement(element.id, {
            ...element,
            extraAttributes: {
                label,
                helperText,
                required,
                placeHolder,
            }
        })
    }
    return (
        <Form {...form}>
            <form
                onBlur={form.handleSubmit(applyChanges)}
                onSubmit={(e) => {
                    e.preventDefault()
                }}
                className="space-y-3"
            >
                <FormField
                    control={form.control}
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
                                    The label of the field .<br/> It will be displayed above the field
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )
                    }}
                />
                <FormField
                    control={form.control}
                    name="placeHolder"
                    render={({ field}) => {
                        return (
                            <FormItem>
                                <FormLabel>PlaceHolder</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        onKeyDown={(e) => {
                                            if(e.key === "Enter") e.currentTarget.blur()
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>
                                    The placeholder of the field
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )
                    }}
                />
                <FormField
                    control={form.control}
                    name="helperText"
                    render={({ field}) => {
                        return (
                            <FormItem>
                                <FormLabel>Helper text</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        onKeyDown={(e) => {
                                            if(e.key === "Enter") e.currentTarget.blur()
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>
                                    The helper text of the field .<br/> It will be displayed below the field
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )
                    }}
                />
                <FormField
                    control={form.control}
                    name="required"
                    render={({ field}) => {
                        return (
                            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Required</FormLabel>
                                    <FormDescription>
                                        The helper text of the field .<br/> It will be displayed below the field
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )
                    }}
                />
            </form>
        </Form>
    )
}


function DesignerComponent({
    elementInstance
}: { elementInstance: FormElementInstance }){
    const element = elementInstance as CustomInstance

    const { label, required, placeHolder, helperText } = element.extraAttributes

    return (
        <div className="flex flex-col gap-2 w-full">
            <Label>
                {label}
                {required && "*"}
            </Label>
            <Input readOnly disabled placeholder={placeHolder} />
            {helperText && (
                <p className="text-muted-foreground text-[0.8rem] ">{helperText}</p>
            )}
        </div>
    )
}