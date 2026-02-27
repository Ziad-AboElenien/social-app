import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faSave, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import PostCardSkelton from "../../Components/PostCardSkelton/PostCardSkelton";
import ConfirmModal from "../../Components/ui/ConfirmModal/ConfirmModal";
import { postsApi } from "../../services/api";
import { useUI } from "../../Components/Hooks/useUI";

export default function UpdatePost() {
  const [post, setPost] = useState(null);
  const [body, setBody] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const fileInputRef = useRef(null);
  const { postId } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useUI();

  const hasChanges = body.trim() !== (post?.body || "").trim() || Boolean(selectedImage);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      try {
        const { data } = await postsApi.getPostById(postId);
        const resolvedPost = data.data?.post || data.post || data.data;
        setPost(resolvedPost);
        setBody(resolvedPost?.body || "");
      } catch {
        showAlert({
          type: "error",
          title: "Load Failed",
          message: "Failed to load post details.",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [postId]);

  function handleSelectImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showAlert({
        type: "error",
        title: "Invalid Image",
        message: "Image must be less than 5MB.",
      });
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim()) {
      showAlert({
        type: "error",
        title: "Invalid Content",
        message: "Post content cannot be empty.",
      });
      return;
    }
    if (!hasChanges) {
      showAlert({
        type: "info",
        title: "No Changes",
        message: "Update at least one field before saving.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("body", body.trim());
      if (selectedImage) formData.append("image", selectedImage);
      await postsApi.updatePost(postId, formData);
      showAlert({
        type: "success",
        title: "Post Updated",
        message: "Your post has been updated successfully.",
      });
      navigate("/");
    } catch (error) {
      showAlert({
        type: "error",
        title: "Update Failed",
        message: error.response?.data?.error || "Failed to update post.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <PostCardSkelton />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-xl bg-white p-8 text-center shadow">
          <p className="text-red-600">Post not found.</p>
        </div>
      </div>
    );
  }

  const imageToShow = previewUrl || post.image;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-4">
      <form onSubmit={handleSubmit} className="overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="border-b bg-gray-50 p-4">
          <p className="font-semibold text-gray-800">Edit Post</p>
        </div>

        <div className="space-y-4 p-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What's on your mind?"
            rows={5}
            className="w-full resize-none rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
          />

          {imageToShow ? (
            <div className="relative">
              <img src={imageToShow} alt="post" className="max-h-80 w-full rounded-lg border object-cover" />
              {previewUrl ? (
                <button
                  type="button"
                  onClick={() => {
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                    setSelectedImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              ) : null}
            </div>
          ) : null}

          <input ref={fileInputRef} id="post-image" type="file" accept="image/*" onChange={handleSelectImage} className="hidden" />
          <label htmlFor="post-image" className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-3 hover:bg-blue-50">
            <FontAwesomeIcon icon={faCamera} />
            <span>{imageToShow ? "Change Image" : "Add Image"}</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 border-t bg-gray-50 p-4">
          <button
            type="button"
            disabled={submitting}
            onClick={() => {
              if (hasChanges) {
                setShowDiscardModal(true);
                return;
              }
              navigate("/");
            }}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>

      <ConfirmModal
        isOpen={showDiscardModal}
        title="Discard Changes"
        message="You have unsaved changes. Are you sure you want to leave?"
        confirmText="Discard"
        cancelText="Continue Editing"
        type="warning"
        onConfirm={() => navigate("/")}
        onCancel={() => setShowDiscardModal(false)}
      />
    </div>
  );
}

