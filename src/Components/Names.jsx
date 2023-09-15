


import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { supabase } from "../supabaseClient";
import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

function Names() {
  const [names, setNames] = useState('');
  const [l_names, setL_names] = useState([]);
  const [open, setOpen] = useState(false);
  const [changer, setChanger] = useState(false);
  const [user, setUser] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [namesCheckedStates, setNamesCheckedStates] = useState([]);
  
  const handleClose = () => setOpen(false);
  const handleClickOpen = () => setOpen(true);
  
  useEffect(() => {
    async function fetchData() {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        setUser(userData.user);
  
        const { data: namesData, error } = await supabase
          .from('namesAlias')
          .select('names, show, id')
          .eq('user_id', userData.user.id);
  
        if (error) {
          console.error("Error fetching names:", error.message);
        } else {
          setL_names(namesData || []);
  
          // Initialize the logoCheckedStates array with initial checked states
          const initialCheckedStates = namesData.map((names) => names.show === true);
          setNamesCheckedStates(initialCheckedStates);
        }
      }
    }
  
    fetchData();
  }, []);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const { data, error } = await supabase
        .from('namesAlias')
        .insert([{ names, user_id: user.id }]);
  
      if (error) throw error;
      console.log('Email saved successfully:', data);
    } catch (error) {
      console.error("Error saving email:", error.message);
    }

    setNames('');  // Clear the email
    setOpen(false); // Close the dialog
    setChanger(false); // Reset the changer state
  };

  const handleCheckboxChange = async(event, index) => {
    try{
      const {data, error} = await supabase
    .from('namesAlias')
    .update([{show: event.target.checked}])
    .eq('id',event.target.value)
    } catch(error){
      console.error(error)
    }

    try {
      const newShowState = ! namesCheckedStates[index];
      const namesId = l_names[index].id;
  
      const { data, error } = await supabase
        .from('namesAlias')
        .update([{ id: namesId, show: newShowState }]);
  
      if (error) {
        console.error(error);
      }
  
      // Update the checked state for the specific logo
      const updatedCheckedStates = [...namesCheckedStates];
      updatedCheckedStates[index] = newShowState;
      setNamesCheckedStates(updatedCheckedStates);
  
      // Store the checkbox state in local storage with a unique key
      localStorage.setItem(`checkboxChecked-${namesId}`, newShowState.toString());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>

<h3>Names-Alias</h3> 

<div>
  
<div style={{display: 'flex', justifyContent: 'space-between', width: '60%', height:'40px'}} >
{l_names && l_names.map((names, index) => {
    const isCheckedLocalStorage = localStorage.getItem(`checkboxChecked-${names.id}`);
    const initialCheckedState = isCheckedLocalStorage
      ? isCheckedLocalStorage === 'true'
      : names.show === true;

    return (
      <div key={index}>
        <input
          type="checkbox"
          id={`names-${index}`}
          value={names.id}
          checked={namesCheckedStates[index]}
          onChange={(event) => handleCheckboxChange(event, index)}
        />
        <label htmlFor={`names-${index}`}> {names.names} </label> 
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
    Ajouter nouvel Names-Alias
    </DialogTitle>
    <DialogContent>
      
        <form onSubmit={handleSubmit}>
        <div  onClick={changer}>
            <label>
                Names-Alias:
            </label>
      </div>
            {
              changer? (<p> {names} </p>)
              : (<input type="text"  id="names" value={names} name="names" onChange={(e)=>setNames(e.target.value)} />)
       
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

export default Names;
