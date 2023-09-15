import './App.css';
import Success from './pages/successPage';
import { useState, useEffect } from 'react';
import { createClient  } from "@supabase/supabase-js";
import { BrowserRouter as Router ,Routes,Route } from 'react-router-dom';
import Account from './Account';
import Auth from './Auth';
import Login from './pages/LoginPage';
import Avatar from './Avatar';
import Emails from './Components/Emails';
const supabase=createClient(
  "https://xvdhdrezujxnmevczjsj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZGhkcmV6dWp4bm1ldmN6anNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA4MTc5MTAsImV4cCI6MjAwNjM5MzkxMH0.P4UUIpCRCWgtYwSkN5hyudiEr2hhEwPElMGbj2F8xP8"
)
function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

 

  return (
         
        
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/success' element={<Success/>}/>
        <Route path='/Account' element={<Account/>} />
   
      </Routes>
    </Router>
   
  );
}

export default App;