import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router";
import { faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faArrowRight, faCalendar, faEnvelope, faLock, faSpinner, faUser } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as yup from "yup";
import FormField from "../ui/FormField/FormField";
import { useState } from "react";
import { authApi } from "../../services/api";
import { useUI } from "../Hooks/useUI";

export default function SignUpForm() {
  const [isExistEmail, setIsExistEmail] = useState(null);
  const [isExistUsername, setIsExistUsername] = useState(null);
  const navigate = useNavigate();
  const { showAlert } = useUI();

  const passwordRegix = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$";

  const signupSchema = yup.object({
    name: yup.string().required("name is required").min(3, "must be at least 3 characters").max(20, "must be at most 20 characters"),
    username: yup
      .string()
      .required("username is required")
      .min(3, "must be at least 3 characters")
      .max(20, "must be at most 20 characters")
      .matches(/^[a-z0-9_]{3,30}$/, "username must contain only lowercase letters, numbers and underscores"),
    email: yup.string().required("email is required").email("must be a valid email address"),
    password: yup
      .string()
      .required("password is required")
      .matches(passwordRegix, "password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"),
    rePassword: yup.string().required("please confirm your password").oneOf([yup.ref("password")], "passwords must match"),
    dateOfBirth: yup.string().required("date of birth is required"),
    gender: yup.string().required("gender is required").oneOf(["male", "female"], "please select a valid gender"),
  });

  async function handleSubmit(values, { setSubmitting }) {
    try {
      const { data } = await authApi.signup(values);
      if (data.success) {
        showAlert({
          type: "success",
          title: "Account Created",
          message: "Your account has been created successfully.",
        });
        navigate("/login");
      }
    } catch (error) {
      const errors = error.response?.data?.errors || "Unable to create account.";
      if (errors.includes("user already exists")) {
        setIsExistEmail(errors);
        setIsExistUsername(null);
      } else if (errors.includes("username already exists")) {
        setIsExistUsername(errors);
        setIsExistEmail(null);
      }
      showAlert({
        type: "error",
        title: "Signup Failed",
        message: errors,
      });
    } finally {
      setSubmitting(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    validationSchema: signupSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="signup-form flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-8 md:p-12">
      <form onSubmit={formik.handleSubmit} className="mx-auto w-full max-w-md space-y-5 rounded-xl bg-white p-4 shadow sm:w-4/5 sm:p-6 md:w-3/4 lg:w-full">
        <header className="space-y-1 text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Create account</h1>
          <p className="text-sm sm:text-base">
            Already have an account?{" "}
            <Link className="text-blue-500" to="/login">
              Sign in
            </Link>
          </p>
        </header>

        <div className="social-btns flex gap-3 *:grow">
          <button className="btn" type="button">
            <FontAwesomeIcon icon={faGoogle} className="text-red-500" />
            <span>Google</span>
          </button>
          <button className="btn bg-blue-500 text-white" type="button">
            <FontAwesomeIcon icon={faFacebookF} />
            <span>Facebook</span>
          </button>
        </div>

        <div className="seprator text-center">
          <p className="relative mx-auto w-fit text-sm text-gray-500 before:absolute before:right-11/10 before:top-1/2 before:h-px before:w-4/6 before:-translate-y-0.5 before:bg-linear-to-r before:from-transparent before:via-gray-400 before:to-transparent after:absolute after:left-11/10 after:top-1/2 after:h-px after:w-4/6 after:-translate-y-0.5 after:bg-linear-to-r after:from-transparent after:via-gray-400 after:to-transparent">
            or continue with email
          </p>
        </div>

        <div className="form-body relative space-y-4">
          <FormField
            elementType="input"
            type="text"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeHolder="Enter Your Name"
            iconName={faUser}
            textField="Full Name"
            touched={formik.touched.name}
            errors={formik.errors.name}
          />

          <FormField
            elementType="input"
            type="text"
            id="username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeHolder="Enter Your Username"
            iconName={faUser}
            textField="Username"
            touched={formik.touched.username}
            errors={formik.errors.username}
            isExist={isExistUsername}
          />

          <FormField
            elementType="input"
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            touched={formik.touched.email}
            errors={formik.errors.email}
            onChange={(e) => {
              formik.handleChange(e);
              setIsExistEmail(null);
            }}
            onBlur={formik.handleBlur}
            placeHolder="name@example.com"
            iconName={faEnvelope}
            textField="Email Address"
            isExist={isExistEmail}
          />

          <FormField
            elementType="input"
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            touched={formik.touched.password}
            errors={formik.errors.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeHolder="Enter your password"
            iconName={faLock}
            textField="Password"
          />

          <FormField
            elementType="input"
            type="password"
            id="rePassword"
            name="rePassword"
            value={formik.values.rePassword}
            touched={formik.touched.rePassword}
            errors={formik.errors.rePassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeHolder="confirm your password"
            iconName={faLock}
            textField="rePassword"
          />

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <FormField
              elementType="input"
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formik.values.dateOfBirth}
              touched={formik.touched.dateOfBirth}
              errors={formik.errors.dateOfBirth}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              iconName={faCalendar}
              textField="Date of Birth"
            />

            <FormField
              elementType="select"
              id="gender"
              name="gender"
              value={formik.values.gender}
              touched={formik.touched.gender}
              errors={formik.errors.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              iconName={faCalendar}
              textField="Gender"
              options={[
                { value: "", text: "select your gender" },
                { value: "male", text: "Male" },
                { value: "female", text: "Female" },
              ]}
              className="py-1"
            />
          </div>

          <div className="text-center">
            <button
              disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
              type="submit"
              className="btn w-full bg-linear-to-r from-blue-600 to-blue-400 py-2 text-white disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-300"
            >
              {formik.isSubmitting ? (
                <>
                  <span>Creating Your Account</span>
                  <FontAwesomeIcon icon={faSpinner} spin />
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

