import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Howl } from "howler";
import { GetStaticPropsContext, GetStaticPropsResult, NextPage } from "next";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { Button, Modal, Pagination } from "react-bootstrap";
import * as typeService from "../../service/typeService"

export interface TypeWord {
    id: number;
    name: string;
    create_at: Date;
    updated_at: Date;
    abbreviation: string;
}

const AdminVocabulary: NextPage<{typeList: TypeWord[]}> = ({typeList}) => {
    const [typeWordList] = useState<TypeWord[]>(typeList);
    const [titleModal, setTitleModal] = useState("");
    const [showModalVocabulary, setShowModalVocabulary] = useState(false);
    const [soundHowl, setSoundHowl] = useState<Howl>();
    const handleClose = () => setShowModalVocabulary(false);
    const handleShow = (type: string) => {
        setTitleModal(type)
        setSoundHowl(undefined)
        setShowModalVocabulary(true)
    };

    const [showModalRemove, setShowModalRemove] = useState(false);
    const handleModalRemoveClose = () => setShowModalRemove(false);
    const handleModalRemoveShow = () => setShowModalRemove(true);

    const changeSound = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target)        
        let target = e.target as HTMLInputElement
        console.log(target.files)
        if (target?.files != null) {
            if (target?.files?.length > 0) {
                console.log(target?.files[0])
                console.log(URL.createObjectURL(target.files[0]))
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

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-center">
                <h1>Admin Vocabulary</h1>
            </div>
            <div className="d-flex justify-content-between">
                <div className="d-flex">
                    <input className="form-control me-2" type="search" placeholder="Search vocabulary" aria-label="Search"/>
                    <button className="btn btn-primary" type="submit">Search</button>
                </div>
                <div>
                    <button type="button" className="btn btn-success" onClick={() => {handleShow("Add")}}>Add</button>
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
                        <tr>
                            <td scope="row" className="text-center">1</td>
                            <td className="text-center">dog</td>
                            <td className="text-center">(n.)</td>
                            <td className="text-center">สุนัท</td>
                            <td className="text-center">
                                <div style={{fontSize: "16px", paddingTop: "6px"}} className="faVolumeHigh">
                                    <FontAwesomeIcon icon={faVolumeHigh}></FontAwesomeIcon>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex justify-content-end">
                                    <button type="button" className="btn btn-primary me-1"onClick={() => {handleShow("Edit")}}>edit</button>
                                    <button type="button" className="btn btn-danger" onClick={handleModalRemoveShow}>delete</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-center">
                <Pagination size="sm">
                    <Pagination.First />
                    <Pagination.Prev />
                    <Pagination.Item>{1}</Pagination.Item>
                    <Pagination.Item>{10}</Pagination.Item>
                    <Pagination.Item>{11}</Pagination.Item>
                    <Pagination.Item active>{12}</Pagination.Item>
                    <Pagination.Item>{13}</Pagination.Item>
                    <Pagination.Ellipsis />
                    <Pagination.Item >{14}</Pagination.Item>
                    <Pagination.Next />
                    <Pagination.Last />
                </Pagination>
            </div>

            <Modal show={showModalVocabulary} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{titleModal} vocabulary</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Vocabulary</label>
                            <input type="text" className="form-control" id="vocabulary" placeholder="Vocabulary"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Word classes</label>
                            <select className="form-select" aria-label="Default select example" placeholder="Word classes" defaultValue="0">
                                <option  value="0">Select word classes</option>
                                {typeWordList.map(value => {
                                    return <option key={value.id} value={value.id}>{value.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Meaning</label>
                            <input type="text" className="form-control" id="meaning" placeholder="Meaning"/>
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
                    <Button variant="primary" onClick={handleClose}>
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
                <Modal.Body>must remove </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={handleModalRemoveClose}>
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
    const resType = await typeService.findAll()
    const dataType: any[] = resType?.data
    return {
        props: {
            typeList: dataType
        }
    }
}

export default AdminVocabulary;