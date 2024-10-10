import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store.tsx";
import { selectUser, setAccessKeyID, setRegion, setSecretAccessKey } from "./reducers/userSlice";


function LoginForm() {

// access key id, secret access key, region- dropdown
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector(selectUser)

    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault();
        
    }

    return (
        <div>
            This is the Login Page
            <form onSubmit={handleSubmit}>
                <label htmlFor="accessKeyID">Access Key ID</label>
                <input type="text" className="accessKeyID" value={user.accessKeyID} onChange={(e)=> dispatch(setAccessKeyID(e.target.value))}/>
                <br />
                <label htmlFor="secretAccessKey">Secret Access Key</label>
                <input type="text" className="secretAccessKey" value={user.secretAccessKey} onChange={(e)=> dispatch(setSecretAccessKey(e.target.value))}/>
                <br />
                <label htmlFor="region">Region</label>
                <select className="regions" value={user.region} onChange={(e)=> dispatch(setRegion(e.target.value))}> 
                    <option value='option1'>Select one</option>
                    <option value='option2'>option1</option>
                    <option value='option2'>option2</option>
                </select>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default LoginForm;