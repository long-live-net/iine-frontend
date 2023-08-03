const backendBaseUrl = import.meta.env.VITE_BACKEND_BASEURL

const apiFetch = $fetch.create({
  baseURL: backendBaseUrl ?? '',
})
export default apiFetch
