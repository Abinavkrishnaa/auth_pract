import { useState } from "react"



function Login() {
  const [formData , setFormData ] = useState({})
  const [error , setError] = useState({})
  const handleChange = (e)=>{
    const {name , value} = e.target
    setFormData({...formData , [name]:value})

  }
  const handleSubmit = async(e)=>{
    e.preventDefault()
    if(formData.email === "" || formData.password === ""){
      setError({email:"Email is required",password:"Password is required"})
    }
    else{
      setError({})
    }
    try {
      const res= await fetch('http://localhost:3000/login',{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(formData)

      })
      if(!res.ok){
        throw new Error("Something went wrong")
      }
      if(res.ok){
        const data = await res.json()
        console.log(data)
        alert('user authenticated')
      }
    } catch (error) {
      console.log(error)
      
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-5">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
          {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
        </form>
      </div>
    </div>
  )
}

export default Login