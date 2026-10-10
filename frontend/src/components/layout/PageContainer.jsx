function PageContainer({children, className = ''}){
    return (
        <div className={`p-6 lg:p-8 ${className}`}>
            <div className='mx-auto max-w-7xl'>{children}</div>
        </div>
    )
}

export default PageContainer