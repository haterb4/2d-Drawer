import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'
import { FormElementInstance } from '@/components/FormElements';

// Define a type for the slice state
interface IDrawerState {
    elements: FormElementInstance[];
    selectedElement: FormElementInstance | null;
    selectedIndex: number | null;
    workIsSaved: boolean;
}

// Define the initial state using that type
const initialState: IDrawerState = {
    elements: [],
    selectedElement: null,
    selectedIndex: null,
    workIsSaved: true
}

export const drawerSlice = createSlice({
  name: 'drawer',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setElements: (state, action: PayloadAction<{
        elements: FormElementInstance[]
    }>) => {
        state.elements = action.payload.elements
    },
    setWorkIsSaved: (state) => {
        state.workIsSaved = true
    },
    addElement: (state, action: PayloadAction<{
        index: number;
        element: FormElementInstance
    }>) => {
        const newElements = [...state.elements]
        newElements.splice(action.payload.index, 0, action.payload.element)
        state.elements = newElements
        
    },
    removeElement: (state, action: PayloadAction<{id: string}>) => {
        state.elements = state.elements.filter((element) => element.id !== action.payload.id)
    },

    setSelectedElement: (state, action: PayloadAction<{index: number, element: FormElementInstance}>) => {
        state.selectedElement = action.payload.element,
        state.selectedIndex = action.payload.index
    },

    clearSelectedElement: (state) => {
        state.selectedElement = null
        state.selectedIndex = null
    },

    updateElement: (state, action: PayloadAction<{
        element: FormElementInstance
    }>) => {
        if(state.selectedIndex === null) return
        state.elements[state.selectedIndex] = action.payload.element
        state.workIsSaved = false
    },

  },
})

export const { addElement, removeElement, updateElement, setSelectedElement, clearSelectedElement, setElements, setWorkIsSaved } = drawerSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectDrawer = (state: RootState) => state.drawer.elements
export const selectDrawerActiveElement = (state: RootState) => state.drawer.selectedElement
export const selectDrawerActiveElementIndex = (state: RootState) => state.drawer.selectedIndex
export const selectDrawerStatus = (state: RootState) => state.drawer.workIsSaved

export default drawerSlice.reducer