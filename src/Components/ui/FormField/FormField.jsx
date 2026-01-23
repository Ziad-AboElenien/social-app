import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function FormField({
    elementType,
    type,
    id,
    name,
    value,
    onChange,
    onBlur,
    placeHolder,
    iconName,
    textField,
    className,
    touched,
    errors,
    options,
    accIsExist

}) {

    const renderElement = () => {
        if(elementType == 'input') {
            return <>
                <input
                    id={id}
                    name={name}
                        value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    type={type} placeholder={placeHolder}
                    className={`form-control ${className}`} />
            </>
        }
        else if(elementType == 'select') {
            return <>
                <select
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={`form-control ${className}`}
                >
                    {options.map((option, index) => {
                        return (<><option key={index} value={option.value}>{option.text}</option></>) })}
                </select>
            </>
        
        }}


    return (
        <>
            <div>
                <label htmlFor={id}>{textField}</label>
                <div className="relative">
                    {renderElement()}
                    <FontAwesomeIcon className="absolute left-2 text-sm top-1/2 -translate-y-1/2 text-gray-400" icon={iconName} />
                </div>
                {errors && touched ? <p className="text-red-500 pt-1">* {errors}</p> : ''}
                {accIsExist && <><p className="text-red-500 pt-1">* {accIsExist}</p></>}
            </div>
        </>
    )
}