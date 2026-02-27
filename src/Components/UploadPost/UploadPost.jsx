import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faFaceSmile, faImage, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as yup from "yup";
import { useUI } from "../Hooks/useUI";
import { postsApi, usersApi } from "../../services/api";
import profileImg from "../../assets/images/prof.png";

export default function UploadPost({ getAllPosts }) {
  const { showAlert } = useUI();
  const [imagePreview, setImagePreview] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const { data } = await usersApi.getProfileData();
        setUser(data.data.user);
      } catch {
        setUser(null);
      }
    }
    loadUser();
  }, []);

  const uploadPostValidationSchema = yup.object({
    body: yup.string().required("caption is required").min(2, "caption is too short").max(300, "caption is too long"),
    image: yup
      .mixed()
      .nullable()
      .test("fileSize", "file size must be less than 5MB", (file) => (!file ? true : file.size <= 5 * 1024 * 1024)),
  });

  async function handleOnSubmit(values, { resetForm }) {
    try {
      const formData = new FormData();
      formData.append("body", values.body);
      if (values.image) formData.append("image", values.image);
      const { data } = await postsApi.createPost(formData);
      if (data.success) {
        resetForm();
        setImagePreview(null);
        showAlert({
          type: "success",
          title: "Post Created",
          message: "Your post has been published successfully.",
        });
        getAllPosts();
      }
    } catch (error) {
      showAlert({
        type: "error",
        title: "Create Post Failed",
        message: error.response?.data?.error || "Your post could not be created.",
      });
    }
  }

  const formik = useFormik({
    initialValues: { body: "", image: null },
    validationSchema: uploadPostValidationSchema,
    onSubmit: handleOnSubmit,
  });

  const userPhoto = user?.photo && !user.photo.includes("undefined") ? user.photo : profileImg;

  return (
    <form onSubmit={formik.handleSubmit} className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="mb-4 flex items-center gap-3">
        <img className="h-11 w-11 rounded-full object-cover" src={userPhoto} alt="Profile" />
        <div>
          <p className="text-lg font-extrabold text-slate-900">{user?.name || "User"}</p>
          <button type="button" className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Public <FontAwesomeIcon icon={faChevronDown} className="ml-1" />
          </button>
        </div>
      </header>

      <textarea
        name="body"
        value={formik.values.body}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={`What's on your mind, ${user?.name?.split(" ")[0] || "friend"}?`}
        className="h-44 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xl text-slate-700 outline-none focus:border-blue-300"
      ></textarea>

      {formik.errors.body && formik.touched.body ? <p className="mt-2 text-sm font-semibold text-red-500">{formik.errors.body}</p> : null}

      {imagePreview ? (
        <img src={imagePreview} alt="preview" className="mt-3 max-h-80 w-full rounded-xl border border-slate-200 object-cover" />
      ) : null}

      <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
        <div className="flex items-center gap-5 text-slate-600">
          <label htmlFor="post-image" className="cursor-pointer font-bold">
            <FontAwesomeIcon icon={faImage} className="mr-2 text-green-500" />
            Photo/video
          </label>
          <button type="button" className="font-bold">
            <FontAwesomeIcon icon={faFaceSmile} className="mr-2 text-yellow-500" />
            Feeling/activity
          </button>
          <input
            id="post-image"
            name="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              formik.setFieldValue("image", file);
              setImagePreview(file ? URL.createObjectURL(file) : null);
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!formik.values.body.trim()}
          className="rounded-xl bg-blue-500 px-8 py-2 text-sm font-bold text-white disabled:opacity-50"
        >
          Post <FontAwesomeIcon icon={faPaperPlane} className="ml-2" />
        </button>
      </div>
    </form>
  );
}

