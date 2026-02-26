import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import CustomSelect from "../customSelect/customSelect"

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
    isExist

}) {

    const renderElement = () => {
        if (elementType == 'input') {
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
        else if (elementType == 'select') {
            return <>
                <CustomSelect
                    options={options}
                    value={value}
                    onChange={onChange}
                    name={name}
                />
            </>

        }
    }


    return (
        <>
            <div>
                <label htmlFor={id}>{textField}</label>
                <div className="relative">
                    {renderElement()}
                    <FontAwesomeIcon className="absolute left-2 text-sm top-1/2 -translate-y-1/2 text-gray-400" icon={iconName} />
                </div>
                {errors && touched ? <p className="text-red-500 pt-1">* {errors}</p> : ''}
                {isExist && <><p className="text-red-500 pt-1">* {isExist}</p></>}
            </div>
        </>
    )
}