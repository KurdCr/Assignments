import React,{useState,useEffect} from 'react'
import firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database';
import {Link} from 'react-router-dom'
import { Redirect } from 'react-router';

import './form.scss'
 
import Loading from '../others/Loading'

const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto ']
const defaultPhotoUrl = 'https://firebasestorage.googleapis.com/v0/b/baleno-c9fc8.appspot.com/o/defaults%2Fdefault_profile_photo.png?alt=media&token=fbc87848-94ab-434b-880c-4619ae35bc62'

function Signup(props) { 
    
    const [name, setName] = useState('')  
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
      
        if(props.user === null){
            document.getElementById('form').style.gridTemplate = ' 1fr 1fr/ 1fr'
            document.getElementById('inputs-container').style.gridTemplate = ' 1fr 1fr 1fr/ 1fr'
        }
    }, [props.user])


         
    function signup(e){ /////////////////////////////////ka network nabe awa error la chrome adre shewazek bkam ka bzanre network nya
        e.preventDefault();

        if(name.length < 3){
            props.toast.warning('Name: Name Should Be Greater Or Equal to 3 Characters',{ position: "bottom-right",  autoClose: 2000 } );
            return;
        }
        else if(name.length > 9){ 
            props.toast.warning('Name: Name Should Be Less Than 10 Characters',{ position: "bottom-right",  autoClose: 2000 } );
            return;  
        }

        firebase.database().ref(`allNameAndUIDs/`).once('value').then( (snapshot) => {
            if(snapshot.exists()){    }else{    }
            let allNamesObject =    snapshot.val()  || {}
            allNamesObject = allNamesObject === null ? {} : allNamesObject
            //''allNamesObjectwhen'' empty >> {}  >> {balen: "r84KEjgXhFNVw29sDdrrSM3d2Ll2", brwa: "nvorOLXM86M8cz2F4lwbqGMa9Lf1"} //////////// ''allNamesArray'' when empty >> []  >> ["balen", "brwa"]
            let allNamesArray = Object.keys(allNamesObject) //Object.key()'akan nawakann >> wa Object.values() value akan aheneto ka lam 7alataman UID yakana
                
            if(!allNamesArray.includes(name.toLowerCase())){
                firebase.auth().createUserWithEmailAndPassword(email, password).then( cred =>{

                    sendEmailVerification() 
                    cred.user.updateProfile({
                        displayName: name.toLowerCase()
                    }).then( async () => {
                        let updates = {}

                        updates[name.toLowerCase()] = cred.user.uid;   
                        firebase.database().ref('allNameAndUIDs/').update(updates); 

                        setName('')
                        setPassword('')
                        setEmail('')
                        props.toast.success("Signed Up Succesfully",{ position: "bottom-right",  autoClose: 2000 } );
                        })       
                } ).catch((error) => { 
                        props.toast.error(error.message,{ position: "bottom-right",  autoClose: 2000 } );//createUserWithEmailAndPassword failed
                    })
            }else{
                props.toast.error('Name: Name isn\'t unique',{ position: "bottom-right",  autoClose: 2000 } );
            }
            
        } )      
    }
 
    function sendEmailVerification(){
        firebase.auth().currentUser.sendEmailVerification().then( () => {
            props.toast.success("Email Verification Sent Succesfully",{ position: "bottom-right",  autoClose: 2000 } );
        }).catch(function(error) {
            props.toast.error(error.message,{ position: "bottom-right",  autoClose: 2000 } );
        });
    }
   
    function setNameFunction(e){
        const word = e.target.value, regex = /\w/g 
        
        if(word.length > 9){     return;    }
        for(let i=0; i<word.length ; i++ )   {    if(regex.test(word) === false){   return;    }      }
        setName(word);
    }


    if(props.user === 'notNull'){ 
        return (<Loading  />)
    }else if(props.user !== null){ 
        return (<Redirect  to="/cards" />)
    }else if(props.user === null){
        return (
          
                <form  onSubmit={ (e) => signup(e)}   id="form">

                    <div id="inputs-container">
                    <div  className="input-div">  
                            <input className="form-input" id="email" value={email} onChange={ (e) => setEmail(e.target.value) } type="email" placeholder=" " required autoComplete='off'  name='new-email' />
                            <div className="form-text">Email</div>
                        </div> 

                        <div className="input-div">   
                            <input className="form-input" id="name" value={name} onChange={ (e) => setNameFunction(e) } type="text" placeholder=" " required autoComplete='off'  name='new-name' />
                            <div className="form-text">Name</div>  {/*  form-div texte akaya ka la regai form-label awa ajulet  */}
                            <div className="form-hint">name should be over 3 characters and less than 10 characters</div>
                        </div> 
                       
                        <div  className="input-div"  >  
                            <input className="form-input" id="password" value={password} onChange={ (e) => setPassword(e.target.value) } type="password" placeholder=" " required autoComplete='off'  name='new-password' />                          
                            <div className="form-text">Password</div>
                            <div className="form-hint">password's should be over 6 characters</div>
                        </div> 

                        <div id='input-result'></div>
   
                    </div>   

                    <div id='buttons-container'>
                        <div id='links'>
                            <Link to='/login' className='form-submit-link' >
                                Login
                            </Link>
                        </div>
                        <input type="submit" id="submit" value='Sign Up'  />
                    </div>
                    
                </form>
          
        )
    }else{
        return(    <Redirect    to={{    pathname: "/404",    state: { from: 'Profile',  error: 'UNKNOWN' }    }}    />    )
    }
}

export default Signup
