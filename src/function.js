import { supabase } from "./supabaseClient";


export const updateData = async (table) => {
    const { data, error } = await supabase
      .from(table) // Assuming the table name is 'users'
      .update({ show: false })
      .eq('show', true); 

    if (error) {
      console.error('Error updating show column:', error);
    } else {
      console.log('Updated records:', data);
    }
}


