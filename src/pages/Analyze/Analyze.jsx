import './analyze.css';
import { useState, useEffect } from 'react';
import {MdAddPhotoAlternate} from 'react-icons/md'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {getFirestore, collection, addDoc } from "firebase/firestore"; 

import { getAuth } from "firebase/auth";
import loadImage from "blueimp-load-image";
import Loading from '../../Components/Loading/Loading';
const Analyze = ({weather}) => {  

  const [file, setFile] = useState(null)
  const [clothingItems, setClothingItems] = useState([])
  const [score, setScore] = useState(0)
  const [message, setMessage] = useState('')
  const [imageAsURL, setImageAsURL] = useState("")

  const [clothingCheckArray, setClothingCheckArray] = useState([])

  const [loading, setLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState('')
  
  const ignoreItemsArray = [
    "Waist", "Arm", "Gesture", "Shoulder", "Leg", "Grey", "Knee", 
    "Fashion design", "Bag", "Neck", "Thigh", "Human body", "Sunglasses", "Human body"
  ]
  
  // const clothingScoreArray = [{ name:"T-shirt", score:0.1}, {name:"Sleeves", score:0.15}, 
  //                               {name:"Tube top", score:0.06},
  //                               {name:"Shorts", score:0.15}, {name:"Trousers", score:0.28}, 
  //                               {name:"Vest", score:0.3}, {name:"Sweater", score:0.3}, 
  //                               {name:"Jacket", score:0.5}, {name:"Coat", score:0.7},
  //                               {name:"Socks", score:0.02}, {name:"Boots", score:0.1}, 
  //                               {name:"Skirt", score:0.19}, 
  //                               {name:"Robes", score:0.53}, {name:"Shoes", score:0.02},
  //                               {name:"Sweatpants", score:0.28}, 
  //                               {name:"Sandals", score:0.02}, {name:"Slippers", score:0.02},
  //                               {name:"Sportswear", score:0.28}, {name:"Turtleneck", score:0.24},
  //                               {name:"Pants", score:0.3},
  //                               {name:"Jersey", score:0.1}, {name:"Denim", score:0.3},
  //                               {name:"Dress", score:0.4}, {name:"Collar", score:0.1}]

  const clothingScoreArr = [{category: "UnderShirts", clothing: [{name: "T-shirt", score: 0.1}, {name:"Collar", score:0.1}, {name:"Jersey", score:0.1}, {name:"Dress", score:0.3}]},
                            {category: "Shirts", clothing: [{name: "Sleeve", score: 0.2}, {name: "Turtleneck", score: 0.35}, {name:"Sweater", score:0.3}]},
                            {category: "Trousers", clothing: [{name: "Short", score: 0.15}, {name:"Trousers", score:0.3}, {name:"Denim", score:0.25},{name:"Jean", score:0.25},{name:"Pant", score:0.3},{name:"Sportswear", score:0.28}]},
                            {category: "Jacket", clothing: [{name:"Vest", score:0.3}, {name:"Jacket", score:0.5}, {name:"Coat", score:0.7}, {name:"Robe", score:0.53}]},
                            {category: "Shoes", clothing: [{name:"Boots", score:0.1}, {name:"Shoes", score:0.04}, {name:"Slippers", score:0.02}, {name:"Sandals", score:0.02}]}]

  useEffect(() => {

    let tempArray = []

    for(var i = 0; i < clothingScoreArr.length; i++){
      for (var j = 0; j < clothingScoreArr[i].clothing.length; j++) {
        tempArray.push(clothingScoreArr[i].clothing[j].name.toLowerCase())
      }
    }
    
    setClothingCheckArray(tempArray)
    setLoading(false)
  }, [])

  const reset = () => {
    setFile(null)
    setClothingItems([])
    setScore(0)
    setMessage('')
    setImageAsURL("")
  }

  const addToFirebase = async() => {
    setLoading(true)
    setLoadingMessage("Saving Your Outfit")
    
    if(file !== null && imageAsURL !== ""){
      const db = getFirestore();
      await addDoc(collection(db, "cities"), {
        user: getAuth().currentUser.uid,
        image: imageAsURL,
      }).then(() => {
        console.log("Document successfully written!");
        reset()
        setLoading(false)
      })

    }
  }

  
  const handleScoring = (clothingItems) => { 

    setLoadingMessage("Analyzing Your Outfit")
    let shoes = false;
    let trousers = [];

    let clothingScore = 0;
    const totalCloScore = (70-((weather.main.temp - 273.15) * 9/5 + 32))*0.01277 + 1

    for (var x = 0; x < clothingItems.length; x++) {
      for(var i = 0; i < clothingScoreArr.length; i++){
        let total = 0;
        let count = 0;
        for (var j = 0; j < clothingScoreArr[i].clothing.length; j++) {
          if(clothingScoreArr[i].clothing[j].name.toLowerCase().includes(clothingItems[x].description.toLowerCase())||
            clothingItems[x].description.toLowerCase().includes(clothingScoreArr[i].clothing[j].name.toLowerCase())){
              if(clothingScoreArr[i].category === "Shoes"){
                shoes = true;
              }
              if(clothingScoreArr[i].category === "Trousers"){
                console.log(clothingScoreArr[i].clothing[j].score)
                trousers.push(clothingScoreArr[i].clothing[j].score)
              }
              else{
                if(count>0)
                  total+=clothingScoreArr[i].clothing[j].score*(0.5*count);
                else
                  total+=clothingScoreArr[i].clothing[j].score;
                count++;
                console.log(clothingScoreArr[i].clothing[j].name)
              }
          }
        }
        clothingScore+= total;
      }
    }

    var biggest = 0;
    for(var i = 0; i < trousers.length; i++){
      if(trousers[i]>biggest){
        biggest = trousers[i];
      }
    }
    clothingScore+=biggest;


    // Assuming the person automatically wears underwear, shoes, socks
    if(shoes)
      clothingScore += 0.04 + 0.02;
    else
      clothingScore += 0.04 + 0.04 + 0.02;


    let readinessPercentage = Math.round((clothingScore/totalCloScore)*100);
    
    console.log(readinessPercentage);

    if(readinessPercentage > 100){
      setMessage("You need to take off some clothes!")
    } 
    else if(readinessPercentage < 75){
      setMessage("You need to wear more clothes!")
    }
    else if(readinessPercentage < 15 ){
      setMessage("Try inputting a different outfit picture!")
    }
    else{
      setMessage("You are ready to go!")
    }
    
    setScore(readinessPercentage);
  }
  

  const handleStorage = async(file) => {
    const uid = getAuth().currentUser.uid;
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (let i = 0; i < 15; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    const storage = getStorage();
    const picStorageRef = ref(storage, uid + "/" +text); 

    await uploadBytes(picStorageRef, file)

    await getDownloadURL(picStorageRef).then(async(url) => {
      setImageAsURL(url)
      const googleAPIResult = await callGoogleVisionApi(url)
      console.log(googleAPIResult.responses[0].labelAnnotations)
      const handleScoringArrayFirstFilter =  googleAPIResult.responses[0].labelAnnotations.filter((item) => (clothingCheckArray.includes(item.description.toLowerCase())||item.description.toLowerCase().includes(clothingCheckArray)))
      const handleScoringArraySecondFilter = handleScoringArrayFirstFilter.filter((item) => item.score > 0.75)
      setClothingItems(handleScoringArraySecondFilter)
      handleScoring(handleScoringArraySecondFilter)

    })
    .catch((error) => {
      console.log(error)
    });

   
}

const callGoogleVisionApi = async (imageURL) => {
  let googleVisionRes = await fetch("https://content-vision.googleapis.com/v1/images:annotate?alt=json&key=AIzaSyDc1qjfy_VD3CLNb6RnBNeAFDc_Udks_8Q", {
      method: 'POST',
      body: JSON.stringify({
          "requests": [
              {
                  
                "features": [
                  {
                    "type": "LABEL_DETECTION",
                    "maxResults": 20
                  }
                ],
                "image": {
                  "source": {
                    "imageUri": imageURL
                  }
                }
              }
          ]
      })
   });

    return await googleVisionRes.json();

  }

  const handleImageAsFile = async(e) => {
    
    setLoading(true)

    const bgRemoveAPI_KEY = "ffYmCMHuw9tavwa4JwMxgqbZ"
    const image = e.target.files[0]

    const resizedImage = await loadImage(image, {
      // resize before sending to Remove.bg for performance
      maxWidth: 1500,
      maxHeight: 1500,
      canvas: true,
    });
    
    resizedImage.image.toBlob(async function (inputBlob) {
      const formData = new FormData();
      formData.append("image_file", inputBlob);

      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": bgRemoveAPI_KEY,
        },
        body: formData,
      });

      if (response.status === 200) {
        const outputBlob = await response.blob();
        const imageObjectURL = URL.createObjectURL(outputBlob);

        setFile(imageObjectURL)

        await handleStorage(outputBlob).then(() => {
          setLoading(false)
          setLoadingMessage("")

        })

        
        
      } else {
        alert("Error removing background");
      }

    });

    setLoading(false)

  };

  return (
    <>
      {
        loading ? <Loading message = {loadingMessage} /> :
        <div className="analyze">
        <div className="addBox">
          {
            file === null ?
            <>
            <h2>Add An Outfit</h2>
              <label>
                <input type="file" id="file" accept="image/*" onChange={(e)=>handleImageAsFile(e)}/>
                <div>
                  <MdAddPhotoAlternate size = {75} />
                </div>
              </label>
            </> 
            :
            <>
              <div className="added-outfit">
                <img src={file} alt="outfit" />
              </div>
            </>
          }
        </div>
  
        <div className="analyzeBox">
          <h2>Outfit Analysis</h2>
            {
              clothingItems.length > 0 ? 
              <>
                <div className="allItems">
                {
                    clothingItems.map((item, index) => {
                      return (
                        <div className="item" key={index}>
                          {item.description}
                        </div>
                      ) 
                    })
                  }
                </div>
                <div>
                  <h2 style = {{textAlign:"center", margin: "1rem 0 auto 0"}}>{score}% ready for today's weather</h2>
                  <h2 style = {{textAlign:"center", margin: "0 auto"}}>{message}</h2>
                </div>
                <div className="button-collection">
                  {
                    score > 15 && <button className="save-button" onClick={addToFirebase}>Save This Outfit</button>
                  }
                  <button className="reset-button" onClick={reset}>Try Another Outfit</button>
                </div>
              </>
  
              :
              <>
                <p>
                  {
                    file !== null ? "Analyzing..." : "Add an outfit to analyze above..."
                  }
                </p>
              </>
            }
            
        </div>  
      </div>
      }
    </>
  );
}

export default Analyze;