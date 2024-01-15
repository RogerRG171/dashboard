import { useContext, useState } from "react"
import { login } from "../../firebase"
import "./login.scss"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

type Props = {}

const INITIAL_STATE = {
  email: "",
  password: "",
}

const Login = (props: Props) => {
  //states
  const [error, setError] = useState(false)
  const [formData, setFormData] = useState(INITIAL_STATE)

  //context
  const { dispatch } = useContext(AuthContext)

  //navigation
  const navigate = useNavigate()

  //functions
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await login(formData.email, formData.password)
    if (res.error) {
      console.log(res.error.message)
      setError(true)
    } else {
      console.log(res.user)
      dispatch({ type: "LOGIN", payload: res.user })
      setError(false)
      navigate("/")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  return (
    <div className="login">
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
        {error && <span>Wrong email or password!</span>}
      </form>
    </div>
  )
}

export default Login
