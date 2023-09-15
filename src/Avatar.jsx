import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'


export default function Avatar({ url, size,  }) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState()
  const [user,setUser] = useState()
  const [image, setImage] = useState()
useEffect(()=>{
      async function getUserData(){
        await supabase.auth.getUser().then((value)=>{
           if (value.data?.user) {
               console.log(value.data.user);
               setUser(value.data.user);
               setId(value.data.user.id)
           }
        })
      }
      getUserData();
   },[]);
  useEffect(()=>{
    const fetchdata = async () =>{
      try {
      const { data: profiles, error } = await supabase
    .from('profiles')
    .select("*")
    .eq("id",id)
    setImage(profiles[0].avatar_url)
  }
    catch(error) {
      console.log(error)
    }
    }
  fetchdata()
    
  },[image])
  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])
  
  async function onUpload(link ) {
    setLoading(true)
    const updates = {
      avatar_url : link,
      updated_at: new Date(),
    }
    

    const { error } = await supabase
    .from('profiles')
    .update([updates])
    .eq("id", id)

    if (error) {
      alert(error.message)
    } else {
      setAvatarUrl(avatarUrl)
    }
    setLoading(false)
  }
  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }

  async function uploadAvatar(event) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(`https://xvdhdrezujxnmevczjsj.supabase.co/storage/v1/object/public/avatars/${fileName}`)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {avatarUrl ? (
        <img
          src={image}
          alt="Avatar"
          className="avatar image"
          style={{ height: size, width: size }}
        />
      ) : (
        <div className="avatar no-image" style={{ height: size, width: size }} />
      )}
      <div style={{ width: size }}>
        <label className="button primary block" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload'}
        </label>
        
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
      <img
          src={image}
          className="avatar image"
          style={{ height: size, width: size }}
        />
    </div>
  )
}