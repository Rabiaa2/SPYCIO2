import React, { useState } from 'react';
import { Dialog, DialogContent, Button } from '@material-ui/core';
import { AiOutlineFacebook} from "react-icons/ai";
import {TbBrandGmail,TbBrandWhatsapp} from "react-icons/tb";


const ShareDialog = ({ isOpen, onClose, shareUrl }) => {
  const [sharedOn, setSharedOn] = useState(null);
  const [qrCode, setQRCode] = useState([]);

  const handleShare = (platform) => {
    // Handle sharing logic here for each platform (e.g., open the sharing URL).
    setSharedOn(platform);
  };

  const handleClose = () => {
    setSharedOn(null);
    onClose();
  };

   // Function to share the QR code on Facebook
   const shareOnFacebook = (qrCode) => {
    const shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(shareURL);
  };

  // Function to share the QR code on WhatsApp
  const shareOnWhatsApp = (qrCode) => {
    const shareMessage = `Check out this QR code!\n${window.location.href}`;
    const shareURL = `whatsapp://send?text=${encodeURIComponent(shareMessage)}`;
    window.open(shareURL);
  };

  const shareOnGmail = (qrCode) => {
    const shareSubject = 'Check out this QR code!';
    const shareBody = window.location.href;
    const shareURL = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(
      shareSubject
    )}&body=${encodeURIComponent(shareBody)}`;
    window.open(shareURL);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
        
      <DialogContent>
        <h3>Share QR Code</h3>
        {sharedOn ? (
          <p>Shared on {sharedOn}</p>
        ) : (
          <div>
            <div>
            <Button
              variant="contained"
              color="primary"
              style={{ justifyContent:'space-between'}}
             
              onClick={() => shareOnFacebook(qrCode)}
            >
              Facebook <AiOutlineFacebook  size={"1.75em"} />
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{
                marginLeft:'20px',
                justifyContent:'space-between'
              }}
              onClick={() => shareOnWhatsApp(qrCode)}
            >
               WhatsApp <TbBrandWhatsapp size={'1.75em'} />
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{
                marginLeft:'20px',
               justifyContent:'space-between'
              }}
              onClick={() => shareOnGmail(qrCode)}
            >
               Gmail  < TbBrandGmail size={"1.75em"} />
            </Button>
            </div>
          </div>
        )};
      
       
      </DialogContent>
     
    </Dialog>
  );
};

export default ShareDialog;
