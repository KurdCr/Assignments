
import React,{useEffect, useState} from 'react'
import './CardPage_Transactions.scss'
import firebase from 'firebase'
import SearchInput, {createFilter} from 'react-search-input' //https://www.npmjs.com/package/react-search-input


function Transactions(props) {



   const [arrayOfObjects, set_arrayOfObjects ] = useState([])
    const [filtered_collectionArray,set_filtered_collectionArray ] = useState([])
    const [searchTerm, set_searchTerm] = useState('')
    const KEYS_TO_FILTERS = ['name', 'city', 'phoneNumber', 'description', 'time', 'arrayOfTypes.sizeName', 'arrayOfTypes.sizeColor']

    useEffect(() => {
        let temp = arrayOfObjects.filter(createFilter(searchTerm, KEYS_TO_FILTERS, [{caseSensitive:true, fuzzy:true, sortResults:true}]))// caseSensitive ish naka
        set_filtered_collectionArray(temp)
      }, [searchTerm])
    
    useEffect(() => {
        getTransactions()
    }, [props.cardId])

    function getTransactions(){
        let array = []
        firebase.firestore().collection('orders').where("cardId", "==", props.cardId || '').get().then( (snapshot) => { // eslint-disable-line no-loop-func
            snapshot.forEach((doc) => { 
                let temp = doc.data();  
                array.push(temp)
            });
            set_arrayOfObjects(array)
            set_filtered_collectionArray(array)
        }).catch( (error) => {    console.log("Error getting document:", error);    });
    }



    const onSubmit = () => {

    }
 

    




    async function returned(index){
        let temp_object = {}
        await firebase.firestore().collection('cards').doc(props.cardId).get().then( (snapshot) => { // eslint-disable-line no-loop-func
            temp_object = snapshot.data();  
        }).catch( (error) => {    console.log("Error getting document:", error);    });
        //
        for (let i = 0; i < temp_object.arrayOfSizes.length; i++) {
            for (let j = 0; j < arrayOfObjects[index].arrayOfTypes.length; j++) {
                if(arrayOfObjects[index].arrayOfTypes[j].typeId ===  temp_object.arrayOfSizes[i].typeId){
                    temp_object.arrayOfSizes[i].sizeQuantity++
                } 
             }
         }
        //
        const cardRef = firebase.firestore().collection('cards').doc(props.cardId)   
        const batch = firebase.firestore().batch();
        batch.set(cardRef, {arrayOfSizes: temp_object.arrayOfSizes},{merge:true});     
        batch.commit().then(  () => {  console.log('updated')  });   
        //
        firebase.firestore().collection("orders").doc(arrayOfObjects[index].orderId).delete().then(() => {
        }).catch((error) => {  console.error("Error removing document: ", error);});
        //
        const newArr = JSON.parse(JSON.stringify(arrayOfObjects));
        newArr.splice(index, 1); 
        set_arrayOfObjects(newArr)
        //
        addToHistory(index, 'Returned')
        props.toast.success("Order Returned Succesfully",{ position: "bottom-right",  autoClose: 2000 } );
        //
        getTransactions()
    }

    function received(index){   
        firebase.firestore().collection("orders").doc(arrayOfObjects[index].orderId).delete().then(() => {
        }).catch((error) => {  console.error("Error removing document: ", error);});
        //
        const newArr = JSON.parse(JSON.stringify(arrayOfObjects));
        newArr.splice(index, 1); 
        set_arrayOfObjects(newArr)
        //
        addToHistory(index, 'Received')
        props.toast.success("Order Received Succesfully",{ position: "bottom-right",  autoClose: 2000 } );
        //
        getTransactions()
    }

    function addToHistory(index, state){
        
        const historyRef = firebase.firestore().collection('history').doc()   

        const batch = firebase.firestore().batch();
        batch.set(historyRef, {arrayOfTypes: arrayOfObjects[index].arrayOfTypes},{merge:true}); 
        batch.set(historyRef, {name: arrayOfObjects[index].name},{merge:true}); 
        batch.set(historyRef, {city: arrayOfObjects[index].city},{merge:true}); 
        batch.set(historyRef, {phoneNumber: arrayOfObjects[index].phoneNumber},{merge:true}); 
        batch.set(historyRef, {description: arrayOfObjects[index].description},{merge:true}); 
        batch.set(historyRef, {time: arrayOfObjects[index].time},{merge:true}); 
        batch.set(historyRef, {orderId: arrayOfObjects[index].orderId},{merge:true}); 
        batch.set(historyRef, {historyId: historyRef.id},{merge:true}); 
        batch.set(historyRef, {state: state},{merge:true}); 
        batch.set(historyRef, {cardId: arrayOfObjects[index].cardId},{merge:true}); 
    
        batch.commit().then(  () => {   console.log('Order Added')  });  
    }

    return (
        <form id="form-transaction" onSubmit={onSubmit}>

            <input className="search-input" placeholder="Search.." onChange={(e) => { set_searchTerm(e.target.value)  }} />

            <div id="div-table-container">
                <table id="form-table">
                    <tr>
                        <th>Name</th>
                        <th>City</th>
                        <th>Phone</th>
                        <th>Description</th>              
                        <th>Date Added</th>
                        <th>Types</th>
                        <th id="th-returned">Returned</th>
                        <th id="th-received">Received</th>
                    </tr>
                
                    { filtered_collectionArray === undefined ? "" : filtered_collectionArray.map((data, index) =>{

                        return(
                            <tr className="form-tr" key={`${data.name}${index}`}>
                                <td>{data.name}</td>
                                <td>{data.city}</td>
                                <td>{data.phoneNumber}</td>
                                <td className="description">{data.description}</td>
                                <td>{new Date(data.time.seconds * 1000).toDateString() + ' at ' + new Date(data.time.seconds * 1000).toLocaleTimeString()}</td>
                                <td>
                                    <ul>
                                    { data.arrayOfTypes === undefined ? "" : data.arrayOfTypes.map((type, index2) =>  {  
                                    return(
                                    <li key={`${type.sizeName}${index2}`}>{type.sizeName} {type.sizeColor}</li>   
                                    )} )}   
                                    </ul>
                                </td>
                                <td className="form-table-td-returned"><input onClick={() => { returned(index) }} className="form-table-returned" type="button" value="Returned"/></td>
                                <td className="form-table-td-received"><input onClick={() => { received(index) }} className="form-table-received" type="button" value="Received"/></td>
                            </tr>                   
                            )
                        })
                    } 
            
                </table>
            </div>


                
            </form>
    )
}

export default Transactions
