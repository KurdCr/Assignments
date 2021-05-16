import React,{useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import firebase from 'firebase/app'
import 'firebase/auth';

//import './components/styles/base.scss'
import CardsContainer from './Components/Cards/CardsContainer';
import CardPage from './Components/Cards/CardPage';
import CreateCardPage from './Components/Cards/CreateCardPage';
import Transactions from './Components/Transactions/Transactions';
import Nav from './Components/Nav/Nav';
import History from './Components/History/History';
import Login from './Components/login-signUp/Login'
import SignUp from './Components/login-signUp/Signup'
import Forgot from './Components/login-signUp/Forgot'
import './Components/styles/base.scss'

import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import Loading from './Components/others/Loading'
import GenericNotFound from './Components/others/GenericNotFound'


const notify = () => toast("message"); 


toast.configure()
function App() {

  const [user, setUser] = useState('notNull')//authListener needes a little time to request server and return user or null
  

  function authListener(){   //aw error 403 ya ba hoi amoya chana hawlm ya bom chak nakra
    firebase.auth().onAuthStateChanged( (firebaseUSer) => {
      if(firebaseUSer){    console.log('user logged in'); 
       setUser(firebaseUSer);

      } //agar null nabe awa if aka ish aka //console.log('already logged in');
      else{ console.log('user not logged in'); setUser(null)  }//console.log('User isn\'t logged in');
    })
  }

  
 
  useEffect( ()=>{ 
    authListener()
    

  },[])







  

  // import Loading from './Components/others/Loading'
  // import FallBackPage_offline from './Components/others/FallBackPage_offline'
  
  

 

  return (
    <Router>
  
      <div className="App">
        <Nav user={user} toast={toast}  ></Nav>

        {/* <Hint user={user}/> */}
          
            <Switch>
              <Route path='/' exact component={() => <Login user={user} toast={toast} />}/>
              <Route path='/cards' exact component={() => <CardsContainer user={user} toast={toast}   />}/>
              <Route path='/transactions' exact component={() => <Transactions user={user} toast={toast} />}/>
              <Route path='/history' exact component={() => <History user={user} toast={toast} />}/>
              <Route path='/cards/create' exact component={() => <CreateCardPage user={user} toast={toast} />}/>
              <Route path='/cards/:id' exact component={() => <CardPage user={user} toast={toast} />}/>
              <Route path='/login' exact component={() => <Login user={user} toast={toast} />}/>
              <Route path='/signUp' exact component={() => <SignUp user={user} toast={toast} />}/>
              <Route path='/forgot' exact component={() => <Forgot user={user} toast={toast} />}/>

              {/* <Route path='/Profile' exact component={() => <Profile user={user}/>}/>
              <Route path='/Profile/:user' exact component={() => <UserProfile user={user}/>}/> */}

        
              <Route path="*"  render={(props) => <GenericNotFound {...props}/>}/>
              
            </Switch>
         
      </div>
    </Router>
  );
}


export default App;
