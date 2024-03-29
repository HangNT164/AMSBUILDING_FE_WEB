import { useEffect, useState } from "react";
import API, { BASE_URL } from "../../../lib/API";
import Item from "./Item";
import ModalAddAddress from "./ModalAddAddress";
import ModalAddCard from "./ModalAddCard";
import Search from "./Search";
import Pagination from 'react-js-pagination';
import ResidentCard from "./resident-card/ResidentCard";
import style from './department.module.css';
import Axios from 'axios';
import fileDownload from 'js-file-download';
export default function Department({ handleRoomName }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [showAdd, setShowAdd] = useState(false);
    let [householderName, setHouseHolderName] = useState("");
    let [roomName, setRoomName] = useState("");
    const [data, setData] = useState()
    let [activePage, setActivePage] = useState(1)
    const handleCloseAdd = () => setShowAdd(false);
    let [accountId, setAccountId] = useState();
    const [isAdd, setIsAdd] = useState(false);
    let handleAdd = () => {
        setIsAdd(!isAdd)
    }
    let handleAccountId = (id) => {
        setAccountId(id)
    }
    useEffect(() => {
        search()
    }, [])
    useEffect(() => {
        search()
    }, [activePage, isAdd])
    let search = async () => {
        let path = `/admin/apartment/search?householderName=${householderName}&roomName=${roomName}&pageNo=${activePage - 1}`;
        let resp = await API.authorizedJSONGET(path);
        if (resp.ok) {
            let response = await resp.json();
            setData(response)
        }
    }
    const download = async (filename) => {
        try {
            let url = `${BASE_URL}/mem-ber/apartment/export`
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

    return <>
        <div className="container-fluid">
            <h4 style={{ marginBottom: 20, marginTop: 20 }}>Căn hộ</h4>
            <div className={style.wrapContent}>
                <div className={style.wrapSearch}>
                    <input
                        placeholder="Số phòng"
                        value={roomName}
                        onChange={e => setRoomName(e.target.value)}
                        className={style.ipSearch}
                    />
                    <input
                        placeholder="Tên chủ hộ"
                        value={householderName}
                        onChange={e => setHouseHolderName(e.target.value)}
                        className={style.ipSearch}
                    />
                    <button
                        onClick={() => {
                            search();
                            setActivePage(1)
                        }}
                        className={style.btnSearch}><svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24">
                            <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                        </svg></button>

                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 10 }}>
                    <button className={style.btnAdd}
                        type="button"
                        onClick={() => download("ApartmentList.csv")}
                        style={{ marginRight: 20 }}
                    >Tải excel</button>
                    <div >
                        <button onClick={handleShow} className={style.btnAdd} style={{ marginRight: 20 }}>Thêm căn hộ</button>
                    </div>
                    <div >
                        <button onClick={() => {
                            setShowAdd(true)
                        }} className={style.btnAdd}>Thêm thẻ căn hộ</button>
                    </div>

                </div>
                <ModalAddAddress
                    show={show}
                    handleClose={handleClose}
                    handleShow={handleShow}
                    search={search}
                />
                <ModalAddCard
                    show={showAdd}
                    handleCloseAdd={handleCloseAdd}
                    search={search}
                    handleAdd={handleAdd}
                />

                <div className="main__table">
                    <table>
                        <tr>
                            <th>Số thứ tự</th>
                            <th>Tòa</th>
                            <th>Số phòng</th>
                            <th>Tên chủ hộ</th>
                            <th>Chức năng</th>

                        </tr>
                        {data?.totalElement > 0 ?
                            data?.data?.map((item, index) => {
                                return (
                                    <Item key={index} search={search} handleAccountId={handleAccountId} data={item} handleRoomName={handleRoomName} index={parseInt(5 * (activePage - 1) + index + 1)} />
                                )
                            })
                            :
                            <>
                                <tbody >
                                    <tr >
                                        <td colSpan="5">Không có dữ liệu</td>
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
                            onChange={(item) => setActivePage(item)}
                        />
                    </div> : <></>
                }

                <div>

                </div>
                {accountId && <ResidentCard accountId={accountId} isAdd={isAdd} />}

            </div>
        </div>

    </>
}