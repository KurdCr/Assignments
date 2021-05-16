import React,{useState, useEffect} from 'react'
import {Link} from 'react-router-dom'

import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretSquareDown, faBars } from '@fortawesome/free-solid-svg-icons';

import profileFallBackPhoto from '../../images/default_profile_photo.png';
import logo from '../../images/logo-background.png';

import './nav.scss'

function Nav(props) {

    const [userInfoObject, set_userInfoObject] = useState(null)
    const user = props.user

    useEffect(() => {
        async function get_userInfo(){
            firebase.database().ref(`users/${props.user.uid}/userInfo`).on('value', (snapshot) => { //live update
                let temp_userInfoObject = snapshot.val() 
                set_userInfoObject(temp_userInfoObject)
                } ) 
        }
        
        if(props.user !== null && props.user !== 'notNull'){
            document.getElementById('logout').addEventListener( 'click', logout)
            document.getElementById('check-button').checked = false;

            get_userInfo()
        }
        
     }, [props.user])

    function logout(){
        firebase.auth().signOut().then( ()=> {  
            props.toast.success("Logged Out Succesfully",{ position: "bottom-right",  autoClose: 2000 } );
        })
    }
 
    function closeMobileMenu(){
        document.getElementById('check-button').checked = false;
    }

    function switchDarkMode(){

    }

    const [arrayOfChecked, set_arrayOfChecked] = useState([])
    function handle_arrayOfChecked(value, state){
       
        const newArr = [...arrayOfChecked];
        if(state === true){
            newArr.push(value)
            set_arrayOfChecked(newArr)
        }else{
            newArr.splice(newArr.indexOf(value), 1)
            set_arrayOfChecked(newArr)
        }
        console.log(newArr)
    }


////////////////////////////////////////////////
  const[search, set_search] = useState('')
    const [collectionObject,set_collectionObject ] = useState({})
    const [collectionArray,set_collectionArray ] = useState([])
    const [given_collectionArray,set_given_collectionArray ] = useState([])
    
    
    useEffect(() => {
        function getDatas(){
            let temp_collectionObject = {}, temp
        
            firebase.firestore().collection('orders').get().then( (snapshot) => { // eslint-disable-line no-loop-func
                snapshot.forEach((doc) => { 
                    temp = doc.data();  
                  temp_collectionObject[doc.id] = temp;   
                });//await la naw loop warning ayat boya aw eslint ai sarom danawa
                set_collectionObject( temp_collectionObject )
                let temp_array = Object.keys(temp_collectionObject)
                /////////////////////sort
                let swap = 0
                for (let i = 0; i < temp_array.length; i++) {
                  for (let j = 0; j < temp_array.length; j++) {
                    if(temp_collectionObject[temp_array[i]].time > temp_collectionObject[temp_array[j]].time){
                      swap = temp_array[i] 
                      temp_array[i]  = temp_array[j] 
                      temp_array[j] = swap
                    }
                  } 
              }
               /////////////////////
                set_collectionArray(temp_array)
                set_given_collectionArray( temp_array.length === 0 ? [] : temp_array ) 
                
            }).catch( (error) => {    console.log("Error getting document:", error);    });
        
          }
      getDatas()
    }, [])

    
  function handleSearch(value){
    set_search(value);
    let temp = []
    for(let i=0; i<collectionArray.length; i++){
      console.log(collectionObject[collectionArray[i]].phone )
      if(collectionObject[collectionArray[i]].phone === value+""){
        temp.push([collectionArray[i]])
      }
    }
    if(temp.length > 0){
      set_given_collectionArray(temp)
    }
  }

  const [sort, set_sort] = useState('Latest');
  const handleSort = (event) => {
    set_sort(event.target.value);

    console.log(event.target.value)
    
    if(event.target.value === "Latest"){
      set_given_collectionArray( collectionArray.reverse() || []) 
    }else{
      set_given_collectionArray(collectionArray.reverse() || []);
    }
  };
////////////////////////////////////////////////
 
    return (
        <nav>

             
            <div id="nav-left">
                <div id="nav-left-stuff">

                    
                    <div id="logo-container">
                        <Link to='/'>
                            <img id='logo' onClick={closeMobileMenu} src={logo} alt='Logo'/>
                        </Link>
                    </div>
              
                </div> 
            </div>

            <div id="nav-top">


                <div id='nav-top-left' >
                   
                </div>
              
    

                <input id='check-button' type='checkBox'/>  {/*display none akre u qat visiable nakreto */}
                <label id='check-label' htmlFor='check-button'>  {/*kate visiable abe ka shashaka bchuk buyo*/}
                    <FontAwesomeIcon icon={faBars} />  
                </label>
            
            
                <label id='mobile-menu' htmlFor='check-button'>   {/*  element'akani xwaro ba haman shewai mobile-menu ka htmlFor bo da na nren ka aman nakren ba label */}
                    {user !== null ? (       <Link to='/cards'  className='mobile-menu-element' onClick={closeMobileMenu}>Cards</Link>   )  : '' }
                    {user !== null ? (       <Link to='/transactions' className='mobile-menu-element' onClick={closeMobileMenu}>Transactions</Link>   )  : '' }
                    {user !== null ? (       <Link to='/history'   className='mobile-menu-element' onClick={closeMobileMenu}>History</Link>   )  : '' }

                    {user !== null ? (      <div id='logout' className='mobile-menu-element'>Logout</div>      )  : '' }     
                

                    {user === null ? (  <Link to='/login' className='mobile-menu-element' onClick={closeMobileMenu}> Login</Link>   )  : '' }
                    {user === null ? (  <Link to='/signUp' className='mobile-menu-element' onClick={closeMobileMenu}>Sign Up</Link>  )  : '' }    
                </label>
            
                <div id='nav-top-right'>

            
                    {user !== null ? (       <Link to='/cards' className='nav-element' onClick={closeMobileMenu}>Cards</Link>   )  : '' }
                    {user !== null ? (       <Link to='/transactions'  className='nav-element'  >Transactions</Link>   )  : '' }
                    {user !== null ? (       <Link to='/history'  className='nav-element'  >History</Link>   )  : '' }
                    <div></div>

                    <div id='nav-top-right-account'>
                        {user === null ? (  <Link to='/Login' className='nav-element'  > Login </Link>   )  : '' }
                        {user === null ? (  <Link to='/SignUp' className='nav-element'  >Sign Up</Link>  )  : '' }
                        
                    
                        {user !== null ? 
                            <a id='nav-top-right-logout' onClick={logout}>Logout</a>
                          : '' }
                    </div>
                
                </div>
            </div>


      

        </nav>
    )
}

export default Nav


/*


Run the following command to install the base packages:

npm i -S @fortawesome/fontawesome-svg-core @fortawesome/react-fontawesome

These will install the solid icons:

# solid icons
npm i -S @fortawesome/free-solid-svg-icons



*/