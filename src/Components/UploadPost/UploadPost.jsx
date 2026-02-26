import x from '../../assets/images/prof.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faPaperPlane, faTrash, faSmile, faMapMarkerAlt, faVideo, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { useContext, useState } from 'react'
import { AuthContext } from '../../Context/Auth.context'
import { toast } from 'react-toastify'

export default function UploadPost({ getAllPosts }) {

    const { token } = useContext(AuthContext)

    const [imageReview, setImageReview] = useState(null)
    const [isExpanded, setIsExpanded] = useState(false)

    const uploadPostValidiationSchema = yup.object({
        body: yup.string('').required('caption is required').min(3, 'caption must be more than 3 char').max(300, 'caption must be less than 300 char'),
        image: yup.mixed().nullable().test('fileSize', 'file size must be less than 5MB', (file) => {
            if (!file) return true;
            else {
                return file.size <= 5 * 1024 * 1024
            }
        }).test("fileType", "file type must be one of png, jpg, jpeg, gif", (file) => {
            if (!file) return true;
            else {
                const supportedTypes = ["image/png", 'image/jpg', 'image/jpeg', 'image/gif','image/webp']
                return supportedTypes.includes(file.type)
            }
        })
    })

    async function handleOnSubmit(values) {
        try {
            const formData = new FormData()
            formData.append("body", values.body)
            if (values.image) {
                formData.append("image", values.image)
            }
            const options = {
                url: `https://route-posts.routemisr.com/posts`,
                method: 'POST',
                headers: {
                    token
                },
                data: formData
            }
            const { data } = await axios.request(options)
            if (data.success) {
                formik.resetForm()
                setImageReview(null);
                toast.success('your post has successfuly created')
                getAllPosts()
            }
            console.log(data);

        } catch (error) {
            toast.success('your post has not created')
            console.log("error in uploading post", error);
        }

    }

    const formik = useFormik({
        initialValues: {
            body: '',
            image: null
        },

        validationSchema: uploadPostValidiationSchema,

        onSubmit: handleOnSubmit
    })

    return (
        <>
            <form onSubmit={formik.handleSubmit} className="bg-white p-3 max-w-2xl mx-auto  sm:p-5 mt-3 sm:mt-5 rounded-lg sm:rounded-xl shadow-md border border-gray-100" >
                {/* Header */}
                <header className='flex gap-2 sm:gap-3 items-center pb-2 sm:pb-4 border-b border-gray-100'>
                    <img className='size-9 sm:size-12 rounded-full object-cover ring-2 ring-blue-500 ring-offset-2' src={x} alt="Profile" />
                    <div className="flex-1 min-w-0">
                        <p className='font-semibold text-gray-800 text-sm sm:text-base'>Create a post</p>
                        <p className='text-xs sm:text-sm text-gray-500'>Share your thoughts</p>
                    </div>
                </header>

                {/* Body */}
                <div className="body pt-4">
                    <textarea
                        name="body"
                        id="body"
                        value={formik.values.body}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onFocus={() => setIsExpanded(true)}
                        error={formik.errors.body}
                        touched={formik.touched.body}
                        placeholder="What's on your mind?"
                        className={`w-full resize-none bg-gray-50 border-2 border-transparent rounded-lg sm:rounded-xl p-2 sm:p-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 text-sm sm:text-base text-gray-700 placeholder-gray-400 ${isExpanded ? 'h-24 sm:h-32' : 'h-16 sm:h-20'}`}
                    ></textarea>
                    
                    {formik.errors.body && formik.touched.body ? (
                        <div className='flex items-center gap-2 text-red-600 bg-red-50 rounded-lg px-3 text-sm py-2 mb-3 mt-2'>
                            <FontAwesomeIcon icon={faTimes} className="text-xs" />
                            <span>{formik.errors.body}</span>
                        </div>
                    ) : null}

                    {/* Image Preview */}
                    {imageReview && (
                        <div className="image-review relative mt-4 group">
                            <img 
                                className='w-full max-h-80 object-cover rounded-xl border border-gray-200' 
                                src={imageReview} 
                                alt="Preview" 
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-all duration-300"></div>
                            <button 
                                type='button' 
                                onClick={() => {
                                    setImageReview(null);
                                    formik.setFieldValue('image', null);
                                }} 
                                className='absolute top-3 right-3 size-9 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg hover:scale-110 transition-all duration-200 flex items-center justify-center'
                            >
                                <FontAwesomeIcon icon={faTrash} className="text-sm" />
                            </button>
                        </div>
                    )}

                    {formik.errors.image && formik.touched.image ? (
                        <div className='flex items-center gap-2 text-red-600 bg-red-50 rounded-lg px-3 text-sm py-2 mt-2'>
                            <FontAwesomeIcon icon={faTimes} className="text-xs" />
                            <span>{formik.errors.image}</span>
                        </div>
                    ) : null}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-t pt-2 sm:pt-4 mt-3 sm:mt-4 border-gray-100 gap-2 sm:gap-0">
                        <div className="flex gap-1 overflow-x-auto pb-2 sm:pb-0 -mx-1 px-1">
                            {/* Image Upload */}
                            <label htmlFor="image" className="cursor-pointer flex-shrink-0">
                                <input
                                    id='image'
                                    name='image'
                                    type="file"
                                    accept="image/*"
                                    className='hidden'
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            formik.setFieldValue('image', file);
                                            const url = URL.createObjectURL(file);
                                            setImageReview(url);
                                        }
                                    }}
                                    onBlur={formik.handleBlur}
                                />
                                <div className='flex items-center gap-1 px-2 py-1.5 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-all duration-300 text-xs whitespace-nowrap'>
                                    <FontAwesomeIcon icon={faImage} />
                                    <span className='hidden sm:inline'>Photo</span>
                                </div>
                            </label>

                            {/* Video Button (static) */}
                            <button type="button" className='flex items-center gap-1 px-2 py-1.5 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-all duration-300 text-xs whitespace-nowrap'>
                                <FontAwesomeIcon icon={faVideo} />
                                <span className='hidden sm:inline'>Video</span>
                            </button>

                            {/* Emoji Button (static) */}
                            <button type="button" className='flex items-center gap-1 px-2 py-1.5 bg-yellow-50 text-yellow-600 rounded-full hover:bg-yellow-100 transition-all duration-300 text-xs whitespace-nowrap'>
                                <FontAwesomeIcon icon={faSmile} />
                                <span className='hidden sm:inline'>Feeling</span>
                            </button>

                            {/* Location Button (static) */}
                            <button type="button" className='flex items-center gap-1 px-2 py-1.5 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-all duration-300 text-xs whitespace-nowrap'>
                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                                <span className='hidden sm:inline'>Location</span>
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type='submit' 
                            disabled={!formik.values.body.trim()}
                            className='w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md transition-all duration-300 text-sm'
                        >
                            <FontAwesomeIcon icon={faPaperPlane} />
                            <span>Post</span>
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
}