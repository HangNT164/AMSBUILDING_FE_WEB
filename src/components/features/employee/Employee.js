import { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import API, { BASE_URL } from '../../../lib/API';
import Item from "./Item";
import ModalAdd from "./ModalAdd";
import Search from "./Search";
import style from './employee.module.css'
import ModalMessage from '../modal/ModalMessage';
import Axios from 'axios';
import fileDownload from 'js-file-download';

export default function Employee() {
    const [show, setShow] = useState(false);
    const [data, setData] = useState();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [activePage, setActivePage] = useState(1);
    let [name, setName] = useState("");
    let [identifyCard, setIdentifyCard] = useState("");
    const [phone, setPhone] = useState("");
    const [positionId, setPositionId] = useState(-1);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const handleCloseMessage = () => {
        setShowMessage(false)
    }
    const handleShowMessage = () => {
        setShowMessage(true)
    }
    const handleMessage = (text) => {
        setMessage(text)
    }

    useEffect(() => {
        search()
        window.scrollTo(0, 0)
    }, [])
    useEffect(() => {
        search()
    }, [activePage])
    let search = async () => {
        let path = `/manager-service/employee/search?pageNo=${activePage - 1}&name=${name}&phoneNumber=${phone}&identifyCard=${identifyCard}&positionId=${positionId}`;
        let resp = await API.authorizedJSONGET(path);
        if (resp.ok) {
            let response = await resp.json();
            setData(response);
        }

    }

    const download = async (filename) => {
        try {
            let url = `${BASE_URL}/mem-ber/employee/export?name=${name}&identifyCard=${identifyCard}&positionId=${positionId}&phoneNumber=${phone}`
            await Axios.get(url, {
                responseType: 'blob',
            }).then(res => {
                fileDownload(res.data, filename);
            }).catch(err => {
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handlePositionId = (id) => {
        setPositionId(id)
    }
    const roleId = localStorage.getItem("roleId");
    return <>
        <div className="container-fluid">
            <h4 style={{ marginBottom: 20, marginTop: 20 }}>Nhân viên</h4>
            <div className={style.wrapContent}>
                <div className={style.wrapSearch}>
                    <input
                        placeholder="Tên nhân viên"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className={style.ipSearch}
                    />
                    <input
                        placeholder="Số điện thoại"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className={style.ipSearch}
                    />
                    <input
                        placeholder="Số CCCD"
                        value={identifyCard}
                        onChange={e => setIdentifyCard(e.target.value)}
                        className={style.ipSearch}
                    />
                    <Search positionId={positionId} handlePositionId={handlePositionId} />
                    <button onClick={() => {
                        search()
                        setActivePage(1)
                    }} className={style.btnSearch}><svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24">
                            <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                        </svg></button>

                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 10 }}>
                    {roleId == 1 && <div>
                        <button className={style.btnAdd} onClick={handleShow} style={{ marginRight: 20 }}>Thêm Nhân Viên</button>
                    </div>}
                    <button className={style.btnAdd}
                        type="button"
                        onClick={() => download("Employee.csv")}
                    >Tải excel</button>
                </div>
                <div className="main__table">
                    <table>
                        <tr>
                            <th>STT</th>
                            <th>Tên</th>
                            <th>Giới tính</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Email</th>
                            <th>Vị trí</th>
                            <th>Chức năng</th>

                        </tr>
                        {data?.totalElement > 0 ?
                            data?.data?.map((item, idx) => {
                                return (
                                    <Item data={item} key={idx} index={parseInt(5 * (activePage - 1) + idx + 1)} search={search} />
                                )
                            }) :
                            <>
                                <tbody >
                                    <tr >
                                        <td colSpan="8">Không có dữ liệu</td>
                                    </tr>
                                </tbody>
                            </>
                        }
                    </table>
                </div>
                {data?.totalElement > 0 ?
                    <div className="wrapper-paginate">
                        <Pagination
                            activePage={activePage}
                            itemsCountPerPage={5}
                            totalItemsCount={parseInt(data?.totalElement)}
                            pageRangeDisplayed={3}
                            onChange={(item) => {
                                setActivePage(item)
                            }}
                        />
                    </div> : <></>
                }
                <ModalMessage message={message} showMessage={showMessage} handleCloseMessage={handleCloseMessage} search={search} />

                <ModalAdd
                    show={show}
                    handleClose={handleClose}
                    handleShow={handleShow}
                    search={search}
                />
            </div>
        </div>


    </>
}