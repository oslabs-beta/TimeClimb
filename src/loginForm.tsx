import React,{useState} from "react";



function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
// access key id, secret access key, region- dropdown

    return (
        <div>
            This is the Login Page
            <form>
                <label htmlFor="username">Username</label>
                <input type="text" className="username" value={username}/>
                <br />
                <label htmlFor="password">Password</label>
                <input type="text" className="password" value={password}/>
            </form>
        </div>
    )
}

export default LoginForm;