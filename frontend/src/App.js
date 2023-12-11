import './App.css';
import {Route,Routes} from 'react-router-dom'
import Register from './Components/Register';
import Home from './Components/Home';
import Login from './Components/Login'
import EditProfile from './Components/EditProfile';
import Create from './Components/Create';
import ProjectSetting from './Components/ProjectSetting';
function App() {
  return (
    <div className="App">
      
      <Routes>
        <Route path='/' element={<Register/>}/>
        <Route path='/home/:token' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/user/edit/:token' element={<EditProfile/>}/>
        <Route path='/post/create/:token' element={<Create/>}/>
        <Route path='/post/settings/:token/:id' element={<ProjectSetting/>}/>
      </Routes>
    </div>
  );
}

export default App;
