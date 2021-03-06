import React,{Fragment,useState} from 'react'
// import axios from "axios"
import{Link,Redirect} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {login} from "../../actions/auth";
import { setAlert } from '../../actions/alert';

// import {useNavigate} from "react-router-dom"


const Login = ({login,isAuthenticated}) => {
  // const navigate = useNavigate();

    const[formData,setFormData]=useState({
        email:"",
        password:"",
      
        });

        const {email,password}=formData;

        const onChange=e=>setFormData({
            ...formData,[e.target.name]:e.target.value
        })

        const onSubmit=async e=>{
            e.preventDefault();
            login(email,password)
            
           
                // console.log(formData)
                // console.log("SUCCESS COMPLTED")
                // const newUser={
                //     name,
                //     email,
                //     password
                // }  
                // try{
                //     const config={
                //         headers:{
                //             "Content-Type":"application/json"
                //         }
                //     }
                    
                //     const body=JSON.stringify(newUser);
                //     const res=await axios.post("http://localhost:5000/api/auth",body,config)
                //     console.log(res.data);
                // }catch(err){
                //     console.error(err.response.data);
                // }  
            
        }


        //REGISTER IF LOGGED IN

        if(isAuthenticated){
        //  return  navigate("/dashboard" )
        // setAlert("LOGIN SUCCESFULLY COMPLTED","success")
          return  <Redirect to="/dashboard" />

        }


  return (
   <Fragment>
   <h1 className="large text-primary">Sign In</h1>
   <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
   <form className="form"  onSubmit={e=>onSubmit(e)} >

     <div className="form-group">
       <input type="email" placeholder="Email Address" 
       name="email"  value={email} 
       onChange={e=>onChange(e)} required />
     </div>
     <div className="form-group">
       <input
         type="password"
         placeholder="Password"
         name="password"
         minLength="6"
         value={password}
         onChange={e=>onChange(e)}
         required
       />
     </div>
    
     <input type="submit" className="btn btn-primary" value="Login" />
   </form>
   <p className="my-1">
     Don`t have an account? <Link to="/register">Sign Up</Link>
   </p>
   </Fragment>
  )
}





Login.propTypes={
  login:PropTypes.func.isRequired,
  isAuthenticated:PropTypes.bool

}

// const mapStateToProps = (state) => ({
//   isAuthenticated: state.auth.isAuthenticated
// })

const mapStateToProps=state=>({
  isAuthenticated:state.auth.isAuthenticated,
  // auth:state.auth

})


export default connect(mapStateToProps,{login})(Login);


