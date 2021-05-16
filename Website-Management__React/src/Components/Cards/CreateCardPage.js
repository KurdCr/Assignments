import React,{useState} from 'react'
import './CardPage.scss'
import {useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import firebase from 'firebase';

import { Redirect } from 'react-router';
import Loading from '../others/Loading'

function CreateCardPage(props) {
    const history = useHistory();
    const { register, handleSubmit, formState: { errors } } = useForm();



    function AddCard(data){
    
          let time = firebase.firestore.FieldValue.serverTimestamp()
          const cardRef = firebase.firestore().collection('cards').doc()
    
          const batch = firebase.firestore().batch();
          batch.set(cardRef, {arrayOfSizes: data.arrayOfSizes},{merge:true}); 
          batch.set(cardRef, {latest_typeId: latest_typeId},{merge:true});
          batch.set(cardRef, {name: data.name},{merge:true}); 
          batch.set(cardRef, {description: data.description},{merge:true}); 
          batch.set(cardRef, {price: data.price},{merge:true}); 
          batch.set(cardRef, {ageGroup: data.ageGroup},{merge:true}); 
          batch.set(cardRef, {category: data.category},{merge:true}); 
          batch.set(cardRef, {cardId: cardRef.id},{merge:true}); 
          batch.set(cardRef, {time:  firebase.firestore.FieldValue.serverTimestamp()},{merge:true}); 
    
      
          batch.commit().then(  () => {
              
          });   

         
      }

    const onSubmit = data => {
        data.arrayOfSizes = arrayOfSizes
        AddCard(data)
        history.push("/cards");

        props.toast.success("Card Created Succesfully",{ position: "bottom-right",  autoClose: 2000 } );
    }
    // console.log("error")
    // console.log(errors);


    const [latest_typeId, set_latest_typeId] = useState(1)
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
            <form id="form-createCard" onSubmit={handleSubmit(onSubmit)}>
            <div id="form-selects">
                <select className="form-select" {...register("category", { required: true })}>
                    <option selected disabled value="Category">Category</option>
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
                <select className="form-select" {...register("ageGroup", { required: true })}>
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
                    <div className="form-size">
                        <input className="form-sizeName" type="text" placeholder="Size Name" value={key.sizeName} onChange={(e) => { handleSizeChange(index, "sizeName", e.target.value) }} />
                        <input className="form-sizeColor" type="text" placeholder="Size Color" value={key.sizeColor} onChange={(e) => { handleSizeChange(index, "sizeColor", e.target.value) }} />
                        <input className="form-sizeQuantity" type="number" placeholder="Size Quantity" value={key.sizeQuantity} onChange={(e) => { handleSizeChange(index, "sizeQuantity", e.target.value) }} />
                        <input className="form-button-delete" type="button" onClick={()=>{ removeSize(index) }} value="Delete Size" />
                    </div>
                )
                })
            }
                <input id="form-sizes-button" type="button" onClick={addNewSize} value="Add New Size" />

            </div>
            
            <div id="form-inputs">
                <input className="input-text" type="text" placeholder="Name" {...register("name", {required: true})} />
                <input className="input-text" type="text" placeholder="Description" {...register("description", {required: true})} />
                <input className="input-number" type="number" placeholder="Price" {...register("price", {required: true, minLength: 1, maxLength: 15})} />

            </div>
        
            <input id="form-button" type="submit" value="Create Card"/>
            
        </form>
       
        )
    }
}

export default CreateCardPage
