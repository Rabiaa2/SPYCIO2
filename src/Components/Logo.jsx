

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { supabase } from "../supabaseClient";
import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import AddLogo from './AddLogo';

function Logo() {
  const [logo, setlogo] = useState('');
  const [l_logo, setL_logo] = useState([]);
  const [open, setOpen] = useState(false);
  const [changer, setChanger] = useState(false);
  const [user, setUser] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [logoCheckedStates, setLogoCheckedStates] = useState([]);



  const handleClose = () => setOpen(false);
  const handleClickOpen = () => setOpen(true);
  
  useEffect(() => {
    async function fetchData() {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        setUser(userData.user);
  
        const { data: logoData, error } = await supabase
          .from('logo')
          .select('logo, show, id')
          .eq('user_id', userData.user.id);
  
        if (error) {
          console.error("Error fetching logos:", error.message);
        } else {
          setL_logo(logoData || []);
  
          // Initialize the logoCheckedStates array with initial checked states
          const initialCheckedStates = logoData.map((logo) => logo.show === true);
          setLogoCheckedStates(initialCheckedStates);
        }
      }
    }
  
    fetchData();
  }, []);
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const { data, error } = await supabase
        .from('logo')
        .insert([{ logo, user_id: user.id }]);
  
      if (error) throw error;
      console.log('logo saved successfully:', data);
    } catch (error) {
      console.error("Error saving email:", error.message);
    }

    setlogo('');  // Clear the email
    setOpen(false); // Close the dialog
    setChanger(false); // Reset the changer state
  };

  //______________________________________________________________________________________________
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState(null)

  const [avatar_url, setAvatarUrl] = useState(null)
  const [user_id, setUser_id] = useState(null)

  async function getUserData(){
    await supabase.auth.getUser().then((value)=>{
       if (value.data?.user) {
           setUser(value.data.user);
           setUser_id(value.data.user.id)
       }
    })
  }
  
 

  useEffect(() => {
    
  getUserData();
    async function getProfile() {
      setLoading(true)
      

      let { data, error } = await supabase
        .from('profiles')
        .select(`fullName, avatar_url`)
        .eq('id', user_id)
        .single()

      if (error) {
        console.warn(error)
      } else if (data) {
        setFullName(data.fullName)
        setAvatarUrl(data.avatar_url)
      }

      setLoading(false)
    }
      
    getProfile()
  }, [])

  async function updateProfile(event, avatarUrl) {
    event.preventDefault()

    setLoading(true)

    const updates = {
      id: user_id,
      fullName,
      avatar_url,
      updated_at: new Date(),
    }

    let { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      alert(error.message)
    } else {
      setAvatarUrl(avatarUrl)
    }
    setLoading(false)
  }

  const handleCheckboxChange = async (event, index) => {
    
    try{
      const {data, error} = await supabase
    .from('logo')
    .update([{show: event.target.checked}])
    .eq('id',event.target.value)
    } catch(error){
      console.error(error)
    }
    
    try {
      const newShowState = !logoCheckedStates[index];
      const logoId = l_logo[index].id;
  
      const { data, error } = await supabase
        .from('logo')
        .update([{ id: logoId, show: newShowState }]);
  
      if (error) {
        console.error(error);
      }
  
      // Update the checked state for the specific logo
      const updatedCheckedStates = [...logoCheckedStates];
      updatedCheckedStates[index] = newShowState;
      setLogoCheckedStates(updatedCheckedStates);
  
      // Store the checkbox state in local storage with a unique key
      localStorage.setItem(`checkboxChecked-${logoId}`, newShowState.toString());
    } catch (error) {
      console.error(error);
    }
  };
  
  
 







  return (
    <>
      <div>

<h3>LOGO</h3> 

<div>
  
<div style={{display: 'flex', justifyContent: 'space-between', width: '60%', height:'40px', marginLeft:'100px',
      bottom: '50px'
      }} >
  {l_logo &&
  l_logo.map((logo, index) => {
    const isCheckedLocalStorage = localStorage.getItem(`checkboxChecked-${logo.id}`);
    const initialCheckedState = isCheckedLocalStorage
      ? isCheckedLocalStorage === 'true'
      : logo.show === true;

    return (
      <div key={index}>
        <input
          type="checkbox"
          id={`logo-${index}`}
          value={logo.id}
          checked={logoCheckedStates[index]}
          onChange={(event) => handleCheckboxChange(event, index)}
        />
        <img
          htmlFor={`logo-${index}`}
          src={logo.logo}
          style={{ width: '80px', height: '80px', borderRadius: '90px' }}
        />
      </div>
    );
  })}


   
  </div>
  
</div>

<button type="button"   onClick={handleClickOpen} >
   <AiOutlinePlus/>

  </button> 
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>
    Ajouter nouvel Logo
    </DialogTitle>
    <DialogContent>
      
        <AddLogo
           url={avatar_url}
        />
      
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
       Close
      </Button>
      <Button onClick={handleClose} color="primary" autoFocus>
       Yes
      </Button>
    </DialogActions>
  </Dialog>
 </div>
 <br/>
    </>
  );
}

export default Logo;


