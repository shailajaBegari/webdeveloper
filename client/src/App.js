
import './App.css';
import React,{Fragment,useEffect} from "react";
// import {Routes , Route,Router} from 'react-router-dom'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import Navbar from "./componets/layout/Navbar"
import Landing from "./componets/layout/Landing"
import Register from "./componets/auth/Register"
import Login from "./componets/auth/Login";
import Alert from "./componets/layout/Alert";


//REDUX
import {Provider} from "react-redux";
import store from "./store"
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Dashboard from "./componets/dashboard/Dashboard"
import PrivateRoute from "./componets/routing/PrivateRoute"
import  CreateProfile from "./componets/profile-forms/CreateProfile";
import  EditProfile from "./componets/profile-forms/EditProfile";
import  AddExperience from "./componets/profile-forms/AddExperience";
import  AddEducation from "./componets/profile-forms/AddEducation";
import Profiles from "./componets/Profiles/Profiles";
import Profile from "./componets/profile/Profile"

// import auth from"./componets/auth"

if(localStorage.token){
  setAuthToken(localStorage.token);
}



function App() {
  useEffect(()=>{
    store.dispatch(loadUser())
  },[])

  // [] means =>If you want to run an effect and clean it up only once (on mount and unmount), you can pass an empty array ([]) 
  //as a second argument. This tells React that your effect doesn’t depend
  // on any values from props or state, so it never needs to re-run.

  return (

    <Provider store ={store}>
    <Router>
    <Fragment >
          <Navbar/>
          <Route exact path = '/' component={Landing}/>
          <section className='container'>
            <Alert/>
            <Switch>
              <Route exact path="/register" component={Register}/>
              <Route  exact path="/login" component={Login}/> 
              <Route  exact path="/profiles" component={Profiles}/> 
              <Route  exact path="/profile/:id" component={Profile}/> 
            
             <PrivateRoute  exact path='/dashboard' component={Dashboard} /> 
             <PrivateRoute exact path ='/create-profile' component={CreateProfile}/>
              <PrivateRoute exact path ='/edit-profile' component={EditProfile}/>
               <PrivateRoute exact path ='/add-experience' component={AddExperience}/>
               <PrivateRoute exact path ='/add-education' component={AddEducation}/> 

            </Switch>
          </section>
        </Fragment>
      </Router>
      </Provider>



  )
}

export default App;






// const App = () =>

// <Router>
// <Fragment >
//       <Navbar/>
//       <Route exact path = '/' component={Landing}/>
//     </Fragment>
// </Router>
//   // <Fragment>
//   //   <Navbar />
//   //   <Landing />
//   // </Fragment>


// export default App;
