import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router";
import { faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faArrowRight, faEnvelope, faLock, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as yup from 'yup';
import { toast } from "react-toastify";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/Auth.context";
import FormField from "../ui/FormField/FormField";


export default function LoginForm() {

    const { setToken } = useContext(AuthContext)

    const [inCorrect, setInCorrect] = useState(null)

    const navigate = useNavigate()

    const passwordRegix = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'

    const loginSchema = yup.object({
        email: yup.string().required('email is required').email('must be a valid email address'),
        password: yup.string().required('password is required').matches(passwordRegix, 'password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character')
    })

    async function handleSubmit(values , { setSubmitting }) {
        try {
            const options = {
                url: 'https://route-posts.routemisr.com/users/signin',
                method: 'POST',
                data: values
            }
            const { data } = await axios.request(options)

            if (data.success) {
                setToken(data.data.token)
                localStorage.setItem('token', data.data.token)
                toast.success('Welcome Back!')

                setTimeout(() => {
                    navigate('/')
                }, 5000);
            }
        } catch (error) {
            setInCorrect(error.response.data.error)
        } finally{
            setSubmitting(false)
        }


    }

    const formik = useFormik(
        {
            initialValues: {
                email: "",
                password: ""
            },

            validationSchema: loginSchema,
            onSubmit: handleSubmit
        }
    )


    return (
        <>
            <div className="login-form flex justify-center items-center bg-gray-100 p-4 sm:p-8 md:p-12 min-h-screen">
                <form onSubmit={formik.handleSubmit} className="bg-white w-full sm:w-4/5 md:w-3/4 lg:w-full rounded-xl shadow mx-auto p-4 sm:p-6 space-y-5 max-w-md">
                    <header className="text-center space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-bold ">Login</h1>
                        <p className="text-sm sm:text-base">You dont have an account? <Link className="text-blue-500" to='/signup'>Sign up</Link> </p>
                    </header>

                    <div className="social-btns flex *:grow gap-3">
                        <button type="button" className="btn "><FontAwesomeIcon icon={faGoogle} className="text-red-500" /><span>Google</span></button>
                        <button type="button" className="btn text-white bg-blue-500 "><FontAwesomeIcon icon={faFacebookF} className="" /><span>Facebook</span></button>
                    </div>

                    <div className="seprator text-center">
                        <p className="relative mx-auto w-fit text-sm text-gray-500 before:absolute before:w-4/6 before:h-px before:bg-linear-to-r before:from-transparent before:via-gray-400 before:to-transparent before:right-11/10 before:top-1/2 before:-translate-y-0.5 after:absolute after:w-4/6 after:h-px after:bg-linear-to-r after:from-transparent after:via-gray-400 after:to-transparent after:left-11/10 after:top-1/2 after:-translate-y-0.5">or continue with email</p>
                    </div>

                    <div className="form-body space-y-4">


                        <FormField
                            elementType='input'
                            type='email'
                            id='email'
                            name='email'
                            value={formik.values.email}
                            touched={formik.touched.email}
                            errors={formik.errors.email}
                            onChange={(e) => {
                                formik.handleChange(e)
                            }}
                            onBlur={formik.handleBlur}
                            placeHolder='name@example.com'
                            iconName={faEnvelope}
                            textField='Email Address'
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

                        {inCorrect ? <><div className="bg-red-100 text-red-400 p-2 rounded">* {inCorrect}</div></> : ''}

                            <Link to='/forgot-password'><p className="text-red-400 text-sm cursor-pointer">Forget Password ?</p></Link>
                        <div className="text-center ">
                            <button disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
                                type="submit" className="btn w-full disabled:from-gray-600 disabled:to-gray-300 disabled:cursor-not-allowed bg-linear-to-r from-blue-600 to-blue-400 text-white py-2">

                                {formik.isSubmitting ? (<><span>Logging in...
                                </span><FontAwesomeIcon icon={faSpinner} spin /></>)
                                    :
                                    (<><span>Login
                                    </span><FontAwesomeIcon icon={faArrowRight} /></>)}
                            </button>
                        </div>
                    </div>


                </form>
            </div>
        </>
    )
}