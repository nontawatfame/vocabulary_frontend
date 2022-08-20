import { faArrowsDownToLine, faArrowUpFromBracket, faDownload, faPersonArrowDownToLine, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Howl } from "howler";
import { GetStaticPropsContext, GetStaticPropsResult, NextPage } from "next";
import { ChangeEvent, ChangeEventHandler, CSSProperties, useEffect, useState } from "react";
import { Button, Modal, Pagination } from "react-bootstrap";
import * as typeService from "../../service/typeService"
import * as vocabularyService from "../../service/vocabularyService"
import * as toastService from '../../lib/toast'
import { InitialFormState, InitialPagination, Vocabulary } from "../../model/vocabularyType";
import { TypeWord } from "../../model/typeType";
import { PaginationRes } from "../../model/paginationType";
import PaginationAction from "../../component/PaginationAction";

const initialFormState: InitialFormState  = {
    vocabulary: "",
    type: "0",
    meaning: "",
    sound: ""
}

const initialPagination: InitialPagination = {
    page: 1,
    size: 10,
    total_pages: 0
}

export interface Porps {
    vocabularyPagination: PaginationRes<Vocabulary>,
    typeList: TypeWord[]
}

const url: string = process.env.NEXT_PUBLIC_URL_STATIC as string

const AdminVocabulary: NextPage<Porps> = ({vocabularyPagination, typeList}) => {
    const [vocabularyList, setVocabularyList] = useState<Vocabulary[]>(vocabularyPagination.data);
    const [typeWordList] = useState<TypeWord[]>(typeList);
    const [titleModal, setTitleModal] = useState("");
    const [showModalVocabulary, setShowModalVocabulary] = useState(false);
    const [soundHowl, setSoundHowl] = useState<Howl>();
    const [form, setForm] = useState<InitialFormState>(initialFormState)
    const [typeSubmit, setTypeSubmit] = useState("");
    const [idEdit, setIdEdit] = useState(0);
    const [vocabularyRemove, setVocabularyRemove] = useState<Vocabulary>()
    const [searchText, setSearchText] = useState("")
    const [pagination, setPagination] = useState<InitialPagination>({...initialPagination, total_pages: vocabularyPagination.total_pages})

    useEffect(() => {
        getVocabulary()
    },[pagination.page])

    const handleClose = () => setShowModalVocabulary(false);
    const handleShow = (type: string, value: Vocabulary | null) => {
        setTitleModal(type)
        setSoundHowl(undefined)
        setForm(initialFormState)
        setTypeSubmit(type)

        if (type == "Edit") {
            if (value != null) {
                let sound = new Howl({
                    src: [`${url}/sound/${value.sound}`],
                });
                setIdEdit(value.id)
                setSoundHowl(sound)
                setForm({
                    ...form,
                    vocabulary: value.name,
                    type: value.type_id.toString(),
                    meaning: value.meaning,
                })
            }
        }

        setShowModalVocabulary(true)
    };

    const [showModalRemove, setShowModalRemove] = useState(false);
    const handleModalRemoveClose = () => setShowModalRemove(false);
    const handleModalRemoveShow = (vocabulary: Vocabulary) => {
        setVocabularyRemove(vocabulary)
        setShowModalRemove(true)
    };

    const changeSound = (e: ChangeEvent<HTMLInputElement>) => {
        let target = e.target as HTMLInputElement
        if (target?.files != null) {
            if (target?.files?.length > 0) {
                setForm({...form, sound: target?.files[0]})
                let sound = new Howl({
                    src: [URL.createObjectURL(target.files[0])],
                    html5: true,
                });
                setSoundHowl(sound)
            } else {
                setSoundHowl(undefined)
            }
        }
    }

    const soundHowlPlay = () => {
        soundHowl?.play()
    }

    const playSound = (soundName: string) => {
        console.log(soundName)
        console.log(`${url}/sound/${soundName}`)
        let date = new Date()
        let sound = new Howl({
            src: [`${url}/sound/${soundName}?v=${date.toISOString()}`],
        });
        sound.play()
    }

    const getVocabulary = async () => {
      let res = await vocabularyService.findAllPagination(pagination.page, pagination.size, searchText)
      if (res?.status == 200) {
        let data: PaginationRes<Vocabulary> = res.data
        setPagination({...pagination,total_pages: data.total_pages})
        setVocabularyList(data.data)
      }
    }

    const saveVocabulary = async () => {
        console.log(form)
        if (validateForm()) {
            return false
        }
        let formData = new FormData()
        formData.append("name", form.vocabulary)
        formData.append("type_id", form.type)
        formData.append("meaning", form.meaning)
        formData.append("sound", form.sound)
        let res;
        if (typeSubmit == "Add") {
            res = await vocabularyService.insert(formData);
        } else if (typeSubmit == "Edit") {
            res = await vocabularyService.update(idEdit, formData);
        }
        if (res?.status == 200) {
            getVocabulary()
            handleClose()
        } else if (res?.status == 405) {
            toastService.error("Error", res.data.errorMessage)
        }
    }
    
    const validateForm = () => {
        if (form.vocabulary == "") {
            toastService.error("Error", `vocabulary field is required`)
            return true
        } 
        
        if (form.type == "0") {
            toastService.error("Error", `type field is required`)
            return true
        } 

        if (form.meaning == "") {
            toastService.error("Error", `meaning field is required`)
            return true
        }

        if (typeSubmit == "Add") {
            if (form.sound == "") {
                toastService.error("Error", `sound field is required`)
                return true
            }
        }
    
        return false
    }

    const confirmDelete = async () => {
        if (vocabularyRemove != undefined) {
            let res = await vocabularyService.deleteById(vocabularyRemove?.id);
            if (res?.status == 200) {
                getVocabulary()
                handleModalRemoveClose()
            }
        }
    }

    const search = async () => {
        console.log(searchText)
        getVocabulary()
    }

    const paginationChange = async (page: number) => {
        setPagination({...pagination, page: page})
    }

    return (
        <div className="container mt-5 sweet-loading">
            <div className="d-flex justify-content-center">
                <h1>Admin Vocabulary</h1>
            </div>
            <div className="d-flex justify-content-between">
                <div className="d-flex">
                    <input className="form-control me-2" type="search" placeholder="Search vocabulary" aria-label="Search" value={searchText} onChange={(e) => setSearchText(e.target.value)}/>
                    <button className="btn btn-primary" type="button" onClick={search}>Search</button>
                </div>
                <div>
                    <button type="button" className="btn btn-success" onClick={() => {handleShow("Add", null)}}>Add</button>
                </div>
            </div>
            <div className="mt-3">
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col" className="text-center" style={{width: "44px"}}>#</th>
                        <th scope="col" className="text-center" style={{width: "304px"}}>vocabulary</th>
                        <th scope="col" className="text-center" style={{width: "105px"}}>word classes</th>
                        <th scope="col" className="text-center">meaning</th>
                        <th scope="col" className="text-center" style={{width: "59px"}}>sound</th>
                        <th scope="col" className="text-center" style={{width: "167px"}}>Handle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vocabularyList.map((value, index) => {
                            return <tr key={value.id}>
                            <td scope="row" className="text-center">{index + ((pagination.page - 1) * pagination.size) + 1}</td>
                            <td className="text-center">
                                <div>
                                    {value.name}
                                    <span className="badge-correct ms-3">{(value.correct != null)? value.correct : 0}</span>
                                    <span className="badge-incorrect ms-1">{(value.incorrect != null)? value.incorrect : 0}</span>
                                </div>
                            </td>
                            <td className="text-center">({value.abbreviation})</td>
                            <td className="text-center">{value.meaning}</td>
                            <td className="text-center">
                                <div style={{fontSize: "16px", paddingTop: "6px"}} className="faVolumeHigh" onClick={() => playSound(value.sound)}>
                                    <FontAwesomeIcon icon={faVolumeHigh}></FontAwesomeIcon>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex justify-content-end">
                                    <button type="button" className="btn btn-primary me-1"onClick={() => {handleShow("Edit", value)}}>edit</button>
                                    <button type="button" className="btn btn-danger" onClick={() => handleModalRemoveShow(value)}>delete</button>
                                </div>
                            </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>

            {(vocabularyList.length <= 0)? 
                <div className="d-flex justify-content-center mb-3">
                    <h5>ไม่มีข้อมูล</h5>
                </div>
                :""
            }

            {(pagination.size > 0) ? 
                <div className="d-flex justify-content-center">
                    <PaginationAction totalPages={pagination.total_pages} activeNumber={pagination.page} onChange={paginationChange}></PaginationAction>
                </div>
            : ""
            }
            
            

            <Modal show={showModalVocabulary} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{titleModal} vocabulary</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">
                                Vocabulary
                            </label>
                            <input type="text" className="form-control" id="vocabulary" value={form?.vocabulary} onChange={(e) => setForm({...form, vocabulary: e.target.value})} placeholder="Vocabulary"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Word classes</label>
                            <select className="form-select" 
                            aria-label="Default select example" 
                            id="type" 
                            placeholder="Word classes" 
                            value={form?.type} 
                            onChange={(e) => setForm({...form, type: e.target.value})}>
                                <option  value="0">Select word classes</option>
                                {typeWordList.map(value => {
                                    return <option key={value.id} value={value.id}>{value.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Meaning</label>
                            <input type="text" className="form-control" id="meaning" placeholder="Meaning" value={form?.meaning}  onChange={(e) => setForm({...form, meaning: e.target.value})}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label user-select-none">Sound
                                {(soundHowl != null)? 
                                    <div style={{fontSize: "16px", display: "inline-block", marginLeft: "8px"}} className="faVolumeHigh" onClick={soundHowlPlay}>
                                        <FontAwesomeIcon icon={faVolumeHigh}></FontAwesomeIcon>
                                    </div>
                                : ""}  
                            </label>
                            <input className="form-control" type="file" id="sound" onChange={changeSound}/>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={saveVocabulary}>
                        Save
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModalRemove} onHide={handleModalRemoveClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Remove vocabulary</Modal.Title>
                </Modal.Header>
                <Modal.Body>Want to delete {vocabularyRemove?.name}?</Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={confirmDelete}>
                    Delete
                </Button>
                <Button variant="secondary" onClick={handleModalRemoveClose}>
                    Cancel
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
} 

export async function getStaticProps(contexet: GetStaticPropsContext): Promise<GetStaticPropsResult<any>> {
    const resVocabulary = await vocabularyService.findAllPagination(1,10,"");
    const resType = await typeService.findAll()
    const dataType: any[] = await resType?.data
    const dataVocabulary: any =  await resVocabulary?.data
    console.log(process.env.NEXT_PUBLIC_URL_STATIC as string)
    return {
        props: {
            vocabularyPagination: dataVocabulary,
            typeList: dataType
        }
    }
}

export default AdminVocabulary;