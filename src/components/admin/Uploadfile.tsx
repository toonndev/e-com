import { Loader } from 'lucide-react'
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
    <div className="my-4">
      <div className="flex mx-4 gap-4 my-4">
        {isLoading && <Loader className="w-16 h-16 animate-spin" />}

        {form.images.map((item, index) => (
          <div className="relative" key={index}>
            <img className="w-24 h-24 hover:scale-105" src={item.url} alt="" />

            <span
              onClick={() => handleDelete(item.public_id)}
              className="absolute top-0 right-0 bg-red-500 p-1 rounded-md"
            >
              X
            </span>
          </div>
        ))}
      </div>

      <div>
        <input onChange={handleOnChange} type="file" name="images" multiple />
      </div>
    </div>
  )
}

export default Uploadfile
