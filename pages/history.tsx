import { GetStaticPropsContext, GetStaticPropsResult, NextPage } from "next"
import { useState } from "react";
import { Button, Modal } from "react-bootstrap"
import * as logService from "../service/logService"
import * as dayjsM from "dayjs"
import { LogData, LogDetailData } from "../model/logType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { Howl } from "howler";
const dayjs = dayjsM.default

interface Props {
    resHistoryList: LogData[]
}

const History: NextPage<Props> = ({resHistoryList}) => { 
    const [historyList, setHistoryList] = useState(resHistoryList);
    const [logDetailList, setLogDetailList] = useState<LogDetailData[]>([]);
    const [logModal, setLogModal] = useState<LogData>();
    const [roundModal, setRoundModal] = useState<number>(0);
    const [dateModal, setDateModal] = useState<string>();
    const [timeModal, setTimeModal] = useState<string>();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const openDetail = async (log: LogData, round: number, dayDate: string, time: string) => {
        const res = await logService.getLogDetailById(log.id)
        if (res?.status == 200) {
            console.log(res)
            setDateModal(dayDate)
            setTimeModal(time)
            setLogModal(log)
            setRoundModal(round)
            setLogDetailList(res.data)
            setShow(true)
        }
    }

    const onAudioPlay = async (logDetail: LogDetailData) => {
        let sound = new Howl({
            src: [`http://localhost:8080/sound/${logDetail?.sound}`],
            volume: 0.2
          });
        sound.play()
    }

    return (
        <div className="container mt-5 user-select-none">
            <div className="d-flex justify-content-center">
                <h1>History</h1>
            </div>
            <div className="">
                <table className="table mb-0">
                    <tbody className="">
                        {historyList.map((value, index) => {
                            let createAtDay =  dayjs(value.create_at).format("DD/MM/YYYY")
                            let createAtTime =  dayjs(value.create_at).format("HH:mm:ss")
                            let round = historyList.length - index
                            return  <tr key={value.id}>
                            <td style={{width: "205px"}}>{createAtDay} <span className="time-history">{createAtTime}</span></td>
                            <td>Round<span className="badge bg-primary ms-2">{round}</span></td>
                            <td style={{width: "105px"}}>
                                <span className="badge-correct ms-3">{(value.correct_total != null)? value.correct_total : 0}</span>
                                <span className="badge-incorrect ms-1">{(value.incorrect_total != null)? value.incorrect_total : 0}</span>
                            </td>
                            <td className="text-end">
                                <button type="button" className="btn btn-primary" style={{paddingTop: "1px", paddingBottom: "1px"}} onClick={() => openDetail(value, round, createAtDay, createAtTime)}>Detail</button>
                            </td>
                        </tr>
                        })}
                    </tbody>
                </table>
                {(historyList.length <= 0)? 
                <div className="d-flex justify-content-center mt-5 mb-3">
                    <h5>ไม่มีข้อมูล</h5>
                </div>
                :""
            }
            </div>
            <Modal show={show} onHide={handleClose} className="log-detail-modal user-select-none">
                <Modal.Title className="text-center mt-3" style={{fontSize: "29px"}}>Log Detail</Modal.Title>
                <div className="container mt-4">
                    <div className="d-flex justify-content-between" style={{borderRadius: "9px", padding: "16px"}}>
                        <div>Round <span className="badge bg-primary ms-2">{roundModal}</span></div>
                        <div>{dateModal} <span className="time-history">{timeModal}</span></div>
                    </div>
                    <table className="table mb-0">
                        <tbody className="">
                            {logDetailList.map((logDetail) => {
                                return <tr key={logDetail.id}>
                                    <td style={{width: "160px"}}>{logDetail.name} ({logDetail.abbreviation})
                                    </td>
                                    <td>{logDetail.meaning}</td>
                                    <td className="text-end">
                                        <div style={{paddingLeft: '10px',fontSize: "16px", paddingTop: "6px", display: "inline-block"}} className="faVolumeHigh" onClick={() => onAudioPlay(logDetail)}>
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
                    <Button variant="success" style={{width: "95px"}} onClick={handleClose}>
                        Ok
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export async function getStaticProps(contexet: GetStaticPropsContext): Promise<GetStaticPropsResult<any>> {
    const res = await logService.getLogHistory();
    const data: any[] = res?.data
    return {
        props: {
            resHistoryList: data
        }
    }
}

export default History