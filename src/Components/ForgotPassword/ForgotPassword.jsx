import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router";
import { faArrowRight, faLock, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as yup from "yup";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/Auth.context";
import FormField from "../ui/FormField/FormField";
import { authApi } from "../../services/api";
import { useUI } from "../Hooks/useUI";

export default function ForgotPassword() {
  const { setToken } = useContext(AuthContext);
  const [inCorrect, setInCorrect] = useState(null);
  const navigate = useNavigate();
  const { showAlert } = useUI();

  const passwordRegix = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$";

  const schema = yup.object({
    password: yup
      .string()
      .required("password is required")
      .matches(passwordRegix, "password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"),
    newPassword: yup
      .string()
      .required("new password is required")
      .matches(passwordRegix, "password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"),
  });

  async function handleSubmit(values, { setSubmitting }) {
    try {
      const { data } = await authApi.changePassword(values);
      if (data.success || data.message === "success") {
        const nextToken = data.data?.token || data.token;
        if (nextToken) {
          setToken(nextToken);
          localStorage.setItem("token", nextToken);
        }
        showAlert({
          type: "success",
          title: "Password Updated",
          message: "Your password was changed successfully.",
        });
        navigate("/");
      }
    } catch (error) {
      const message = error.response?.data?.error || "Failed to change password.";
      setInCorrect(message);
      showAlert({
        type: "error",
        title: "Update Failed",
        message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  const formik = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
    },
    validationSchema: schema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="login-form flex items-center justify-center bg-gray-100 p-6 md:p-12">
      <form onSubmit={formik.handleSubmit} className="mx-auto w-full max-w-xl space-y-5 rounded-xl bg-white p-6 shadow">
        <header className="space-y-1 text-center">
          <h1 className="text-3xl font-bold">Change password</h1>
          <p>
            Back to{" "}
            <Link className="text-blue-500" to="/login">
              Sign in
            </Link>
          </p>
        </header>

        <div className="form-body space-y-4">
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
            placeHolder="Enter your current password"
            iconName={faLock}
            textField="Current Password"
          />
          <FormField
            elementType="input"
            type="password"
            id="newPassword"
            name="newPassword"
            value={formik.values.newPassword}
            touched={formik.touched.newPassword}
            errors={formik.errors.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeHolder="Enter your new password"
            iconName={faLock}
            textField="New Password"
          />

          {inCorrect ? <div className="rounded bg-red-100 p-2 text-red-500">* {inCorrect}</div> : ""}

          <div className="text-center">
            <button
              disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
              type="submit"
              className="btn w-full bg-linear-to-r from-blue-600 to-blue-400 py-2 text-white disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-300"
            >
              {formik.isSubmitting ? (
                <>
                  <span>Changing Password...</span>
                  <FontAwesomeIcon icon={faSpinner} spin />
                </>
              ) : (
                <>
                  <span>Change Password</span>
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

