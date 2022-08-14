import axios, { AxiosError, AxiosResponse } from 'axios'
import next from 'next';

const url: string = process.env.NEXT_PUBLIC_URL as string

export async function random() {
    return await axios.get(`${url}/vocabulary/random`).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}

export async function findAllPagination(page: number, size: number, search: string) {
    return await axios.get(`${url}/vocabulary/findAllPagination/${page}/${size}?search=${search}`).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}

export async function insert(formData: FormData) {
    return await axios.post(`${url}/vocabulary/create/`, formData).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}

export async function update(id: number, formData: FormData) {
    return await axios.put(`${url}/vocabulary/updateById/${id}`, formData).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}

export async function deleteById(id: number) {
    return await axios.delete(`${url}/vocabulary/deleteById/${id}`).then((res: AxiosResponse<any, any>)=> res).catch((err: AxiosError) => err.response)
}



