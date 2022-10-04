import { GetStaticPropsContext, GetStaticPropsResult, NextPage } from "next";
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from "react";
import * as vocabularyService from "../service/vocabularyService"
import * as logService from "../service/logService"
import * as toastService from '../lib/toast'
import { LogData, logDetail, LogDetailData } from "../model/logType";
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons'
import {Howl, Howler} from 'howler';
import dayjs from "dayjs";

interface DataList {
    id: number;
    name: string;
    type_id: number;
    abbreviation: string;
    correct: number;
    incorrect: number;
    meaning: string;
    sound: string;
    create_at: Date;
    updated_at: Date;
}

const urlStatic = process.env.NEXT_PUBLIC_URL_STATIC as string

const Vocabulary: NextPage<{dataList: DataList[]}> = ({dataList}) => {
    const [total, setTotal] = useState(dataList.length) 
    const [countTotal, setCountTotal] = useState(0) 
    const [dataVocabularyList, setDataVocabularyList] = useState(dataList)
    const [ischeckCount, setIscheckCount] = useState(false)
    const [round, setRound] = useState(1)
    const [Meaning, setMeaning] = useState<DataList>();
    const [correct, setCorrect] = useState(0);
    const [incorrect, setIncorrect] = useState(0);
    const [logDetailList, setLogDetailList] = useState<logDetail[]>([])
    const [show, setShow] = useState(false);
    const [showLogDetail, setShowLogDetail] = useState(false);
    const [logDetailListModal, setLogDetailListModal] = useState<LogDetailData[]>([]);
    const [dateModal, setDateModal] = useState<string>();
    const [timeModal, setTimeModal] = useState<string>();
    const MeaningList = useRef<DataList[]>(dataList)
    const isFirst = useRef(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleLogDetailClose = () => setShowLogDetail(false);
    const handleLogDetailShow = () => setShowLogDetail(true);

    useEffect(() => {
        getRandom()
        if (isFirst.current == false) {
            randomMeaning(true)
            getLogHistory()
            isFirst.current = true
        }
    },[])

    const getRandom = async () => {
        let random = await vocabularyService.random()
    }

    useEffect(() => {
        getLogHistory()
    },[dataVocabularyList])

    async function randomMeaning(resume: boolean = false) {
        let index = Math.floor(Math.random()*MeaningList.current.length)
        let item = MeaningList.current[index];
        let filter = MeaningList.current.filter(value => value.id != item.id)
        setMeaning(item)
        MeaningList.current = filter
        let sound = new Howl({
            src: [`${urlStatic}/sound/${item?.sound}`],
            // volume: 0.2
          });

        if (resume == false) {
            sound.play();
        }
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
        randomMeaning()
        setCountTotal(count)
        if (total == count) {
            await logService.createLogDetail(logDetailList)
            handleShow()
        }
    }

    async function onAudioPlay() {
        let sound = new Howl({
            src: [`${urlStatic}/sound/${Meaning?.sound}`],
            // volume: 0.2
          });
        sound.play()
    }

    async function getDataList() {
        const res: DataList[] = await vocabularyService.random().then((value) => value?.data)
        res.forEach(value => {
            let el = document.getElementById("card" + value.id)
            if (el != null) {
                el!.style.display = "block"
            }
        })
        MeaningList.current = res
        setDataVocabularyList(res)
        setTotal(res.length)
        setCorrect(0)
        setIncorrect(0)
        setCountTotal(0)
        randomMeaning()
    }

    async function onSummary() {
        setIscheckCount(true)
        setLogDetailList([])
        getDataList()
        handleClose()
    }

    async function getLogHistory() {
        let history = await logService.getLogHistory()
        let data = history?.data
        setRound(data.length + 1)
    }

    async function openLogDetail() {
        let history = await logService.getLogHistory()
        let log: LogData = history?.data[0]  
        let logDetailRes = await logService.getLogDetailById(log.id) 
        let logDetail : LogDetailData[] = logDetailRes?.data
        let createAtDay =  dayjs(log.create_at).format("DD/MM/YYYY")
        let createAtTime =  dayjs(log.create_at).format("HH:mm:ss")
        setDateModal(createAtDay)
        setTimeModal(createAtTime)
        setLogDetailListModal(logDetail)
        handleLogDetailShow()
    }
   
    async function onAudioPlayModal(logDetail: LogDetailData) {
        let sound = new Howl({
            src: [`${urlStatic}/sound/${logDetail?.sound}`],
            volume: 0.2
          });
        sound.play()
    }

    return (
        <div className="container mt-5 user-select-none">
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
            <div className="d-flex justify-content-center user-select-none" style={{fontSize: '24px', height:"36px"}}>
                {Meaning?.name} {(Meaning?.abbreviation) ? `(${Meaning.abbreviation})`:""}
                {(Meaning?.name) ?
                    <div className="displayInlineBlock">
                        <div className="displayInlineBlock">
                            <div style={{paddingLeft: '10px',fontSize: "16px", paddingTop: "6px"}} className="faVolumeHigh" onClick={onAudioPlay}>
                                <FontAwesomeIcon icon={faVolumeHigh}></FontAwesomeIcon>
                            </div>
                        </div>
                    </div>
                : ""}
            </div>
            <div className="mt-3">
                <div className="row">
                    {dataVocabularyList?.map(value => {
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

                    {(dataVocabularyList?.length <= 0)? 
                        <div className="d-flex justify-content-center">
                            <h4>ไม่มีข้อมูล</h4>
                        </div>
                     :""
                    }
                </div>
            </div>
            
            <Modal show={show} className="user-select-none">
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
                            <span>Total :</span>
                        </div>
                        <div>
                            <span>{total}</span>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <div className="row mt-3" >
                            <div className="col-6 text-center"><span className="sumary-correct">Correct Total</span></div>
                            <div className="col-6 text-center"><span className="sumary-incorrect">Incorrect Total</span></div>
                            <div className="col-6 text-center" style={{fontSize: "64px"}}><span>{correct}</span></div>
                            <div className="col-6 text-center" style={{fontSize: "64px"}}><span>{incorrect}</span></div>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-center mt-3 mb-3">
                    <Button variant="success" style={{width: "95px"}} onClick={onSummary}>
                        Ok
                    </Button>
                    <Button variant="secondary" className="ms-2" style={{width: "131px"}} onClick={openLogDetail}>
                        Log Detail
                    </Button>
                </div>
            </Modal>

            <Modal show={showLogDetail} onHide={handleLogDetailClose} className="log-detail-modal user-select-none">
                <Modal.Title className="text-center mt-3" style={{fontSize: "29px"}}>Log Detail</Modal.Title>
                <div className="container mt-4">
                    <div className="d-flex justify-content-between" style={{borderRadius: "9px", padding: "16px"}}>
                        <div>Round <span className="badge bg-primary ms-2">{round}</span></div>
                        <div>{dateModal} <span className="time-history">{timeModal}</span></div>
                    </div>
                    <table className="table mb-0">
                        <tbody className="">
                            {logDetailListModal.map((logDetail) => {
                                return <tr key={logDetail.id}>
                                    <td style={{width: "160px"}}>{logDetail.name} ({logDetail.abbreviation})
                                    </td>
                                    <td>{logDetail.meaning}</td>
                                    <td className="text-end">
                                        <div style={{paddingLeft: '10px',fontSize: "16px", paddingTop: "6px", display: "inline-block"}} className="faVolumeHigh" onClick={() => onAudioPlayModal(logDetail)}>
                                            <FontAwesomeIcon icon={faVolumeHigh}></FontAwesomeIcon>
                                        </div>
                                    </td>
                                    <td className="text-end" style={{width: "125px"}}>
                                        {(logDetail.correct == 1)? 
                                            <span className="badge-correct-detail ms-2">correct</span>
                                        : 
                                            <span className="badge-incorrect-detail ms-2">incorrect</span>
                                        } 
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-center mt-3 mb-3">
                    <Button variant="success" style={{width: "95px"}} onClick={handleLogDetailClose}>
                        Ok
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export async function getStaticProps(contexet: GetStaticPropsContext): Promise<GetStaticPropsResult<any>> {
    const res = await vocabularyService.random();
    const data: any[] = await res?.data
    // console.log("res")
    // console.log(res)
    const urlServer: string = process.env.URL_API_SERVER as string
    return {
        props: {
            dataList: (data != null) ? data : [],
            // urlServer: res
        }
    }
}

export default Vocabulary;

