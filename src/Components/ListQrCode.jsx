import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { supabase } from '../supabaseClient';
import { Button } from '@material-ui/core';
import ShareDialog from './ShareDialog'; // Import the ShareDialog component
import {TfiSharethis } from "react-icons/tfi";

const QRCodeList = () => {
  const [qrCodes, setQRCodes] = useState([]);
  const [user, setUser] = useState({});
  const [user_id, setUser_id] = useState(null);
  const [selectedQRCode, setSelectedQRCode] = useState(null);

  async function getUserData() {
    await supabase.auth.getUser().then((value) => {
      if (value.data?.user) {
        setUser(value.data.user);
        setUser_id(value.data.user.id);
      }
    });
  }

  useEffect(() => {
    getUserData();

    const fetchQRCodes = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        setUser(userData.user);
        try {
          const { data, error } = await supabase
            .from('qrcode')
            .select('*')
            .eq('user_id', userData.user.id);

          if (error) {
            console.error('Error fetching QR codes:', error.message);
            return;
          }

          setQRCodes(data);
        } catch (error) {
          console.error('Error fetching QR codes:', error.message);
        }
      }
    };

    fetchQRCodes();
  }, []);

  const openShareDialog = (qrCode) => {
    setSelectedQRCode(qrCode);
  };

  const closeShareDialog = () => {
    setSelectedQRCode(null);
  };

  return (
    <div>
      <h2>List of QR Codes</h2><br/>
      <div className="qrcode-list">
        {qrCodes.map((qrCode, index) => (
          <div key={index} className="qrcode-item">
            <h4>QR Code Name:</h4>
            <h3
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginLeft: '150px',
                bottom: '150px',
                marginTop: '-19px',
              }}
            >
              {qrCode.nameQrCode}
            </h3>
            <QRCode value={qrCode.qr_code_image} />
            <Button
              variant="contained"
              color="primary"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginLeft: '150px',
                bottom: '50px',
              }}
              onClick={() => openShareDialog(qrCode)}
            >
              Share <TfiSharethis size={'1.25em'} />
            </Button>
          </div>
        ))}
      </div>
      <ShareDialog
        isOpen={!!selectedQRCode}
        onClose={closeShareDialog}
        shareUrl={selectedQRCode ? selectedQRCode.qr_code_image : ''}
      />
    </div>
  );
};

export default QRCodeList;
