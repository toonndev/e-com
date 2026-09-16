import { Loader, Upload, X } from 'lucide-react'
import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react'
import * as ResizerModule from 'react-image-file-resizer'
import { toast } from 'react-toastify'
import { removeFiles, uploadFiles } from '../../api/product'
import useEcomStore from '../../store/ecom-store'
import type { ProductImage } from '../../types'

// react-image-file-resizer is CommonJS-only and defines its own `default`
// getter on module.exports. Vite/Rollup's CJS interop double-wraps this in
// the production bundle (works fine in dev), so `import Resize from '...'`
// silently becomes an object with no `imageFileResizer` method at runtime
// (`Resize.default.imageFileResizer is not a function`). Resolve defensively
// so it works whether the interop wraps it once, twice, or not at all.
type ResizerShape = {
  imageFileResizer: (
    file: File,
    maxWidth: number,
    maxHeight: number,
    compressFormat: string,
    quality: number,
    rotation: number,
    responseUriFunc: (data: string) => void,
    outputType: string,
  ) => void
}
const resolveResizer = (mod: unknown): ResizerShape => {
  let current = mod as { imageFileResizer?: unknown; default?: unknown }
  for (let i = 0; i < 3; i++) {
    if (typeof current?.imageFileResizer === 'function') {
      return current as ResizerShape
    }
    if (!current?.default) break
    current = current.default as typeof current
  }
  throw new Error('react-image-file-resizer: could not resolve imageFileResizer export')
}
const Resize = resolveResizer(ResizerModule)

interface UploadableForm {
  images: ProductImage[]
}

// Browsers (esp. Chrome/Firefox) cannot decode HEIC/HEIF via <img>/canvas, which
// react-image-file-resizer relies on. When decoding fails it has no onerror
// handler and hangs forever with no feedback, so reject those formats up front.
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const RESIZE_TIMEOUT_MS = 15000

const Uploadfile = <T extends UploadableForm>({
  form,
  setForm,
}: {
  form: T
  setForm: Dispatch<SetStateAction<T>>
}) => {
  const token = useEcomStore((state) => state.token)
  const [isLoading, setIsLoading] = useState(false)

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!token) return
    const files = e.target.files
    if (!files) return

    const allFiles = form.images
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} บ่แม่นรูป`)
        continue
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error(`File ${file.name} เป็นไฟล์รูปที่เบราว์เซอร์แสดงไม่ได้ (เช่น HEIC) กรุณาแปลงเป็น JPG/PNG ก่อน`)
        continue
      }

      setIsLoading(true)

      let settled = false
      const timeoutId = window.setTimeout(() => {
        if (settled) return
        settled = true
        setIsLoading(false)
        toast.error(`อัปโหลด ${file.name} ไม่สำเร็จ (หมดเวลา) ลองใหม่หรือใช้ไฟล์อื่น`)
      }, RESIZE_TIMEOUT_MS)

      Resize.imageFileResizer(
        file,
        720,
        720,
        'JPEG',
        100,
        0,
        (data) => {
          if (settled) return
          settled = true
          window.clearTimeout(timeoutId)

          uploadFiles(token, data as string)
            .then((res) => {
              allFiles.push(res.data)
              setForm({
                ...form,
                images: allFiles,
              })
              setIsLoading(false)
              toast.success('Upload image Sucess!!!')
            })
            .catch((err) => {
              console.log(err)
              setIsLoading(false)
              toast.error(`อัปโหลด ${file.name} ไม่สำเร็จ`)
            })
        },
        'base64',
      )
    }
  }

  const handleDelete = (public_id: string) => {
    if (!token) return
    const images = form.images
    removeFiles(token, public_id)
      .then((res) => {
        const filterImages = images.filter((item) => item.public_id !== public_id)
        setForm({
          ...form,
          images: filterImages,
        })
        toast.error(res.data.message)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
        รูปภาพสินค้า
      </label>

      <div className="flex flex-wrap gap-3">
        {form.images.map((item, index) => (
          <div className="relative group" key={index}>
            <img
              className="w-20 h-20 rounded-lg object-cover border border-gray-200"
              src={item.url}
              alt=""
            />

            <button
              type="button"
              onClick={() => handleDelete(item.public_id)}
              className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-0.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {isLoading && (
          <div className="w-20 h-20 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
            <Loader size={20} className="animate-spin text-gray-400" />
          </div>
        )}

        <label
          className="w-20 h-20 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center
            gap-1 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer"
        >
          <Upload size={18} />
          <span className="text-[10px]">Upload</span>
          <input
            onChange={handleOnChange}
            type="file"
            name="images"
            multiple
            className="hidden"
          />
        </label>
      </div>
    </div>
  )
}

export default Uploadfile
