import React,{useEffect, useState} from 'react'
import './CardPage.scss'
import { useForm } from 'react-hook-form';
import firebase from 'firebase'

function Order(props) {
    const { register, handleSubmit, reset ,  formState: { errors } } = useForm();
  
    const onSubmit = data => {
        data.arrayOfTypes_selected = arrayOfTypes_selected
        addOrder(data)

        reset()
        set_arrayOfTypes_selected([])
        document.getElementById("default-option").selected = 'selected'

        props.toast.success("Order Added Succesfully",{ position: "bottom-right",  autoClose: 2000 } );
    }
    

  function addOrder(data){
    let array = JSON.parse(JSON.stringify(data.arrayOfTypes_selected)) 
    for (let i = 0; i < array.length; i++) {
        delete array[i].index
    }
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        
    }
    const cardRef = firebase.firestore().collection('cards').doc(props.pathName)
    const ordersRef = firebase.firestore().collection('orders').doc()

    const batch = firebase.firestore().batch();
    batch.set(cardRef, {arrayOfSizes: props.arrayOfSizes},{merge:true}); 
    batch.set(ordersRef, {arrayOfTypes: array},{merge:true}); 
    batch.set(ordersRef, {name: data.name},{merge:true}); 
    batch.set(ordersRef, {city: data.city},{merge:true}); 
    batch.set(ordersRef, {phoneNumber: data.phoneNumber},{merge:true}); 
    batch.set(ordersRef, {description: data.description},{merge:true}); 
    batch.set(ordersRef, {orderId: ordersRef.id},{merge:true}); 
    batch.set(ordersRef, {cardId: props.cardId},{merge:true}); 
    batch.set(ordersRef, {time:  firebase.firestore.FieldValue.serverTimestamp()},{merge:true}); 


    batch.commit().then(  () => {   console.log('Order Added')  });   

  }


    const [arrayOfTypes_selected, set_arrayOfTypes_selected] = useState( [] )
    function addNewType_forSelected(index){
        document.getElementById("default-option").selected = 'selected'

      const newArr = JSON.parse(JSON.stringify(arrayOfTypes_selected));
      let obj = JSON.parse(JSON.stringify(props.arrayOfSizes[index])) 
      obj.index = index
      
      newArr.push(obj)
      set_arrayOfTypes_selected(newArr)

      props.arrayOfSizes[index].sizeQuantity--
      props.set_arrayOfSizes(props.arrayOfSizes)
    }


    function deleteType(data, index){
      const newArr = JSON.parse(JSON.stringify(arrayOfTypes_selected));
      newArr.splice(index, 1); 
      set_arrayOfTypes_selected(newArr)

      props.arrayOfSizes[data.index].sizeQuantity++
      props.set_arrayOfSizes(props.arrayOfSizes)
    }

    return (
        <form id="form-order" onSubmit={handleSubmit(onSubmit)}>

            <div id="form-inputs">
                    <input className="input-text" type="text" placeholder="Name" {...register("name", {required: true})} />
                    <input className="input-text" type="text" placeholder="City" {...register("city", {required: true})} />
                    <input className="input-number" type="number" placeholder="Phone Number" {...register("phoneNumber", {required: true, minLength: 1, maxLength: 15})} />
                    <input className="input-text" type="text" placeholder="description" {...register("description", {required: true})} />
                </div>

                
               
                

                <div id="form-types">
                { arrayOfTypes_selected === undefined ? "" :arrayOfTypes_selected.map((data, index) =>{
                    return(
                        <div className="form-type" key={`${data.sizeName}${index}`} >
                            <input disabled className="form-type-info" type="text" placeholder="Type" value={`${data.sizeName} ${data.sizeColor}`} />
                            <input className="form-button-delete" type="button" onClick={()=>{ deleteType(data, index) }} value="Delete Size" />
                        </div>
                    )
                    })
                }
                    
                    <select id="form-types-select" onChange={(e)=>{addNewType_forSelected(e.target.value)}}>
                        <option id="default-option" selected disabled value="Types">Add Types</option>
                        { props.arrayOfSizes === undefined ? "" : props.arrayOfSizes.map((data, index) =>{
                         
                            return(   
 <option disabled={data.sizeQuantity <= 0 ? true : false} value={index} key={data.sizeName+data.sizeColor} >{`${data.sizeName} ${data.sizeColor}, Remaining : ${data.sizeQuantity === 0 ? "Out Of Stock" : data.sizeQuantity}`}</option>    )
                            })
                        }
                    </select>
    

                </div>
                
                
            
                <input id="form-button-update" type="submit" value="Add Order"/>
                
            </form>

    )
}

export default Order
