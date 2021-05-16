import React,{useEffect, useState} from 'react'

import './CardsContainer.scss'

import img from "../../images/img.png";
import {Link} from 'react-router-dom'
import SearchInput, {createFilter} from 'react-search-input' //https://www.npmjs.com/package/react-search-input
import firebase from 'firebase'

import { Redirect } from 'react-router';
import Loading from '../others/Loading'

function CardsContainer(props) {

    const [arrayOfObjects,set_arrayOfObjects ] = useState([])
    const [filtered_collectionArray, set_filtered_collectionArray ] = useState([])
    const [searchTerm, set_searchTerm] = useState('')
    const KEYS_TO_FILTERS = ['name', 'description', 'category', 'ageGroup', 'price']

    useEffect(() => {
        let temp = arrayOfObjects.filter(createFilter(searchTerm, KEYS_TO_FILTERS, [{caseSensitive:true, fuzzy:true, sortResults:true}]))// caseSensitive ish naka
        set_filtered_collectionArray(temp)
      }, [searchTerm])

    useEffect(() => {
        function getCards(){
            let array = []
            firebase.firestore().collection('cards').get().then( (snapshot) => { // eslint-disable-line no-loop-func
                snapshot.forEach((doc) => { 
                    let temp = doc.data();  
                    array.push(temp)
                });
                set_arrayOfObjects(array)
                set_filtered_collectionArray(array) 
            }).catch( (error) => {    console.log("Error getting document:", error);    });
        }
    getCards()
    }, [])

    if(props.user === 'notNull'){ 
        return (<Loading  />)
    }else if(props.user === null){ 
        return (<Redirect  to="/" />)
    }else if(props.user !== null){
        return (
            <div id="cards-container">


                <input className="search-input" placeholder="Search.." onChange={(e) => { set_searchTerm(e.target.value)  }} />

                <div id="cards">

                    <div className="card">
                        <img className="card-img" src={img} alt="img"/>
                        <div className="card-under-img">
                            <div className="card-infos">
                                <div className="card-name"> </div>
                                <div className="card-sizes"> </div>
                            </div>
                            <Link to='/cards/create' href="#" id="card-button-create" >Create Card</Link>

                        </div>
                        
                    </div>

                {
                    filtered_collectionArray.map((data, index) => {
                        console.log(222222)
                    console.log(data)
                        return(
                            <div className="card" key={data.cardId}>
                                <img className="card-img" src={img} alt="img"/>
                                <div className="card-under-img">
                                    <div className="card-infos">
                                        <div className="card-info-element">{data.name}</div>
                                        <div className="card-info-element">{data.description}</div>
                                        <div className="card-info-element">Category: {data.category}</div>
                                        <div className="card-info-element">Age Group: {data.ageGroup}</div>
                                        <div className="card-info-price">Price: {data.price}</div>
                                    </div>
                                    <Link to={`cards/${data.cardId}`} href="#" className="card-button" >View</Link>

                                </div>
                                
                            </div>
                            )
                        })
                    }
                </div>

            </div>
        )
    }
}

export default CardsContainer
