import { Loader, Upload, X } from 'lucide-react'
import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react'
import Resize from 'react-image-file-resizer'
import { toast } from 'react-toastify'
import { removeFiles, uploadFiles } from '../../api/product'
import useEcomStore from '../../store/ecom-store'
import type { ProductImage } from '../../types'

interface UploadableForm {
  images: ProductImage[]
}

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
    setIsLoading(true)
    const files = e.target.files
    if (files) {
      const allFiles = form.images
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!file.type.startsWith('image/')) {
          toast.error(`File ${file.name} บ่แม่นรูป`)
          continue
        }
        Resize.imageFileResizer(
          file,
          720,
          720,
          'JPEG',
          100,
          0,
          (data) => {
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
              })
          },
          'base64',
        )
      }
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
