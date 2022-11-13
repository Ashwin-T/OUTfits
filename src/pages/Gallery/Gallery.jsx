import { useState } from 'react';
import { useEffect } from 'react';
import './gallery.css';
import {getFirestore, getDocs, collection, query, where } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Loading from '../../Components/Loading/Loading';
const Gallery = () => {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const db = getFirestore();
  const auth = getAuth();

  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {

    const getData = async () => {

      const collRef = collection(db, "cities");
      const q = query(collRef, where("user", "==", auth.currentUser.uid));
      let temp_array = []
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        temp_array.push(doc.data().image)
      });

      setImages(temp_array)
      setLoading(false)
    }
    getData()
  }, [])

  const handleCancel = () => {
    setSelectedImage("");
  }
  
  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate("/");
    }).catch((error) => {
      // An error happened.
    });
  }

  return (
    <>
      {
        loading ? <Loading message="Getting Saved Outfits" /> :
        <>
        {
        selectedImage !== "" ? 
        <>
          <img src = {selectedImage} className = "selectedImage" />
          <p className='cancel' onClick={handleCancel}>Go Back</p>
        </>
        :
      <div className="gallery">
        <h1>{auth.currentUser.displayName.split(" ")[0] + "'s Gallery"}</h1>
        {
          images.length > 0 ? 
          <div className="images">
            {
              images.map((image, index) => {
                return (
                  <img onClick = {()=>setSelectedImage(image)}key = {index} src={image} alt = 'clothing' />
                )
              })
            }
          </div>
          :
          <>
            <span>Try saving a few outfits that you like!</span>
          </>
        }
          <button className="sign-out" onClick={handleSignOut}>Sign Out</button>
      </div>
      }
        </>
      }
    </>

  )
}
export default Gallery;