
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { supabase } from "../supabaseClient";
import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

function Emails() {
  const [email, setEmail] = useState('');
  const [l_email, setL_email] = useState([]);
  const [open, setOpen] = useState(false);
  const [changer, setChanger] = useState(false);
  const [user, setUser] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [emailCheckedStates, setEmailCheckedStates] = useState([]);
  
  
  const handleClose = () => setOpen(false);
  const handleClickOpen = () => setOpen(true);
  
  useEffect(() => {
    async function fetchData() {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        setUser(userData.user);
  
        const { data: emailData, error } = await supabase
          .from('email')
          .select('email, show, id')
          .eq('user_id', userData.user.id);
  
        if (error) {
          console.error("Error fetching email:", error.message);
        } else {
          setL_email(emailData || []);
  
          // Initialize the logoCheckedStates array with initial checked states
          const initialCheckedStates = emailData.map((email) => email.show === true);
          setEmailCheckedStates(initialCheckedStates);
        }
      }
    }
  
    fetchData();
  }, []);
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const { data, error } = await supabase
        .from('email')
        .insert([{ email, user_id: user.id }]);
  
      if (error) throw error;
      console.log('Email saved successfully:', data);
    } catch (error) {
      console.error("Error saving email:", error.message);
    }

    setEmail('');  // Clear the email
    setOpen(false); // Close the dialog
    setChanger(false); // Reset the changer state
  };

  
  const handleCheckboxChange = async (event,index) => {
    try{
      const {data, error} = await supabase
    .from('email')
    .update([{show: event.target.checked}])
    .eq('id',event.target.value)
    } catch(error){
      console.error(error)
    }
    try {
      const newShowState = ! emailCheckedStates[index];
      const emailId = l_email[index].id;
  
      const { data, error } = await supabase
        .from('email')
        .update([{ id: emailId, show: newShowState }]);
  
      if (error) {
        console.error(error);
      }
  
      // Update the checked state for the specific logo
      const updatedCheckedStates = [...emailCheckedStates];
      updatedCheckedStates[index] = newShowState;
      setEmailCheckedStates(updatedCheckedStates);
  
      // Store the checkbox state in local storage with a unique key
      localStorage.setItem(`checkboxChecked-${emailId}`, newShowState.toString());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>

<h3>emails</h3> 

<div>
  
<div style={{display: 'flex', justifyContent: 'space-between', width: '60%', height:'40px'}} >
   {
    l_email && l_email.map(
      (email, index) => {
        return(
          <div key={index}>
          <input type="checkbox" id={`email-${index}`}    value={email.id}  checked={emailCheckedStates[index]}
          onChange={(event) => handleCheckboxChange(event, index)}/>  
          <label htmlFor={`email-${index}`}> {email.email} </label>  
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
    Ajouter nouvel email
    </DialogTitle>
    <DialogContent>
      
        <form onSubmit={handleSubmit}>
        <div  onClick={changer}>
            <label>
                E-mail:
            </label>
      </div>
            {
              changer? (<p> {email} </p>)
              : (<input type="email"  id="email" value={email} name="email" onChange={(e)=>setEmail(e.target.value)} />)
       
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

export default Emails;
