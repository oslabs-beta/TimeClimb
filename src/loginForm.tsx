import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store.tsx";
import { selectUser, setAccessKeyID, setSecretAccessKey } from "./reducers/userSlice";


function LoginForm() {

// access key id, secret access key, region- dropdown
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector(selectUser)

    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault();
        //functionality to check if access keys are valid
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

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default LoginForm;