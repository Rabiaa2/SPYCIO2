
import { useNavigate } from "react-router-dom";
import {FaBars,FaTimes} from "react-icons/fa";
import {HiMiniQrCode ,HiChatBubbleOvalLeft,HiMiniLanguage} from "react-icons/hi2"
import { ThemeSupa } from '@supabase/auth-ui-shared';
import React ,{useEffect,useRef,useState} from "react";
import logo from '../logo.png'
import Emails from '../Components/Emails';
import './page.css'
import { supabase } from "../supabaseClient";
import Names from "../Components/Names";
import Tele from "../Components/Tele";
import Profile from "../Components/profile";
import Logo from "../Components/Logo";
import Business from "../Components/Business";
import Avatar from "../Avatar";
import QrcodeGeneration from "../Components/Qrcode";
import QRCodeList from "../Components/ListQrCode";



function Success(){
  
  const[fullName,setFullName] = useState('' );
  const [user_id, setUser_id] = useState(null);
  const[user,setUser]= useState({});
  const navigate=useNavigate();
  const [l_fullName,setL_fullName]= useState('')

  async function getUserData(){
    await supabase.auth.getUser().then((value)=>{
       if (value.data?.user) {
           setUser(value.data.user);
           setUser_id(value.data.user.id)
       }
    })
  }


  const selectfullName = async () => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('fullName')
            .eq('id', user_id);
        if (error) throw error;
        if (data) setL_fullName(data[0].fullName);
    } catch (error) {
        console.error("Error:", error.message);
    }
};

useEffect(() => {
    getUserData();
    selectfullName();
}, [user_id]);


  const [changer, setChanger] = useState(false)
  function change(e){
    e.preventDefault()
    setChanger(true)
  }
  
  const handleSubmit = async (e) => {
   
    e.preventDefault();
  
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update([
              { fullName }
              
            ])
            .eq('id', user_id) ;
  
        if (error) {
          console.log(error)
        }
        else{
        console.log(' enregistré avec succès:', data);
        }
    } catch (error) {
        console.error("Erreur lors de l'enregistrement:", error.message);
    }
    setChanger(true)
    
  };

   
  

  const navRef =useRef();
  const showNavBar =() =>{
    navRef.current.classList.toggle("responsive_nav");
  }
    
    async function signOutUser(){
        const { error}=await supabase.auth.signOut();
        navigate('/');
    }


    
    return(

        <div >
         <header>
        { Object.keys(user).length!==0 ?
       <>
        
        <nav ref ={navRef}>
          
        <img src={logo} alt="logo" className="image1"/>
          <a href="#">Chating <HiChatBubbleOvalLeft size={"1.25em"}/></a>
          <a href="#">Langue <HiMiniLanguage size={"1.5em"}/></a>
          <a href="#" onClick={()=>signOutUser()}>Logout</a>
           <button  className="nav-btn nav-close-btn" onClick={showNavBar}>
             <FaTimes/>
           </button>
        </nav>
         <button className="nav-btn "  onClick={showNavBar}>
          <FaBars/>
         </button>
    

          {/* <button  onClick={()=>signOutUser()}>sign Out</button>  */}
          </>
          
          :
          <>
          <h1>User is not logged in</h1>
          <button onClick={()=> {navigate('/')}}>Go back  home!</button>
          </>
          
          }
</header>

<div className="rab"> 

<Profile user_id={user_id} />
       <div   >
           
           <h2> {l_fullName} </h2>
      </div>
<br/>
 <Emails/>
 <Names/>
 <Tele/>
 <Logo/>
 <br/>
 <Business/>
 <br/>
  <QrcodeGeneration/>
  <br/>
  <QRCodeList/>
    </div>
    </div>
    )
}
export default Success;