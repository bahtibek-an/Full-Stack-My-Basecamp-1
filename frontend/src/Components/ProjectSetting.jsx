import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './ProjectSetting.css'
import DeleteIcon from '@mui/icons-material/Delete';
function ProjectSetting() {
    const token = useParams();
    const headers = {
        Authorization: token.token
    }
    const [post, setPost] = useState([]);
    const navigate = useNavigate();
    const [members, setMembers] = useState([])
    const [admin, setAdmin] = useState("")
    const [email, setEmail] = useState("")
    const [id, setId] = useState("");
    const [memberId, setMemberId] = useState("");
    const [success,setSuccess] = useState("");
    const [error,setError] = useState("");
    const [editError,setEditError] = useState("");
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [editSuccess,setEditSuccess] = useState("");
    const [user,setUser] = useState([]);
    const [glError,setGlError] = useState("");

    useEffect(() => {
        axios
        .get("https://basecamp-backend-b.onrender.com/auth/me",{headers})
        .then((res) => {
            setUser(res.data);
            console.log(res);
        }).catch((e) => {
            console.log(e);
        })
    }, [])
    
    useEffect(() => {
        axios
            .get(`https://basecamp-backend-b.onrender.com/post/members/${token.id}`, { headers })
            .then((res) => {
                console.log("members", res);
                setMembers(res.data)
            }).catch((e) => {
                console.log(e);
                setGlError("true");
            })
    }, [post])

    useEffect(() => {
        axios
            .get(`https://basecamp-backend-b.onrender.com/post/getOne/${token.id}`, { headers })
            .then((res) => {
                console.log("post", res);
                setPost([res.data]);
                setId(res.data._id)
            }).catch((e) => {
                console.log(e);
                setGlError(e.response.data.message);
            })
    }, [])


    useEffect(() => {
        axios
            .get(`https://basecamp-backend-b.onrender.com/post/GetALLMessages/${token.id}`, { headers })
            .then((res) => {
                console.log("messages", res);
            }).catch((e) => {
                console.log(e);
            })
    }, [token])

    const back = () => {
        navigate(`/home/${token.token}`)
    }
    const editPost = () => {
        axios
        .patch(`https://basecamp-backend-b.onrender.com/post/edit/${id}`,{
            title:title,
            description:description
        },{headers})
        .then((res) => {
            setEditSuccess("Successfull edited!")
            window.location.reload();
        }).catch((e) => {
            setEditError(e.response.data.message);
        })
    }
    const hadnleAddMember = (id) => {
        axios
            .post(`https://basecamp-backend-b.onrender.com/post/addMember/${id[0]}`, {
                email: email
            }, { headers })
            .then((res) => {
                console.log("new member", res);
                setSuccess("New user added!")
                window.location.reload();
            }).catch((e) => {
                console.log(e);
                setError(true)
            })
    }

    const deleteMember = (_id) => {
        axios
            .post(`https://basecamp-backend-b.onrender.com/post/deleteMember/${id}/${_id}`, {}, { headers })
            .then((res) => {
                console.log("deleted account!", res);
                window.location.reload();
            }).catch((e) => {
                console.log(e);
            })
    }

    const unSetAdmin = (_id) => {
        console.log("member id", memberId);
        
        axios
            .post(`https://basecamp-backend-b.onrender.com/post/unSetAdmin/${id}/${_id}/${memberId}`, {}, { headers })
            .then((res) => {
                console.log("unset!", res);
                window.location.reload();
            }).catch((e) => {
                console.log(e);
            })
    }
    // console.log("dsewdewds",members);

    const SetAdmin = (_id) => {
        console.log("member set id ",memberId);
        axios
            .post(`https://basecamp-backend-b.onrender.com/post/SetAdmin/${id}/${_id}/${memberId}`, {}, { headers })
            .then((res) => {
                console.log("set!", res);
                window.location.reload();
            }).catch((e) => {
                console.log(e);
            })
    }
    return (
        <>
            {   
                glError === "true" ? <h1>No access!</h1> 
                :       <div className={'settings_wrape'}>
                <div className="s">
                    <button className='back_btn' onClick={back}>Back</button>
                </div>
                <div className="settings_block">
                    <div className="post_info_block">
                        {
                            post.map((i) => {
                                return (
                                    <>
                                        <b>{i.title}</b>
                                        <p>{i.description}</p>
                                    </>
                                )
                            })
                        }
                    </div>
                    <div className="edit_post_block">
                        <form>
                            <input className='form-input' type="text" placeholder='Title' onChange={(e) => setTitle(e.target.value)}/>
                            <input className='form-input' type="text" placeholder='Description ' onChange={(e) => setDescription(e.target.value)}/>
                        </form>
                        <span className='success_message'>{editSuccess}</span>
                        <span className='errorr_message'>{editError}</span>
                        <button className='save_btn' onClick={editPost}>Save</button>
                    </div>
                    <div className="members_view_block">
                        {
                            members.length === 0 ? <em>Members not found</em> :
                                members.map((item) => {
                                    return (
                                        <div className='user_block'>
                                            <b>{item.user.email}</b>
                                            <span className={item.user.isAdmin === true ? "admin_status" : null}>{item.user.isAdmin === true ? "admin" : null}</span>
                                            <DeleteIcon onClick={() => deleteMember(item._id)} className='status_icon' />
                                            {
                                                item.user.isAdmin === true ? <span className='unsetadmin' onClick={async() => {await unSetAdmin(item._id); setMemberId(item.user._id);}}>UnSetAdmin</span>
                                                    : <span className='unsetadmin' onClick={async() => {await SetAdmin(item._id); setMemberId(item.user._id);}}>SetAdmin</span>
    
                                            }
                                        </div>
                                    )
                                })
                        }
                    </div>
                    <div className="add_member_block">
                        <form>
                            <input className='form-input' type="text" placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                            <span className='success_message'>{success}</span>
                            <span className='errorr_message'>{error}</span>
                        </form>
                        <button className='save_btn' onClick={() => hadnleAddMember(post.map((i) => i._id))}>Add</button>
                    </div>
                </div>
            </div>
            }
        </>
    )
}

export default ProjectSetting