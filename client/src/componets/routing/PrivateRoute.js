import React from 'react'
import {Route,Redirect} from "react-router-dom"
import PropTypes from 'prop-types'
import { connect } from "react-redux";

const PrivateRoute = ({ component:Component,auth:{isAuthenticated,loading},...rest}) => (

    <Route {...rest}  render={props=>!isAuthenticated && !loading ? (
        <Redirect to="/login" />): (
            <Component {...props} />)} />


)

PrivateRoute.propTypes = {
    auth:PropTypes.object.isRequired,

}

const mapStateToProps=state=>({
    auth:state.auth
})

export default connect(mapStateToProps)(PrivateRoute)































































// import React from 'react'
// import {Route,Redirect} from "react-router-dom"
// import PropTypes from "prop-types"
// import {connect} from "react-redux"
// import auth from '../../reducers/auth'
// // import auth from '../../reducers/auth'
// // import { Router } from 'react-router'

// const PrivateRoute = ({component:Component,auth:{isAuthenticated,loading},...rest})=>(

//         <Route  {...rest} 
//         render={
//             props=> !auth.isAuthenticated && !loading ? (
//                 <Redirect to="/login"/>):(
//                     <Component {...props}/>) }                

//         />

// )
//     // component:Component,
//     // auth:{isAuthenticated,loading},
//     // ...rest
//     //     }) =>(
//     //         <Route 
//     //         {...rest}
//     //         render={props=>
//     //         !isAuthenticated && !loading ? (
//     //             <Redirect to="/login" />
//     //         ):(<Component {...props} />)
//     //     }
//     //     />            
//     //  );




// PrivateRoute.propTypes={
//     auth:PropTypes.object.isRequired
// }


// const mapStateToProps=state=>({
//     auth:state.auth
// })

// export default connect(mapStateToProps)(PrivateRoute);




