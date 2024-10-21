import * as yup from "yup"

export const InlineSchema = yup.object({
    data: yup.string().required('is required'),
})