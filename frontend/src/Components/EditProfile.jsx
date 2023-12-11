import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
function EditProfile() {
    const navigate = useNavigate();
    const token = useParams();
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [err,setErr] = useState("");
    const headers = {
      Authorization:token.token
    }
    useEffect(() => {
        axios
        .get("https://basecamp-backend-production.up.railway.app/auth/me",{headers})
        .then((res) => {
          setName(res.data.name)
          setEmail(res.data.email)
        }).catch((e) => {
          console.log(e);
        })
    } , []);

    const save = () => {
      try {
          axios
          .patch("https://basecamp-backend-production.up.railway.app/user/edit",{
            name:name,
            email:email
          },{headers})
          .then((res) => {
            console.log(res);
            navigate(`/home/${token.token}`)
          })
          .catch((e) => {
            console.log(e);
            navigate(`/home/${token.token}`)
          })
      } catch (error) {
        console.log(error);
      }
    }
    const back = () => {
      navigate(`/home/${token.token}`)
    }
    const deleteAccount = () => {
      axios
      .post("https://basecamp-backend-production.up.railway.app/user/delete",{}, {headers})
      .then((res) => {
        alert("Successful deleted account!")
        navigate('/')
      }).catch((e) => {
        console.log(e);
        alert(e.response.data.message)
      })
    }
  return (
    <div className='settings_wrape'>
    <div className='form-wrape'>
    <div className="s">
                <button className='back_btn' onClick={back}>Back</button>
    </div>
    <div className="settings_block">
        <div className="post_info_block">
           <b>{name}</b>
           <p>{email}</p>
           <button className='delete_btn' onClick={deleteAccount}>Delete account</button>
        </div>
    </div>
    <div className="edit_post_block">
    <form className='form-edit'>
            <input type="text" placeholder='Name' className='form-input' onChange={(e) => setName(e.target.value)} value={name}/>
            <input type="email" placeholder='Email' className='form-input' onChange={(e) => setEmail(e.target.value)} value={email}/>
        </form>
        <button onClick={save} className='save_btn'>Save</button>
    </div>
    </div>
    </div>
  )
}

export default EditProfile