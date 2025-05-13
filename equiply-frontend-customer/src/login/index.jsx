import React from 'react'

const Login = () => {
  return (
    <div>
        <div>
            <h3>Log in</h3>
        </div>
        <div>
            <form>
              <lable>
                Email address
                <input type="text"/>
              </lable>
              <lable>
                Password
                <input type="password"/>
              </lable>
            </form>
        </div>
    </div>
  )
}

export default Login