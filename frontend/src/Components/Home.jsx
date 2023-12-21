import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import './Home.css'
import axios from 'axios';
function Home() {
    const navigate = useNavigate();
    const token = useParams();
    const [posts, setPosts] = useState([])
    const [user, setUser] = useState([]);
    const [postUserId, setpostUserId] = useState([])
    const [members, setMembers] = useState([]);
    const [membersByPostId, setMembersByPostId] = useState({});
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(true);

    const headers = {
        Authorization: token.token
    }
    useEffect(() => {
        axios
            .get("https://basecamp-backend-b.onrender.com/auth/me", { headers })
            .then((res) => {
                console.log(res);
                setUser(res.data)
                setLoading(false)
            }).catch((e) => {
                console.log(e);
            })
    }, [postUserId])
    useEffect(() => {
        axios
            .get("https://basecamp-backend-b.onrender.com/posts", { headers })
            .then((res) => {
                console.log("POSTS", res);
                setPosts(res.data);
                setLoading(false)
                setMembers([res.data.members])
                setMembers(res.data.map((i) => i.members))
                setpostUserId(res.data.map((i) => i._id));
            })
            .catch((e) => {
                console.log(e);
            });
    }, [token]);
    const logout = () => {
        navigate('/login')
    }
    const editProfileBtn = () => {
        navigate(`/user/edit/${token.token}`)
    }
    const create = () => {
        navigate(`/post/create/${token.token}`)
    }
    const projectSetting = (id) => {
        navigate(`/post/settings/${token.token}/${id}`)
    }
    const deletePost = (id) => {
        axios
            .post(`https://basecamp-backend-b.onrender.com/post/delete/${id}`, {}, { headers })
            .then((res) => {
                window.location.reload();
                setLoading(false)
            }).catch((e) => {
                alert(e.response.data.message);
            })
    }
    return (
        <div className='home-wrape'>
            <header>
                <div className="logo">
                    <Link className='link'>Basecamp</Link>
                </div>
                <div className="header_actions">
                    <div className="add_project_div block" onClick={create}>
                        <AddIcon /><span>Add Project</span>
                    </div>
                    <div className="edit_profile_div block" onClick={editProfileBtn}>
                        <SettingsIcon /><span>Edit Profile</span>
                    </div>
                    <div className="logout_div block" onClick={logout}>
                        <LogoutIcon /><span>Logout</span>
                    </div>
                </div>
            </header>
            <div className="posts_wrape">
                <h2>Projects</h2>
                {/* <button className='filter_btns' onClick={postGLobalFilter}>Global projects</button>
                <button className='filter_btns' onClick={postMyProjectsFilter}>Your projects</button> */}
                <div className="posts">

                    {
                        loading === true ? <h1>Loading...</h1> :
                            posts
                                .filter((i) => i.user._id === user._id)
                                .map((item) => (

                                    <div className="post">
                                        <div className="post_headers">
                                            <div className="post_owner">
                                                <b>{item.user.email}</b>
                                            </div>
                                            <div className="post_header_acions">
                                                <SettingsIcon className='icon' onClick={() => projectSetting(item._id)} />
                                                <DeleteIcon onClick={() => deletePost(item._id)} className='icon_delete' />
                                            </div>
                                        </div>
                                        <div className="post_info">
                                            <b>{item.title}</b>
                                            <p>{item.description}</p>
                                        </div>
                                        <div className="post_bottom">
                                        </div>
                                    </div>
                                ))

                    }
                    {
                        loading === true ? <h1>Loading...</h1> :
                            posts.filter((i) => i.members && i.members.some(member => member.user.name === user.name))
                                .map((item) => (

                                    <div className="post">
                                        <div className="post_headers">
                                            <div className="post_owner">
                                                <b>{item.user.email}</b>
                                            </div>
                                            <div className="post_header_acions">
                                                <SettingsIcon className='icon' onClick={() => projectSetting(item._id)} />
                                                <DeleteIcon onClick={() => deletePost(item._id)} className='icon_delete' />
                                            </div>
                                        </div>
                                        <div className="post_info">
                                            <b>{item.title}</b>
                                            <p>{item.description}</p>
                                        </div>
                                        <div className="post_bottom">
                                            <b className='b-bottom'>You are member</b>
                                            {user.isAdmin === true ? <b className='b-bottom'>You are admin</b>  : null}
                                        </div>
                                    </div>
                                ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Home