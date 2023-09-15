import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Avatar from './Avatar'

export default function Account() {
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState(null)

  const [avatar_url, setAvatarUrl] = useState(null)
  const [user, setUser] = useState(null);
  const [user_id, setUser_id] = useState(null)

  async function getUserData(){
    await supabase.auth.getUser().then((value)=>{
       if (value.data?.user) {
           setUser(value.data.user);
           setUser_id(value.data.user.id)
       }
    })
  }
  
  useEffect(() => {
    
  getUserData();
    async function getProfile() {
      setLoading(true)
      

      let { data, error } = await supabase
        .from('profiles')
        .select(`fullName, avatar_url`)
        .eq('id', user_id)
        .single()

      if (error) {
        console.warn(error)
      } else if (data) {
        setFullName(data.fullName)
        setAvatarUrl(data.avatar_url)
      }

      setLoading(false)
    }

    getProfile()
  }, [])

  async function updateProfile(event, avatarUrl) {
    event.preventDefault()

    setLoading(true)

    const updates = {
      id: user_id,
      fullName,
      avatar_url,
      updated_at: new Date(),
    }

    let { error } = await supabase.from('profiles').upsert(updates)

    if (error) {
      alert(error.message)
    } else {
      setAvatarUrl(avatarUrl)
    }
    setLoading(false)
  }

  return (
    <div>
      <Avatar
      url={avatar_url}
    />
      <form onSubmit={updateProfile} className="form-widget">
      <div>
        <label htmlFor="fullName">Name</label>
        <input
          id="fullName"
          type="text"
          required
          value={fullName || ''}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      

      <div>
        <button className="button block primary" type="submit" disabled={loading}>
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      
    </form>
    </div>

  
    
  )
}