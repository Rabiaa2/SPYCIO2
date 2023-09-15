

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { supabase } from "../supabaseClient";
import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

function Business() {
  const [NameBusiness, setNameBusiness] = useState('');
  const [l_NameBusiness, setL_NameBusiness] = useState([]);
  const [description, setDescription] = useState('');
  const [l_description, setL_description] = useState([]);
  const [open, setOpen] = useState(false);
  const [changer, setChanger] = useState(false);
  const [user, setUser] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [NameBusinessCheckedStates, setNameBusinessCheckedStates] = useState([]);
  const [descriptionCheckedStates, setdescriptionCheckedStates] = useState([]);


  const handleClose = () => setOpen(false);
  const handleClickOpen = () => setOpen(true);
  
  useEffect(() => {
    async function fetchData() {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        setUser(userData.user);
        
        const { data: Data, error } = await supabase
          .from('Business')
          .select('NameBusiness,description,show,id')
          .eq('user_id', userData.user.id);

        if (error) {
          console.error("Error fetching :", error.message);
        } else {
          setL_NameBusiness(Data || []);
          setL_description(Data || []);

          const initialCheckedStates = Data.map((NameBusiness) => NameBusiness.show === true);
          setNameBusinessCheckedStates(initialCheckedStates);

          const initialCheckedStates1 = Data.map((description) => description.show === true);
          setdescriptionCheckedStates(initialCheckedStates1);
        }
      }
    }

    fetchData();
  }, []);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const { data, error } = await supabase
        .from('Business')
        .insert([{ NameBusiness, description , user_id: user.id }]);
  
      if (error) throw error;
      console.log('Business saved successfully:', data);
    } catch (error) {
      console.error("Error saving Business :", error.message);
    }

    setNameBusiness('');  // Clear 
    setDescription('');
    setOpen(false); // Close the dialog
    setChanger(false); // Reset the changer state
  };

  const handleCheckboxChange = async (event,index) => {
    try{
      const {data, error} = await supabase
    .from('Business')
    .update([{show: event.target.checked}])
    .eq('id',event.target.value)
    } catch(error){
      console.error(error)
    }
    try {
      const newShowState = ! NameBusinessCheckedStates[index];
      const NameBusinessId = l_NameBusiness[index].id;
  
      const { data, error } = await supabase
        .from('Business')
        .update([{ id: NameBusinessId, show: newShowState }]);
  
      if (error) {
        console.error(error);
      }
  
      // Update the checked state for the specific logo
      const updatedCheckedStates = [...NameBusinessCheckedStates];
      updatedCheckedStates[index] = newShowState;
      setNameBusinessCheckedStates(updatedCheckedStates);
  
      // Store the checkbox state in local storage with a unique key
      localStorage.setItem(`checkboxChecked-${NameBusinessId}`, newShowState.toString());
    } catch (error) {
      console.error(error);
    }
  };
  const handleCheckboxChange1 = async (event,index) => {
    try{
      const {data, error} = await supabase
    .from('Business')
    .update([{show: event.target.checked}])
    .eq('id',event.target.value)
    } catch(error){
      console.error(error)
    }
    try {
      const newShowState = ! descriptionCheckedStates[index];
      const descriptionId = l_description[index].id;
  
      const { data, error } = await supabase
        .from('Business')
        .update([{ id: descriptionId, show: newShowState }]);
  
      if (error) {
        console.error(error);
      }
  
      // Update the checked state for the specific logo
      const updatedCheckedStates = [...descriptionCheckedStates];
      updatedCheckedStates[index] = newShowState;
      setdescriptionCheckedStates(updatedCheckedStates);
  
      // Store the checkbox state in local storage with a unique key
      localStorage.setItem(`checkboxChecked-${descriptionId}`, newShowState.toString());
    } catch (error) {
      console.error(error);
    }
  };




  return (
    <>
      <div>

<h3>Business</h3> 

<div>
  
  <div style={{display: 'flex', justifyContent: 'space-between', width: '60%', height:'40px'}} >
   {
    l_NameBusiness && l_NameBusiness.map(
      (NameBusiness, index) => {
        return(
          <div key={index}>
          <input type="checkbox" id={`NameBusiness-${index}`}  value={NameBusiness.id} checked={NameBusinessCheckedStates[index]}
          onChange={(event) => handleCheckboxChange(event, index)}/>   
          <label htmlFor={`NameBusiness-${index}`}> {NameBusiness.NameBusiness} </label>  
          </div>
        )
      }
    )        
  } 
   
  </div>

  <div style={{display: 'flex', justifyContent: 'space-between', width: '60%', height:'40px'}} >
   {
    l_description && l_description.map(
      (description, index) => {
        return(
          <div key={index}>
          {/* <label  id={`description-${index}`}  value={description.id} checked={descriptionCheckedStates[index]}
          onChange={(event) => handleCheckboxChange1(event, index)}></label>   */}
          <label htmlFor={`description-${index}`}> {description.description} </label>  
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
    Ajouter nouvel Business
    </DialogTitle>
    <DialogContent>
      
        <form onSubmit={handleSubmit}>
        <div  onClick={changer}>
            <label>
                Name Business:
            </label>
      </div>
            {
              changer? (<p> {NameBusiness} </p>)
              : (<input type="text"  id="NameBusiness" value={NameBusiness} name="NameBusiness" onChange={(e)=>setNameBusiness(e.target.value)} />)
       
            } 
         
         <div  onClick={changer}>
            <label>
                Description de Business:
            </label>
      </div>
        {
          changer? (<p> {description} </p>)
          : (<input type="text"  id="description" value={description} name="description" onChange={(e)=>setDescription(e.target.value)} />)
   
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

export default Business;
