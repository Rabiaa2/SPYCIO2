import { createClient  } from "@supabase/supabase-js";
import {Auth} from "@supabase/auth-ui-react";
import { useNavigate } from "react-router-dom";
import { ThemeSupa } from '@supabase/auth-ui-shared'
import logo from '../logo.png'
import './login.css'
const supabase=createClient(
    "https://xvdhdrezujxnmevczjsj.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZGhkcmV6dWp4bm1ldmN6anNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA4MTc5MTAsImV4cCI6MjAwNjM5MzkxMH0.P4UUIpCRCWgtYwSkN5hyudiEr2hhEwPElMGbj2F8xP8"
)


function Login(){
    const navigate = useNavigate();

    // Listen for authentication state changes
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        navigate('/success');
      } else {
        navigate('/');
      }
    });
    return(
        <div className="App">
      <header className="App-header">
         <img src={logo} alt='' className="image"/>   
            <Auth 
                supabaseClient={supabase}
                appearance={{ theme:ThemeSupa}}
                theme="dark"
                providers={['discord']}
            
            />
      </header>
    </div>
    )
}
export default Login;