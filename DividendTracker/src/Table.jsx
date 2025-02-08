import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Table.css"

function CreateTable() {
    const [dividends, setDividends] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        axios.get("http://127.0.0.1:5001/api/dividends")
            .then(response => setDividends(response.data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    const saveData = () => {
        axios.post("http://127.0.0.1:5001/api/save_dividends", { dividends })
            .then(response => {
                console.log("Data saved successfully:", response.data);
                alert("Dividends saved to the database!");
            })
            .catch(error => console.error("Error saving data:", error));
    };

    return (
        <>
            <h1>Dividend Table</h1>
            <button onClick={() => setShowModal(true)}>+</button>
            <button onClick={saveData}>Save</button> {/* Save button */}

            {/* Modal to Add New Row */}
            <ShowInputModal
                showModal={showModal}
                setShowModal={setShowModal}
                dividends={dividends}
                setDividends={setDividends}
            />

            {/* Table */}
            <CreateTableList
                dividends={dividends}
                setDividends={setDividends}
            />
        </>
    );
}

function CreateTableList({ dividends, setDividends }) {
    const [showModal, setShowModal] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null); // Store the row index to delete

    const DeleteRow = (rowIndex) => {
        setRowToDelete(rowIndex); // Store the row index
        setShowModal(true); // Show confirmation modal
    };

    const ConfirmDelete = () => {
        if (rowToDelete !== null) {
            setDividends(dividends.filter((_, index) => index !== rowToDelete));
            setRowToDelete(null); // Reset the state
        }
        setShowModal(false);
    };

    return (
        <>
            <ShowConfirmModal
                showModal={showModal}
                setShowModal={setShowModal}
                ConfirmDelete={ConfirmDelete}
            />
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Stock</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {dividends.map((div, div_index) => (
                        <tr>
                            <td>{div.id}</td>
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
        </>
    );
}

function ShowInputModal({ showModal, setShowModal, dividends, setDividends }) {
    const [newRow, setNewRow] = useState({
        id: dividends.length + 1, // Auto-generate ID based on the current length of dividends
        stock: "",
        amount: 0.0,
        date: ""
    });

    const fetchStockName = async (stockId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5001/api/get_stock_name?id=${stockId}`);
            const data = await response.json();
            if (data.stock_name) {
                return data.stock_name;
            } else {
                alert("Stock not found.");
                return None;
            }
        } catch (error) {
            alert("Stock not found.");
            console.error("Error fetching stock name:", error);
        }
    };
    

    const closeModal = () => {
        setShowModal(false);
        setNewRow({ id: dividends.length + 1, stock: "", amount: 0.0, date: "" }); // Reset form and auto-generate ID
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
        if (!newRow.id || !newRow.amount || !newRow.date) {
            alert("Please fill out all fields.");
            return;
        }
        console.error(newRow.id)
        try {
            const name = await fetchStockName(newRow.id); // Wait for stock name lookup
            if (name) {
                const updatedRow = {
                    ...newRow,
                    stock: name,
                };
    
                setDividends([...dividends, updatedRow]); // Add to list
                closeModal();
            }
        } catch (error) {
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
                                    <th>id</th>
                                    <th>stock</th>
                                    <th>amount</th>
                                    <th>date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input
                                            type="text"
                                            name="id"
                                            placeholder="id"
                                            value={newRow.id}
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


export default CreateTable;
