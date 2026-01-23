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


export default function ForgotPassword() {

    const { setToken } = useContext(AuthContext)

    const [inCorrect, setInCorrect] = useState(null)

    const navigate = useNavigate()

    const passwordRegix = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'

    const loginSchema = yup.object({
        password: yup.string().required('password is required').matches(passwordRegix, 'password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'),
        newPassword: yup.string().required('password is required').matches(passwordRegix, 'password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character')
    })

    async function handleSubmit(values , { setSubmitting }) {
        try {
            const options = {
                url: 'https://linked-posts.routemisr.com/users/change-password',
                method: 'POST',
                data: values
            }
            const { data } = await axios.request(options)

            if (data.message === 'success') {
                setToken(data.token)
                localStorage.setItem('token', data.token)
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
                password: "",
                newPassword:""
            },

            validationSchema: loginSchema,
            onSubmit: handleSubmit
        }
    )


    return (
        <>
            <div className="login-form flex justify-center items-center bg-gray-100 p-12">
                <form onSubmit={formik.handleSubmit} className="bg-white w-3/4 rounded-xl shadow mx-auto p-6 space-y-5">
                    <header className="text-center space-y-1">
                        <h1 className="text-3xl font-bold ">Change password</h1>
                        <p>Now you try to change your password? <Link className="text-blue-500" to='/login'>Sign in</Link> </p>
                    </header>

                  

                   
                    <div className="form-body space-y-4">


                        


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
                            placeHolder='Enter your current password'
                            iconName={faLock}
                            textField='Password'
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
                            placeHolder='Enter your new password'
                            iconName={faLock}
                            textField='New Password'
                        />

                        {inCorrect ? <><div className="bg-red-100 text-red-400 p-2 rounded">* {inCorrect}</div></> : ''}

                        <div className="text-center ">
                            <button disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
                                type="submit" className="btn w-full disabled:from-gray-600 disabled:to-gray-300 disabled:cursor-not-allowed bg-linear-to-r from-blue-600 to-blue-400 text-white py-2">

                                {formik.isSubmitting ? (<><span>Changing Password...
                                </span><FontAwesomeIcon icon={faSpinner} spin /></>)
                                    :
                                    (<><span>Change Password
                                    </span><FontAwesomeIcon icon={faArrowRight} /></>)}
                            </button>
                        </div>
                    </div>


                </form>
            </div>
        </>
    )
}