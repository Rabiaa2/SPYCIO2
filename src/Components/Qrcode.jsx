import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import { supabase } from "../supabaseClient";
import React, { useEffect, useState } from "react";
import QRCode from 'qrcode.react';
import { updateData } from '../function';
import { QRCodeSVG } from 'qrcode.react';


export default function QrcodeGeneration() {
    
    const [nameQrCode, setNameQrCode] = useState('');
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({
        email: null,
        tele: null,
        logo: null,
        names: null,
        NameBusiness: null,
        description: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            const { data: userData } = await supabase.auth.getUser();

            if (userData) {
                let consolidatedData = {};

                const emailResponse = await supabase.from('email').select('*').eq('show', true);
                consolidatedData.email = emailResponse.data?.[0]?.email;

                const teleResponse = await supabase.from('tele').select('*').eq('show', true);
                consolidatedData.tele = teleResponse.data?.[0]?.tele;

                const logoResponse = await supabase.from('logo').select('*').eq('show', true);
                consolidatedData.logo = logoResponse.data?.[0]?.logo;

                const nameResponse = await supabase.from('namesAlias').select('*').eq('show', true);
                consolidatedData.names = nameResponse.data?.[0]?.names;

                const businessResponse = await supabase.from('Business').select('*').eq('show', true);
                consolidatedData.NameBusiness = businessResponse.data?.[0]?.NameBusiness;

                const descriptionResponse = await supabase.from('Business').select('*').eq('show', true);
                consolidatedData.description = descriptionResponse.data?.[0]?.description;

                setData(consolidatedData);
            }
        };
        fetchData();
    }, []);

   
    
    
    

    const constructQRContent = () => {
        let content = '';
        
        if (data.email) content += `Email: ${data.email}\n`;
        if (data.tele) content += `Tele: ${data.tele}\n`;
        if (data.logo) content += `LOGO: ${data.logo}\n`;
        if (data.names) content += `Names-Alias: ${data.names}\n`;
        if (data.NameBusiness) content += `Business: ${data.NameBusiness}\n`;
        if (data.description) content += `description of Business: ${data.description}\n`;

        return content;
    };

    const handleClose = () => setOpen(false);
    const handleClickOpen = () => setOpen(true);

    async function insertQRCode(name, qrCodeData) {
        const { data: userData } = await supabase.auth.getUser();
  
        try {
          const { data, error } = await supabase
            .from('qrcode')
            .insert([
              {
                nameQrCode: name,
                qr_code_image: qrCodeData,
                user_id: userData.user.id
              },
            ]);
      
               if (error) throw error;
                   console.log('saved successfully:', data);
           } catch (error) {
             console.error("Error saving Qr Code:", error.message);
  }
}
      
      
      

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Call the insertQRCode function to insert the QR code
        const qrCodeData = constructQRContent();
    
        try {
            await insertQRCode(nameQrCode, qrCodeData);
            handleClose(); // Close the dialog after successful insertion
         
        }
        catch (error) {
            // Handle any errors that may occur during insertion
            console.error("Error inserting QR code:", error.message);
        }
    };

    

    return (
        <>
            <div>
                <h3>Create QR Code Profile</h3> 
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Create QRCode Profile
                </Button>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>
                        QR Code
                    </DialogTitle>
                    <DialogContent>
                        <form onSubmit={handleSubmit} >
                            <label>Generate QR Code:</label>
                            <div style={{ marginTop: '20px' }}>
                                <QRCode value={constructQRContent()} />
                            </div>
                            <label> Name de Qr Code</label>
                            <input type="text" id="nameQrCode" value={nameQrCode} name="nameQrCode" onChange={(e)=>setNameQrCode(e.target.value)} />
                            <input type="submit" value="Send" />
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
    )
}
