import { useState } from "react";
import { Navigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      return setError('Please fill out all fields');
    }

    try {
      const res = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }
      if(res.ok){
        Navigate('/login')
      }

      const data = await res.json();
      console.log(data);

      if (data.error) {
        setError(data.error);
      } else {
        setError(null);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border text-center"
          onChange={handleChange}
          value={formData.username}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2 border text-center"
          onChange={handleChange}
          value={formData.password}
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2" type="submit">
          register
        </button>
        {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
      </form>
    </div>
  );
}

export default Register;
