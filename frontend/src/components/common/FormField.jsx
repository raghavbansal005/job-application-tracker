function FormField({ id, label, required, children }) {
    return (
        <div className='space-y-2'>
            <label htmlFor={id} className='text-sm font-medium text-foreground'>
                {label}{required && <span className='ml-1 text-destructive'>*</span>}
            </label>
            {children}
        </div>
    )
}

export default FormField