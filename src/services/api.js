import { apiClient } from "../lib/apiClient";

export const authApi = {
  signup: (payload) => apiClient.post("/users/signup", payload),
  signin: (payload) => apiClient.post("/users/signin", payload),
  changePassword: (payload) => apiClient.post("/users/change-password", payload),
};

export const usersApi = {
  getProfileData: () => apiClient.get("/users/profile-data"),
  uploadPhoto: (formData) => apiClient.put("/users/upload-photo", formData),
  getUserPosts: (userId, params = {}) => apiClient.get(`/users/${userId}/posts`, { params }),
  getSuggestions: (params = { limit: 10 }) => apiClient.get("/users/suggestions", { params }),
  followUser: (userId) => apiClient.put(`/users/${userId}/follow`),
  unfollowUser: (userId) => apiClient.put(`/users/${userId}/follow`),
};

export const postsApi = {
  getAllPosts: () => apiClient.get("/posts"),
  getFeed: (params = { only: "all", page: 1, limit: 20 }) => apiClient.get("/posts/feed", { params }),
  getPostById: (postId) => apiClient.get(`/posts/${postId}`),
  createPost: (formData) => apiClient.post("/posts", formData),
  updatePost: (postId, formData) => apiClient.put(`/posts/${postId}`, formData),
  deletePost: (postId) => apiClient.delete(`/posts/${postId}`),
  toggleLike: (postId) => apiClient.put(`/posts/${postId}/like`),
  getPostLikes: (postId, params = { page: 1, limit: 20 }) => apiClient.get(`/posts/${postId}/likes`, { params }),
  toggleBookmark: (postId) => apiClient.put(`/posts/${postId}/bookmark`),
  sharePost: (postId) => apiClient.post(`/posts/${postId}/share`),
};

export const commentsApi = {
  getPostComments: (postId) => apiClient.get(`/posts/${postId}/comments`),
  createPostComment: (postId, formData) => apiClient.post(`/posts/${postId}/comments`, formData),
  updatePostComment: (postId, commentId, formData) =>
    apiClient.put(`/posts/${postId}/comments/${commentId}`, formData),
  deletePostComment: (postId, commentId) => apiClient.delete(`/posts/${postId}/comments/${commentId}`),
  toggleCommentLike: (postId, commentId) => apiClient.put(`/posts/${postId}/comments/${commentId}/like`),
  getReplies: (postId, commentId) => apiClient.get(`/posts/${postId}/comments/${commentId}/replies`),
  createReply: (postId, commentId, formData) =>
    apiClient.post(`/posts/${postId}/comments/${commentId}/replies`, formData),
};

export const notificationsApi = {
  getAll: (params = { page: 1, limit: 20 }) => apiClient.get("/notifications", { params }),
  getUnreadCount: () => apiClient.get("/notifications/unread-count"),
  markAsRead: (notificationId) => apiClient.patch(`/notifications/${notificationId}/read`),
  markAllAsRead: () => apiClient.patch("/notifications/read-all"),
};
