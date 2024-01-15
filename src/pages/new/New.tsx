import Navbar from "../../components/navbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined"
import "./new.scss"
import { useEffect, useState } from "react"
import { createDoc, signUp, uploadImage } from "../../firebase"

type T = {
  id: number
  label: string
  type: string
  placeholder?: string
}

type Props = {
  inputs: Array<T>
  title: string
}

export type Data = {
  imageUrl: string
  username: string
  fullname: string
  email: string
  phone: string
  password: string
  address: string
  country: string
}

const INITIAL_STATE = {
  imageUrl: "",
  username: "",
  name: "",
  email: "",
  phone: "",
  password: "",
  address: "",
  country: "",
}

const New = ({ inputs, title }: Props) => {
  //states
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState(INITIAL_STATE)
  const [perct, setPerct] = useState<number>(null)

  //functions
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files[0])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let res = await signUp(data.email, data.password)
    res = await createDoc(data, "users", res.user.uid)
    console.log(res)
  }

  //effects
  useEffect(() => {
    file && uploadImage(file, setData, setPerct)
  }, [file])

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt="img"
            />
          </div>
          <div className="right">
            <form onSubmit={handleAdd}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  onChange={handleFile}
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                />
              </div>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    type={input.type}
                    placeholder={input.placeholder}
                    name={input.label.split(" ")[0].toLowerCase()}
                    onChange={handleChange}
                    value={data[input.label.split(" ")[0].toLowerCase()]}
                    required
                  />
                </div>
              ))}
              <button type="submit" disabled={perct !== 100}>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default New
