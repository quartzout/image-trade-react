import {React, useState} from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../Auth/useAuth";


export default function Login(props) {

    const navigate = useNavigate();

    const { fetchUser } = useAuth()



    const [formData, setFormData] = useState({
        email: "",
        displayName: "", 
        confirmPassword: "",
        password: "",
        rememberMe: false,
        description: ""
    })

    const emptyValidationData = {
        global: [],
        displayName: [],
        email: [],
        password: [],
        confirmPassword: [],
        description: []
    }

    const [validationData, setValidationData] = useState(emptyValidationData)

    function onFormChanged(event) {
        setFormData(prevFormData => ({
            ...prevFormData,
            [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value
        }))
    }

    function submit() {
        const {confirmPassword, ...objectToSend} = formData
        if (confirmPassword !== formData.password) {
            setValidationData({
                ...emptyValidationData,
                confirmPassword: ["Passwords do not match"]
            })
            return
        }
        (async () => {
            const response = await fetch(process.env.REACT_APP_API_HOST + "/api/account/register/", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify(objectToSend)
            })
            if (response.ok) {
                fetchUser()
                navigate("/")
            }
            else {
                const content = await response.json(); 
                let newValidationData = structuredClone(emptyValidationData) //если не клонировать, в цикле будут меняться свойства прошлой validationData
                for (const key in content.errors) {
                    const jsKey = key === "" ? "global" : key[0].toLowerCase() + key.slice(1) 
                    newValidationData[jsKey] = content.errors[key]
                }
                
                setValidationData(newValidationData)
            }

        })()
        
    }

    

    return <>

        <div className="row d-flex flex-column justify-content-center align-items-center">
        
            <div className="d-flex flex-column justify-content-center align-items-center">

                <h2 className="mb-4">Регистрация</h2>
        
                <form className="col-3 border rounded-3 p-4">

                    <label for="email" >Почта</label>
                    <input type="text" placeholder="Ваш адрес почты" id="email" name="email" class="form-control" value={formData.email} onChange={onFormChanged}/> <br/>
                    {validationData.email !== [] && <ul>{validationData.email.map(val => <li className="text-danger">{val}</li>)}</ul> }

                    <label for="displayName" >Имя пользователя</label>
                    <input type="text" placeholder="Как вас будут знать" id="displayName" name="displayName" class="form-control" value={formData.displayName} onChange={onFormChanged}/> <br/>
                    {validationData.displayName !== [] && <ul>{validationData.displayName.map(val => <li className="text-danger">{val}</li>)}</ul> }

                    <label for="password">Пароль</label>
                    <input type="password" placeholder="Пароль" id="password" name="password" class="form-control" value={formData.password} onChange={onFormChanged}/><br/>
                    {validationData.password !== [] && <ul>{validationData.password.map(val => <li className="text-danger">{val}</li>)}</ul> }
                
                    <label for="confirmPassword">Подтвердите пароль</label>
                    <input type="confirmPassword" placeholder="Подтвердите пароль" id="confirmPassword" class="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={onFormChanged}/><br/>
                    {validationData.confirmPassword !== [] && <ul>{validationData.confirmPassword.map(val => <li className="text-danger">{val}</li>)}</ul> }

                    <label for="description" >Описание</label>
                    <textarea type="description" placeholder="Информация о вас (необязательно)" rows={5} id="description" class="form-control" name="description" value={formData.description} onChange={onFormChanged}/> <br/>
                    {validationData.description !== [] && <ul>{validationData.description.map(val => <li className="text-danger">{val}</li>)}</ul> }
        
                    <input type="checkbox" id="rememberMe" name="rememberMe" class="form-check-input" checked={formData.rememberMe} onChange={onFormChanged}/>
                    <label className="ms-2" for="rememberMe">Запомнить</label>

                    {validationData.global !== [] && <ul className="my-4">{validationData.global.map(val => <li className="text-danger">{val}</li>)}</ul> }
        
                    <button type="button" className="btn btn-primary" onClick={submit}>Зарегестрироваться</button>  
                </form>

                <p className="mt-4"> Или <Link  className="btn btn-primary my-3 ms-2" to="/register">Войти</Link> </p>

            </div>
        </div>
    </>
}