import React,{useEffect, useState} from 'react'
import firebase from 'firebase'


// import './Transactions.scss'
import '.././Cards/CardPage_Transactions.scss'
import SearchInput, {createFilter} from 'react-search-input' //https://www.npmjs.com/package/react-search-input

import { Redirect } from 'react-router';
import Loading from '../others/Loading'


function History(props) {

    const [arrayOfObjects, set_arrayOfObjects ] = useState([])
    const [filtered_collectionArray,set_filtered_collectionArray ] = useState([])
    const [searchTerm, set_searchTerm] = useState('')
    const KEYS_TO_FILTERS = ['name', 'city', 'phoneNumber', 'description', 'time', 'arrayOfTypes.sizeName', 'arrayOfTypes.sizeColor', 'state']

    useEffect(() => {
        let temp = arrayOfObjects.filter(createFilter(searchTerm, KEYS_TO_FILTERS, [{caseSensitive:true, fuzzy:true, sortResults:true}]))// caseSensitive ish naka
        set_filtered_collectionArray(temp)
      }, [searchTerm])

    useEffect(() => {
        function getHistory(){
            let array = []
            firebase.firestore().collection('history').orderBy("time").limit(10).get().then( (snapshot) => { // eslint-disable-line no-loop-func
                snapshot.forEach((doc) => { 
                    let temp = doc.data();  
                    array.push(temp)
                });
                console.log(array)
                set_arrayOfObjects(array)
                set_filtered_collectionArray(array)
            }).catch( (error) => {    console.log("Error getting document:", error);    });
        }
        getHistory()
    }, [])


    const onSubmit = () => {

    }


    if(props.user === 'notNull'){ 
        return (<Loading  />)
    }else if(props.user === null){ 
        return (<Redirect  to="/" />)
    }else if(props.user !== null){
        return (
            <form id="form-transaction-page" onSubmit={onSubmit}>

                <input className="search-input" placeholder="Search.." onChange={(e) => { set_searchTerm(e.target.value)  }} />

                <div id="div-table-container">
                    <table id="form-table">
                        <tr>
                            <th>Name</th>
                            <th>City</th>
                            <th>Phone</th>
                            <th>Description</th>              
                            <th>Date Added (-)</th>
                            <th>Types</th>
                            <th>State</th>
                        </tr>
                    
                        { filtered_collectionArray === undefined ? "" : filtered_collectionArray.map((data, index) =>{
                            return(
                                <tr className="form-tr" key={`${data.name}${index}`}  >
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
                                    <td className={data.state === "Returned" ? "form-table-td-returned" : "form-table-td-received"}>{data.state}</td>
                                </tr>                   
                                )
                            })
                        } 
                
                    </table>
                </div>    
                </form>
            )
        }    
    }

export default History
