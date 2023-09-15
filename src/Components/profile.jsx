import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"






 function Profile ({user_id}){
    
  const [image, setAvatarUrl] = useState()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    async function getProfile() {
      setLoading(true)

      let { data, error } = await supabase
        .from('profiles')
        .select(` avatar_url`)
        .eq('id', user_id)
        .single()

      if (error) {
        console.warn(error)
      } else if (data) {
        setAvatarUrl(data.avatar_url)
      }

      setLoading(false)
    }

    getProfile()
  }, [user_id])
    return(
        <div>
            <a href="/Account">
                <img
                    src={image}
                    style={{ height: "150px", width: "150px" }}
                    />
            </a>
        </div>
    )
}


export default Profile;




