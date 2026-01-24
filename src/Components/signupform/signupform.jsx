import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router";
import { faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faArrowRight, faCalendar, faEnvelope, faLock, faSpinner, faUser, faVenusMars } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as yup from 'yup';
import { toast } from "react-toastify";
import FormField from "../ui/FormField/FormField";
import axios from "axios";
import { useState } from "react";

export default function SignUpForm() {
    const [isExist , setIsExist]=useState(null)

    const navigate = useNavigate()

    const passwordRegix = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'

    const signupSchema = yup.object({
        name: yup.string().required('name is required').min(3, "must be at least 3 characters").max(20, 'must be at most 20 characters'),
        email: yup.string().required('email is required').email('must be a valid email address'),
        password: yup.string().required('password is required').matches(passwordRegix, 'password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'),
        rePassword: yup.string().required('please confirm your password').oneOf([yup.ref('password')], 'passwords must match'),
        dateOfBirth:yup.string().required('date of birth is required'),
        gender: yup.string().required('gender is required').oneOf(['male', 'female'], 'please select a valid gender')
    })

    async function handleSubmit(values) {
        try {
            const options = {
                url: 'https://linked-posts.routemisr.com/users/signup',
                method: 'POST',
                data: values
            }
            const { data } = await axios.request(options)

            if (data.message === 'success') {
                toast.success('Your Account successfuly created')

                setTimeout(() => {
                    navigate('/login')
                }, 5000);
            }
        } catch (error) {
            console.log("your in ther catch block ❌")
            console.log(error)
            setIsExist(error.response.data.error)
        }



    }

    const formik = useFormik(
        {
            initialValues: {
                name: "",
                email: "",
                password: "",
                rePassword: "",
                dateOfBirth: "",
                gender: ""
            },

            validationSchema: signupSchema,
            onSubmit: handleSubmit
        }
    )


    return (
        <>
            <div className="signup-form flex justify-center items-center bg-gray-100 p-4 sm:p-8 md:p-12 min-h-screen">
                <form onSubmit={formik.handleSubmit} className="bg-white w-full sm:w-4/5 md:w-3/4 lg:w-full rounded-xl shadow mx-auto p-4 sm:p-6 space-y-5 max-w-md">
                    <header className="text-center space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-bold ">Create account</h1>
                        <p className="text-sm sm:text-base">Already have an account? <Link className="text-blue-500" to='/login'>Sign in</Link> </p>
                    </header>

                    <div className="social-btns flex *:grow gap-3">
                        <button className="btn "><FontAwesomeIcon icon={faGoogle} className="text-red-500" /><span>Google</span></button>
                        <button className="btn text-white bg-blue-500 "><FontAwesomeIcon icon={faFacebookF} className="" /><span>Facebook</span></button>
                    </div>

                    <div className="seprator text-center">
                        <p className="relative mx-auto w-fit text-sm text-gray-500 before:absolute before:w-4/6 before:h-px before:bg-linear-to-r before:from-transparent before:via-gray-400 before:to-transparent before:right-11/10 before:top-1/2 before:-translate-y-0.5 after:absolute after:w-4/6 after:h-px after:bg-linear-to-r after:from-transparent after:via-gray-400 after:to-transparent after:left-11/10 after:top-1/2 after:-translate-y-0.5">or continue with email</p>
                    </div>

                    <div className="form-body space-y-4">

                        <FormField
                            elementType='input'
                            type='text'
                            id='name'
                            name='name'
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeHolder='Enter Your Name'
                            iconName={faUser}
                            textField='Full Name'
                            touched={formik.touched.name}
                            errors={formik.errors.name}
                        />


                        <FormField
                            elementType='input'
                            type='email'
                            id='email'
                            name='email'
                            value={formik.values.email}
                            touched={formik.touched.email}
                            errors={formik.errors.email}
                            onChange={(e)=>{
                                formik.handleChange(e)
                                setIsExist(null)
                            }}
                            onBlur={formik.handleBlur}
                            placeHolder='name@example.com'
                            iconName={faEnvelope}
                            textField='Email Address'
                            accIsExist={isExist}
                        />


                        <FormField
                            elementType='input'
                            type='password'
                            id='password'
                            name='password'
                            value={formik.values.password}
                            touched={formik.touched.password}
                            errors={formik.errors.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeHolder='Enter your password'
                            iconName={faLock}
                            textField='Password'
                        />


                        <FormField
                            elementType='input'
                            type='password'
                            id='rePassword'
                            name='rePassword'
                            value={formik.values.rePassword}
                            touched={formik.touched.rePassword}
                            errors={formik.errors.rePassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeHolder='confirm your password'
                            iconName={faLock}
                            textField='rePassword'
                        />

                        <div className="div grid grid-cols-1 sm:grid-cols-2 gap-2 ">

                            <FormField
                                elementType='input'
                                type='date'
                                id='dateOfBirth'
                                name='dateOfBirth'
                                value={formik.values.dateOfBirth}
                                touched={formik.touched.dateOfBirth}
                                errors={formik.errors.dateOfBirth}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                iconName={faCalendar}
                                textField='Date of Birth'
                            />

                            <FormField
                                elementType='select'
                                id='gender'
                                name='gender'
                                value={formik.values.gender}
                                touched={formik.touched.gender}
                                errors={formik.errors.gender}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                iconName={faCalendar}
                                textField='Date of Birth'
                                options={[{ value: '', text: "select your gender" },
                                { value: 'male', text: "Male" },
                                { value: 'female', text: "Female" }
                                ]}
                                className='py-1'
                            />
                        </div>

                        <div className="text-center ">
                            <button disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
                                type="submit" className="btn w-full disabled:from-gray-600 disabled:to-gray-300 disabled:cursor-not-allowed bg-linear-to-r from-blue-600 to-blue-400 text-white py-2">

                                {formik.isSubmitting ? (<><span>Creating Your Account</span><FontAwesomeIcon icon={faSpinner} spin /></>)
                                    :
                                    (<><span>Create Account</span><FontAwesomeIcon icon={faArrowRight} /></>)}
                            </button>
                        </div>
                    </div>


                </form>
            </div>
        </>
    )
}