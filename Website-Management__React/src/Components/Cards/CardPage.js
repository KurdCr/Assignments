import React,{useEffect, useState} from 'react'
import './CardPage.scss'
import {Link, useLocation, useHistory} from 'react-router-dom'
import { useForm } from 'react-hook-form';
import Order from './CardPage_Order'
import Transactions from './CardPage_Transactions'
import firebase from 'firebase';

import { Redirect } from 'react-router';
import Loading from '../others/Loading'

let pathName;


function CardPage(props) {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();//useForm({mode: 'onBlur'});
   
   
    

    const [isDisabled, set_isDisabled] = useState(true)
    const location = useLocation();
    let history = useHistory();
    
    useEffect(() => {
        let pathname = location.pathname.substr('/cards/'.length)
        pathName = pathname
       function getPageData(){

       }
       if(pathName === "create"){

       }else{
            getPageData()
            getDatas()
       }
    }, [])

    function deleteCard(){
        firebase.firestore().collection("cards").doc(pathName).delete().then(() => {
            props.toast.success("Card Deleted Succesfully",{ position: "bottom-right",  autoClose: 2000 } );
        }).catch((error) => {  console.error("Error removing document: ", error);});
        //
        set_isDisabled(prev => !prev)
        //
       
        history.push('/cards') 
    }


  const [object,set_object ] = useState({})
  function getDatas(){
    let temp_object = {}

    firebase.firestore().collection('cards').doc(pathName).get().then( (snapshot) => { // eslint-disable-line no-loop-func
        temp_object = snapshot.data();  
        set_object( temp_object )
        set_arrayOfSizes( temp_object.arrayOfSizes )

        let arrayProperties = Object.getOwnPropertyNames(temp_object)
        for (let i = 0; i < arrayProperties.length; i++) {
            setValue(arrayProperties[i], temp_object[arrayProperties[i]]); 
        }    
    }).catch( (error) => {    console.log("Error getting document:", error);    });
  }



  function updateCard(data){
    

    const cardRef = firebase.firestore().collection('cards').doc(pathName)

    const batch = firebase.firestore().batch();
    batch.set(cardRef, {arrayOfSizes: data.arrayOfSizes},{merge:true}); 
    batch.set(cardRef, {latest_typeId: latest_typeId},{merge:true});
    batch.set(cardRef, {description: data.description},{merge:true}); 
    batch.set(cardRef, {name: data.name},{merge:true}); 
    batch.set(cardRef, {price: data.price},{merge:true}); 
    batch.set(cardRef, {ageGroup: data.ageGroup},{merge:true}); 
    batch.set(cardRef, {category: data.category},{merge:true}); 
    // batch.set(cardRef, {time:  firebase.firestore.FieldValue.serverTimestamp()},{merge:true}); 

    batch.commit().then(  () => {   console.log('updated')  });   
    setTimeout(() => {
     // getDatas()
    }, 2000);
    props.toast.success("Card Updated Succesfully",{ position: "bottom-right",  autoClose: 2000 } );
    //
    set_isDisabled(prev => !prev)
}

const onSubmit = data => {
  data.arrayOfSizes = arrayOfSizes
  updateCard(data)
}
// console.log("error")
// console.log(errors);



    const [latest_typeId, set_latest_typeId] = useState(0)
    const [arrayOfSizes, set_arrayOfSizes] = useState(
          [     
            {
                sizeName: "Size Name",
                sizeColor:"Size color",
                sizeQuantity: 0,
                typeId : 1
            }
      ]
      )
      function addNewSize(){
        const newArr = JSON.parse(JSON.stringify(arrayOfSizes));
        set_latest_typeId(prev => prev++)
        const newObj = {
            sizeName: "Size Name",
            sizeColor:"Size Color",
            sizeQuantity: 0,
            typeId: latest_typeId+1
        }
   
        newArr.push(newObj)
        set_arrayOfSizes(newArr)
      }
      function handleSizeChange(index, ageGroup, newValue){
        const newArr = JSON.parse(JSON.stringify(arrayOfSizes));
        newArr[index][ageGroup] = newValue
        set_arrayOfSizes(newArr)
      }
      function removeSize(index){
        const newArr = JSON.parse(JSON.stringify(arrayOfSizes));
        set_latest_typeId(prev => prev--)

        newArr.splice(index, 1); 
        set_arrayOfSizes(newArr)
      }

     
    if(props.user === 'notNull'){ 
        return (<Loading  />)
    }else if(props.user === null){ 
        return (<Redirect  to="/" />)
    }else if(props.user !== null){  
        return (
            <div id="page-card-container">
                <form id="form-card" onSubmit={handleSubmit(onSubmit)}>
                    <div id="form-selects">
                        <select disabled={isDisabled} className="form-select" {...register("category", { required: true })}>
                            <option  disabled value="Category">Category</option>
                            <optgroup label="Clothe">
                                <option value="Shirt">Shirt</option>
                                <option value="Jeans">Jeans</option>
                                <option value="Dress">Dress</option>
                            </optgroup>
                            <optgroup label="Accessory">
                                <option value="Watch">Watch</option>
                                <option value="Bracelet">Bracelet</option>
                            </optgroup>
                        </select>
                        <select disabled={isDisabled} className="form-select" {...register("ageGroup", { required: true })}>
                        <option selected disabled value="ageGroup">Age Group</option>
                        <optgroup label="Kid">
                                <option value="Girl">Girl</option>
                                <option value="Boy">Boy</option>
                            </optgroup>
                            <optgroup label="Adult">
                                <option value="Woman">Woman</option>
                                <option value="Man">Man</option>
                            </optgroup>
                        </select>
                    </div>
                        

                    <div id="form-sizes">
                    { arrayOfSizes === undefined ? "" :arrayOfSizes.map((key, index) =>{
                        return(
                            <div className="form-size" key={key.sizeName+""+index}>
                                <input disabled={isDisabled} className="form-sizeName" type="text" placeholder="Size Name" value={key.sizeName} onChange={(e) => { handleSizeChange(index, "sizeName", e.target.value) }} />
                                <input disabled={isDisabled} className="form-sizeColor" type="text" placeholder="Size Color" value={key.sizeColor} onChange={(e) => { handleSizeChange(index, "sizeColor", e.target.value) }} />
                                <input disabled={isDisabled} className="form-sizeQuantity" type="number" placeholder="Size Quantity" value={key.sizeQuantity} onChange={(e) => { handleSizeChange(index, "sizeQuantity", e.target.value) }} />
                                { isDisabled === true ? '' :
                                    <input disabled={isDisabled} className="form-button-delete" type="button" onClick={()=>{ removeSize(index) }} value="Delete Size" />
                                }
                            </div>
                        )
                        })
                    }
                    {isDisabled === true ? '' : 
                        <input id="form-sizes-button" type="button" onClick={addNewSize} value="Add New Size" />
                    }
                        

                    </div>
                    
                    <div id="form-inputs">
                        <input disabled={isDisabled} className="input-text" type="text" placeholder="Name" {...register("name", {required: true})} />
                        <input disabled={isDisabled} className="input-text" type="text" placeholder="Description" {...register("description", {required: true})} />
                        <input disabled={isDisabled} className="input-number" type="number" placeholder="Price" {...register("price", {required: true, minLength: 1, maxLength: 15})} />

                    </div>
                
                    {
                        isDisabled === true ?
                            <input id="form-button" type="button" value="Edit" onClick={()=>{set_isDisabled(!isDisabled)}}/>
                        :   
                            <div id="form-buttons">
                                <input id="form-button-update" type="submit" value="Update"/>
                                <input id="form-button-delete" type="button" value="Delete" onClick={deleteCard}/>
                            </div>
                    }
                    
                </form>

                <Order arrayOfSizes={arrayOfSizes} set_arrayOfSizes={set_arrayOfSizes} pathName={pathName} cardId={object.cardId} toast={props.toast} />
                <Transactions cardId={object.cardId} toast={props.toast} />

            </div>
        )
    }
}

export default CardPage



