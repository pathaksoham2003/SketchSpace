import React from 'react'

const AuthLayout = ({children}) => {
  
  return (
    <div style={{backgroundColor:"white",minHeight:"100vh",minWidth:"100%"}}>
        {children}
    </div>
  )
}

export default AuthLayout