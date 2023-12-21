import React, { useState } from 'react'
import './Form.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
function Register() {
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [err,setErr] = useState("");
    const navigate = useNavigate();
   const next = () => {
    try {
        axios
        .post("https://basecamp-backend-b.onrender.com/auth/login",{
            email:email,
            password:password,
        })
        .then((data) => {
            console.log(data);
            navigate(`/home/${data.data.token}`)
        }).catch((e) => {
            console.log(e);
            setErr(e.response.data.message);
        })
    } catch (error) {
        console.log(error)
    }
   }
  return (
    <div className='form-wrape'>
        <h3>Sign in</h3>
        <p className='err'>{err}</p>
        <form>
            <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
        </form>
        <p>Do you don't have a account? <Link to={'/'}>Sign up</Link></p>
        <button onClick={next}>Next</button>
    </div>
  )
}

export default Register