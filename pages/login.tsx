import { AxiosError, AxiosResponse } from 'axios'
import type { GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next'
import { FormEvent, useEffect } from 'react'
import * as toast from '../lib/toast'
import * as authenticationService from '../service/authentication'
import { useRouter } from 'next/router'

const Login: NextPage<any> = () => {
    const router = useRouter()

    const onsubmit = async (event: FormEvent<any>) => {
        event.preventDefault()
        const target: any = event.target
        const result = (await authenticationService.login(target.username.value,target.password.value)) as AxiosResponse<any,any>
        console.log(result)
        if (result.status == 200) {
            localStorage.setItem("accessToken", result.data.accessToken)
            localStorage.setItem("refreshToken", result.data.refreshToken)
            router.push("/vocabulary") 
            toast.success(`login Success`) 
        } else if (result.status == 400) {
            const errors: any[] = result.data.errors
            let errorMsg: string = ""
            errors.forEach(value => {
                errorMsg += `${value.param} ${value.msg} \n`
            })
            toast.error(errorMsg)
        } else { 
            toast.error(result.data.message)
        }
    }

    return (
        <div className="container mt-5" style={{width: "697px"}}>
        <div className="card" style={{height: "309px"}}>
            <div className="card-body">
                <div className='container'>
                    <h1 style={{color: "#6a6a6a"}}>Vocabulary</h1>
                    <form onSubmit={onsubmit}>
                        <div className='row'>
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input type="text" name='username' className="form-control"/>
                            </div>
                        </div>
                        <div className='row'>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" name='password' className="form-control" autoComplete={"off"}/>
                            </div>
                        </div>
                        <div className='d-flex justify-content-center'>
                            <button type="submit" className="btn btn-primary me-2" style={{width: "82.91px"}}>Login</button>
                            <button type="button" className="btn btn-secondary">Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
    )
}

export async function getStaticProps(contexet: GetStaticPropsContext): Promise<GetStaticPropsResult<any>> {
    console.log(process.env.NEXT_PUBLIC_URL)
    return {
        props: {
        }
    }
}

export default Login
