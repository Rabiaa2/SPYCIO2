

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { supabase } from "../supabaseClient";
import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

function Tele() {
  const [tele, setTele] = useState('');
  const [l_tele, setL_tele] = useState([]);
  const [open, setOpen] = useState(false);
  const [changer, setChanger] = useState(false);
  const [user, setUser] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [TeleCheckedStates, setTeleCheckedStates] = useState([]);
  
  const handleClose = () => setOpen(false);
  const handleClickOpen = () => setOpen(true);
  
  useEffect(() => {
    async function fetchData() {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        setUser(userData.user);
  
        const { data: teleData, error } = await supabase
          .from('tele')
          .select('tele, show, id')
          .eq('user_id', userData.user.id);
  
        if (error) {
          console.error("Error fetching tele:", error.message);
        } else {
          setL_tele(teleData || []);
  
          // Initialize the logoCheckedStates array with initial checked states
          const initialCheckedStates = teleData.map((tele) => tele.show === true);
          setTeleCheckedStates(initialCheckedStates);
        }
      }
    }
  
    fetchData();
  }, []);
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const { data, error } = await supabase
        .from('tele')
        .insert([{ tele, user_id: user.id }]);
  
      if (error) throw error;
      console.log('saved successfully:', data);
    } catch (error) {
      console.error("Error saving TELE:", error.message);
    }

    setTele('');  // Clear the email
    setOpen(false); // Close the dialog
    setChanger(false); // Reset the changer state
  };

  const handleCheckboxChange = async (event,index) => {
    try{
      const {data, error} = await supabase
    .from('tele')
    .update([{show: event.target.checked}])
    .eq('id',event.target.value)
    } catch(error){
      console.error(error)
    }
    try {
      const newShowState = ! TeleCheckedStates[index];
      const teleId = l_tele[index].id;
  
      const { data, error } = await supabase
        .from('tele')
        .update([{ id: teleId, show: newShowState }]);
  
      if (error) {
        console.error(error);
      }
  
      // Update the checked state for the specific logo
      const updatedCheckedStates = [...TeleCheckedStates];
      updatedCheckedStates[index] = newShowState;
      setTeleCheckedStates(updatedCheckedStates);
  
      // Store the checkbox state in local storage with a unique key
      localStorage.setItem(`checkboxChecked-${teleId}`, newShowState.toString());
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <>
      <div>

<h3>Tele</h3> 

<div>
  
<div style={{display: 'flex', justifyContent: 'space-between', width: '60%', height:'40px'}} >
   {
    l_tele && l_tele.map(
      (tele, index) => {
        const isCheckedLocalStorage = localStorage.getItem(`checkboxChecked-${tele.id}`);
        const initialCheckedState = isCheckedLocalStorage
          ? isCheckedLocalStorage === 'true'
          : tele.show === true;
    
        return(
          <div key={index}>
          <input type="checkbox" id={`tele-${index}`} value={tele.id} checked={TeleCheckedStates[index]}
          onChange={(event) => handleCheckboxChange(event, index)}/>  
          <label htmlFor={`tele-${index}`}> {tele.tele} </label>  
          </div>
        )
      }
    )        
  } 
   
  </div>
  
</div>

<button type="button"   onClick={handleClickOpen} >
   <AiOutlinePlus/>

  </button> 
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>
    Ajouter nouvel Tele
    </DialogTitle>
    <DialogContent>
      
        <form onSubmit={handleSubmit}>
        <div  onClick={changer}>
            <label>
                Tele:
            </label>
      </div>
            {
              changer? (<p> {tele} </p>)
              : (<input type="text"  id="tele" value={tele} name="tele" onChange={(e)=>setTele(e.target.value)} />)
       
            }
                
            <input type="submit" value="Envoyer"/>
        </form>
      
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

export default Tele;
