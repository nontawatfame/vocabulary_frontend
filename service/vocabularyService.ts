import axios, { AxiosError, AxiosResponse } from 'axios'
import next from 'next';

const urlClient: string = process.env.NEXT_PUBLIC_URL as string
const urlServer: string = process.env.URL_API_SERVER as string
const url: string = process.env.NEXT_PUBLIC_URL as string

function getUrl(): string  {
    let urlRes = urlClient
    if (typeof window === 'undefined') {
        urlRes = urlServer
        console.log(urlServer)
    }
    console.log("urlRes")
    console.log(urlRes)
    return urlRes
}

export async function random() {
    console.log(`${getUrl()}/vocabulary/random`)
    console.log("typeof window === 'undefined'")
    console.log(typeof window === 'undefined')

    return await axios.get(`${getUrl()}/vocabulary/random`).then((res: AxiosResponse<any, any>)=> {
        return res
    }).catch((err: AxiosError) => {
        console.log(err)
        return err.response
    })
}

export async function findAllPagination(page: number, size: number, search: string) {
    return await axios.get(`${getUrl()}/vocabulary/findAllPagination/${page}/${size}?search=${search}`).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}

export async function insert(formData: FormData) {
    return await axios.post(`${getUrl()}/vocabulary/create/`, formData).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}

export async function update(id: number, formData: FormData) {
    return await axios.put(`${getUrl()}/vocabulary/updateById/${id}`, formData).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}

export async function deleteById(id: number) {
    return await axios.delete(`${getUrl()}/vocabulary/deleteById/${id}`).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}



