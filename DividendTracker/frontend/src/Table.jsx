import React, { useEffect, useState } from "react";
import axios from "axios";
import userIcon from "./images/user.png"
import logOutIcon from "./images/log_out.png"
import StaIcon from "./images/Statistic.png"
import PowerBIReport from "./PowerBi.jsx"
import "./Table.css"
import "./Modal.css"

function CreateTable({setifLogIn, loginData}) {
    const [dividends, setDividends] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    useEffect(() => {
        axios.get("http://127.0.0.1:5001/dividends")
            .then(response => setDividends(response.data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);
    
    return (
        <>
            <div className="header">
                <h1>Dividend Table</h1> 
                <img src={userIcon} className="user_icon" onClick={() => setShowUserMenu(!showUserMenu)} width="50" height="50" />
            </div>
            {/* User menu */}
            {showUserMenu && (<ShowMenu
                loginData={loginData}
                setifLogIn={setifLogIn}
                setShowUserMenu={setShowUserMenu}
                />
            )}
            
            {/* Modal to Add New Row */}
            <ShowInputModal
                showModal={showAddModal}
                setShowModal={setShowAddModal}
                dividends={dividends}
                setDividends={setDividends}
            />

            {/* Table */}
            <CreateTableList
                dividends={dividends}
                setDividends={setDividends}
                setShowAddModal={setShowAddModal}
            />
        </>
    );
}

function CreateTableList({ dividends, setDividends, setShowAddModal}) {
    const [showSaveModal, setShowSavaModal] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null); // Store the row index to delete

    const saveData = () => {
        axios.post("http://127.0.0.1:5001/dividends", { dividends })
            .then(response => {
                console.log("Data saved successfully:", response.data);
                alert("Dividends saved to the database!");
            })
            .catch(error => {
                alert("Error saving data");
                console.error("Error saving data:", error);});
    };

    const DeleteRow = (rowIndex) => {
        setRowToDelete(rowIndex); // Store the row index
        setShowSavaModal(true); // Show confirmation modal
    };

    const ConfirmDelete = () => {
        if (rowToDelete !== null) {
            setDividends(dividends.filter((_, index) => index !== rowToDelete));
            setRowToDelete(null); // Reset the state
        }
        setShowSavaModal(false);
    };

    return (
        <>
            <ShowConfirmModal
                showModal={showSaveModal}
                setShowModal={setShowSavaModal}
                ConfirmDelete={ConfirmDelete}
            />
            <div className="table_container">
                <div className="button_container">
                    <button className="add" onClick={() => setShowAddModal(true)}>+</button>
                    <button className="save" onClick={saveData}>Save</button>
                </div>
                <div className="table">
                    <table border="1">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Stock ID</th>
                                <th>Stock Name</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dividends.map((div, div_index) => (
                                <tr className={div_index % 2 === 0 ? "even_row" : "odd_row"} key={div_index}>
                                    <td>#{div_index + 1}</td>
                                    <td>{div.stock_id}</td>
                                    <td>{div.stock}</td>
                                    <td>{div.amount}</td>
                                    <td>{div.date}</td>
                                    <td>
                                        <button onClick={() => DeleteRow(div_index)}>Del</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

function ShowInputModal({ showModal, setShowModal, dividends, setDividends }) {
    const [newRow, setNewRow] = useState({
        ID: dividends.length, // Auto-generate ID based on the current length of dividends
        stock_id: "", 
        stock: "",
        amount: 0.0,
        date: ""
    });

    const resetNewRow = () =>{
        setNewRow({
            ID: dividends.length,
            stock_id: "",
            stock: "",
            amount: 0.0,
            date: ""
        });
    };

    const fetchStockName = async (stock_id) => {
        try {
            const response = await fetch(`http://127.0.0.1:5001/stocks/${stock_id}`);
            const data = await response.json();
            if (data.stock_name) {
                return data.stock_name;
            } else {
                resetNewRow();
                return None;
            }
        } catch (error) {
            resetNewRow();
            alert("Stock not found.");
            console.error("Error fetching stock name:", error);
        }
    };
    

    const closeModal = () => {
        setShowModal(false);
        resetNewRow(); // Reset form and auto-generate ID
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRow({
            ...newRow,
            [name]: name === "amount" ? parseFloat(value) || 0.0 : value, 
        });
    };

    const handleSubmit = async () => {
        // Check if the necessary fields are filled
        if (!newRow.stock_id || !newRow.amount || !newRow.date) {
            alert("Please fill out all fields.");
            resetNewRow();
            return;
        }
        try {
            const name = await fetchStockName(newRow.stock_id); // Wait for stock name lookup
            if (name) {
                const updatedRow = {
                    ...newRow,
                    stock: name,
                    ID: dividends.length
                };
    
                setDividends([...dividends, updatedRow]); // Add to list
                closeModal();
            }
        } catch (error) {
            resetNewRow();
            alert("Error fetching stock name:")
            console.error("Error fetching stock name:", error);
        }
    };
    

    return (
        <>
            {showModal && (
                <div className="modal">
                    <div className="modal_context">
                        <button className="close_button" onClick={closeModal}>
                            x
                        </button>
                        <div className="horizontal_line"></div>
                        <table>
                            <thead>
                                <tr>
                                    <th>stock id</th>
                                    <th>stock name</th>
                                    <th>amount</th>
                                    <th>date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input
                                            type="text"
                                            name="stock_id"
                                            placeholder="stock_id"
                                            value={newRow.stock_id}
                                            onChange={handleInputChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="stock"
                                            placeholder="stock"
                                            value={newRow.stock}
                                            readOnly
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name="amount"
                                            placeholder="amount"
                                            value={newRow.amount}
                                            onChange={handleInputChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            name="date"
                                            placeholder="date"
                                            value={newRow.date}
                                            onChange={handleInputChange}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button className="submmit_button" onClick={handleSubmit}>
                            submit
                        </button>
                    </div>
                </div>
            )}
        </>
    );    
}

function ShowConfirmModal({ showModal, setShowModal, ConfirmDelete }) {
    return (
        <>
            {showModal && (
                <div className="modal">
                    <div className="modal_context">
                        <h2>Are you sure you want to delete this row?</h2>
                        <button className="confirm_button" onClick={ConfirmDelete}>Confirm</button>
                        <button className="cancel_button" onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </>
    );
}

function ShowMenu({loginData, setifLogIn,setShowUserMenu}){
    const [showChart, setshowChart] = useState(false);
    return(
        <>
            <div className="user_menu">
                <p>User name: {loginData.account}</p>
                <div className="menu_button" onClick={() => setshowChart(true)}>
                    <img src={StaIcon} width="20" height="20"/>
                    <p>Show Chart (Amount)</p>
                </div>
                <div className="menu_button" onClick={() => setifLogIn(false)}>
                    <img src={logOutIcon} width="20" height="20"/>
                    <p>Log out</p>
                </div>
            </div>
            <div className="PowerBi_Chart">
                {showChart && (
                    <PowerBIReport
                        showChart={showChart}
                        setshowChart={setshowChart}
                    />
                )}
            </div>
        </>
        
    );
}

export default CreateTable;
