import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Create() {
    const [title,setTitle] = useState("")
    const [err,setErr] = useState("")
    const [description,setDescription] = useState("")
    const token = useParams();
    const headers = {
        Authorization:token.token
    }
    const navigate = useNavigate();
    const save = () => {
        try {
            axios
            .post("https://basecamp-backend-production.up.railway.app/post/create",{
                title:title,
                description:description
            },{headers})
            .then((res) => {
                console.log(res);
                navigate(`/home/${token.token}`);
            }).catch((e) => {
                console.log(e);
                setErr(e.response.data.message)
            })
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div>
    <div className='form-wrape'>
        <h3>Create youre post ;)</h3>
        <p>{err}</p>
        <form>
            <input type="text" placeholder='Title' onChange={(e) => setTitle(e.target.value)}/>
            <input type="email" placeholder='Description' onChange={(e) => setDescription(e.target.value)}/>
        </form>
        <button onClick={save}>Create</button>
    </div>
    </div>
  )
}

export default Create