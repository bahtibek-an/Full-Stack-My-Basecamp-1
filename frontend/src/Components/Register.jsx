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
        .post("https://basecamp-backend-production.up.railway.app/auth/register",{
            name:name,
            email:email,
            password:password,
            confirmpassword:confirmPassword
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
        <h3>Sign up</h3>
        <p>{err}</p>
        <form>
            <input type="text" placeholder='Name' onChange={(e) => setName(e.target.value)}/>
            <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
            <input type="password" placeholder='Confirm password' onChange={(e) => setConfirmPassword(e.target.value)}/>
        </form>
        <p>Do you have a acount? <Link to={'/login'}>Sign in</Link></p>
        <button onClick={next}>Next</button>
    </div>
  )
}

export default Register