import { GetStaticPropsContext, GetStaticPropsResult, NextPage } from "next";
import { useRouter } from 'next/router'
import { useEffect, useState } from "react";
import * as vocabularyService from "../service/vocabularyService"
import * as logService from "../service/logService"
import * as toastService from '../lib/toast'
import { logDetail } from "../model/logType";
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons'
import {Howl, Howler} from 'howler';

interface DataList {
    id: number;
    name: string;
    type_id: number;
    abbreviation: string;
    meaning: string;
    sound: string;
    create_at: Date;
    updated_at: Date;
}


const Vocabulary: NextPage<{dataList: DataList[]}> = ({dataList}) => {
    const [total, setTotal] = useState(dataList.length) 
    const [countTotal, setCountTotal] = useState(0) 
    const [dataVocabularyList, setDataVocabularyList] = useState(dataList)
    const [ischeckCount, setIscheckCount] = useState(false)
    const [round, setRound] = useState(1)
    const [MeaningList, setMeaningList] = useState<DataList[]>(dataList);
    const [Meaning, setMeaning] = useState<DataList>();
    const [MeaningSound, setMeaningSound] = useState<Howl>();
    const [correct, setCorrect] = useState(0);
    const [incorrect, setIncorrect] = useState(0);
    const [logDetailList, setLogDetailList] = useState<logDetail[]>([])
    
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    useEffect(() => {
        randomMeaning()
        getLogHistory()
    },[dataVocabularyList])


    async function randomMeaning() {
        console.log("randomMeaning")
        console.log(MeaningList)
        let index = Math.floor(Math.random()*MeaningList.length)
        console.log(index)
        let item = MeaningList[index];
        let filter = MeaningList.filter(value => value.id != item.id)
        console.log(filter)
        setMeaning(item)
        setMeaningList(filter)
        let sound = new Howl({
            src: [`http://localhost:8080/sound/${item?.sound}`]
          });
        sound.play()
        setMeaningSound(sound)
    }

    async function clickCard(value: DataList): Promise<any> {
        let el = document.getElementById("card"+ value.id)
        let count = countTotal + 1;
        let logDetail: logDetail = {
            vocabulary_id: Meaning!.id,
            correct: 0,
            incorrect: 0
        }
        if (Meaning?.id == value.id) {
            setCorrect(correct + 1)
            el!.style.display = "none"
            logDetail.correct = 1
            toastService.success("Answer","Correct")
        } else {
            setIncorrect(incorrect + 1)
            logDetail.incorrect = 1
            toastService.error("Answer","Incorrect")
        }

        logDetailList.push(logDetail)
        console.log(logDetailList)
        randomMeaning()
        setCountTotal(count)
        if (total == count) {
            await logService.createLogDetail(logDetailList)
            handleShow()
        }
        
    }

    async function onAudioPlay() {
        MeaningSound?.play()
    }

    async function getDataList() {
        const res: DataList[] = await vocabularyService.random().then((value) => value?.data)
        res.forEach(value => {
            let el = document.getElementById("card" + value.id)
            if (el != null) {
                el!.style.display = "block"
            }
        })
        setMeaningList(res)
        setDataVocabularyList(res)
        setTotal(res.length)
        setCorrect(0)
        setIncorrect(0)
        setCountTotal(0)
        setIscheckCount(false)
    }

    async function onSummary() {
        console.log("ok")
        setIscheckCount(true)
        setLogDetailList([])
        handleClose()
    }

    async function getLogHistory() {
        let history = await logService.getLogHistory()
        let data = history?.data
        console.log(data.length)
        setRound(data.length + 1)
    }

    useEffect(() => {
        getDataList()
    }, [ischeckCount])
    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-center">
                <h1>Vocabulary</h1>
            </div>
            <div className="d-flex justify-content-between">
                <div>
                    <div className="row">
                        <div className="col-auto" style={{paddingTop: "15px"}}>
                            Correct :  
                        </div>
                        <div className="col text-end">
                            <label style={{fontSize: '30px'}}>{correct}</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-auto" style={{paddingTop: "15px"}}>
                            Incorrect :  
                        </div>
                        <div className="col text-end">
                            <label style={{fontSize: '30px'}}>{incorrect}</label>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="row">
                        <div className="col-auto" style={{paddingTop: "15px"}}>
                            Round :  
                        </div>
                        <div className="col text-end">
                            <label style={{fontSize: '30px'}}>{round}</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-auto" style={{paddingTop: "3px"}}>
                            Total :  
                        </div>
                        <div className="col text-end" style={{fontSize: '20px'}}>
                            {countTotal}/{total} 
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center user-select-none" style={{fontSize: '24px'}}>
                {Meaning?.name} {(Meaning?.abbreviation) ? `(${Meaning.abbreviation})`:""}
                {(Meaning?.name) ?
                    <div style={{paddingLeft: '10px',fontSize: "16px", paddingTop: "6px"}} className="faVolumeHigh" onClick={onAudioPlay}>
                        <FontAwesomeIcon icon={faVolumeHigh}></FontAwesomeIcon>
                    </div>
                : ""}
                
            </div>
            <div className="mt-3">
                <div className="row">
                    {dataVocabularyList.map(value => {
                        // eslint-disable-next-line react/jsx-key
                        return (<div className="col-3 pt-3" key={value.id} style={{height: "111px"}}>
                            <div className="card card-low-shadow" id={"card"+ value.id} style={{height: "95px"}}  onClick={() => {clickCard(value)}}>
                                <div className="card-body">
                                    <div className="text-center user-select-none" style={{paddingTop: '20px',paddingBottom: '20px'}}>
                                    {value.meaning} 
                                    </div> 
                                </div>
                            </div>
                        </div>)
                    })}

                    {(dataVocabularyList.length <= 0)? 
                        <div className="d-flex justify-content-center">
                            <h4>ไม่มีข้อมูล</h4>
                        </div>
                     :""
                    }
                </div>
            </div>

            <Modal show={show}>
                <Modal.Title className="text-center mt-3" style={{fontSize: "29px"}}>Summary</Modal.Title>

                <div className="container" style={{paddingLeft: "9%", paddingRight: "9%", fontSize: "20px"}}>
                    <div className="d-flex justify-content-between">
                        <div>
                            <span>Round :</span>
                        </div>
                        <div>
                            <span>{round}</span>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between">
                        <div>
                            <span>Correct Total :</span>
                        </div>
                        <div>
                            <span>{correct}</span>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between">
                        <div>
                            <span>Incorrect Total :</span>
                        </div>
                        <div>
                            <span>{incorrect}</span>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between">
                        <div>
                            <span>Total :</span>
                        </div>
                        <div>
                            <span>{total}</span>
                        </div>
                    </div>
                </div>
                
                <div className="d-flex justify-content-center mt-3 mb-3">
                    <Button variant="success" style={{width: "95px"}} onClick={onSummary}>
                        Ok
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export async function getStaticProps(contexet: GetStaticPropsContext): Promise<GetStaticPropsResult<any>> {
    const res = await vocabularyService.random();
    const data: any[] = res?.data
    return {
        props: {
            dataList: data
        }
    }
}

export default Vocabulary;

