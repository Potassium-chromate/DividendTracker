import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useEffect, useState, useMemo} from "react";
import { useModal } from "../../../hooks/useModal";
//import Badge from "../../ui/badge/Badge";

interface Order {
  id: number;
  stock_id: string;
  stock: string;
  owner: string;
  amount: number;
  date: string;
}

interface defaultFilter {
  stock_id: string;
  stock: string;
  owner: string;
  date: string;
}

export default function BasicTableOne() {
  const [sourceTableData, setSourceTableData] = useState<Order[]>([]);
  const [filter, setFilter] = useState<defaultFilter>({stock_id: "",
                                                       stock: "",
                                                       owner: "",
                                                       date: ""});
  const [tempValue, setTempValue] = useState<string>("");  
  const [openFilterMenu, setOpenFilterMenu] = useState<string | null>(null);
  const toggleFilterMenu = (column: keyof defaultFilter) => {
    if (openFilterMenu === column) {
      setOpenFilterMenu(null);
    } else {
      setOpenFilterMenu(column);
      setTempValue(filter[column]);
    }
  };                                         
  const { isOpen, openModal, closeModal } = useModal();                                                   
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/dividends`, { withCredentials: true })
        .then(response => setSourceTableData(response.data))
        .catch(error => alert("Error fetching data: " + error));
  }, []);

  const filteredTableData = useMemo(() => {
    return sourceTableData.filter((element) => {
      const matchStockId = filter.stock_id === "" || element.stock_id.includes(filter.stock_id);
      const matchStock = filter.stock === "" || element.stock.includes(filter.stock);
      const matchOwner = filter.owner === "" || element.owner.includes(filter.owner);
      const matchDate = filter.date === "" || element.date === filter.date;

      return matchStockId && matchStock && matchOwner && matchDate;
    });
  }, [sourceTableData, filter]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto min-h-50">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-40"
              >
                <div className="relative flex items-center gap-2">
                  <div className="flex flex-col w-full sm:col-span-1">
                    <span className="text-sm">Owner</span>
                    <button 
                      onClick={() => toggleFilterMenu('owner')}
                      className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                    </button>
                  </div>
                  {openFilterMenu === 'owner' && (
                    <div className="absolute top-full left-0 mt-2 w-48 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
                      <div className="text-xs mb-2 font-semibold">Filter Owner</div>
                      <input
                        type="text"
                        id="filter_Name"
                        placeholder="Enter Name..."
                        value={tempValue}
                        onChange={e => setTempValue(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded text-sm mb-2"
                        autoFocus // 讓選單打開時自動對焦輸入框
                      />
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => {setFilter({...filter, owner: ""});setOpenFilterMenu(null);}}
                          className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded"
                        >
                          Clear
                        </button>
                        <button 
                          onClick={() => {setFilter({...filter, owner: tempValue}); setOpenFilterMenu(null);}}
                          className="px-2 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 rounded"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-40" 
              >
                <div className="relative flex items-center gap-2">
                  <div className="flex flex-col w-full sm:col-span-1">
                    <span className="text-sm">Stock ID</span>
                    <button 
                      onClick={() => toggleFilterMenu('stock')}
                      className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                    </button>
                  </div>
                  {openFilterMenu === 'stock' && (
                    <div className="absolute top-full left-0 mt-2 w-48 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
                      <div className="text-xs mb-2 font-semibold">Filter Stock Name</div>
                      <input
                        type="text"
                        id="filter_Stock_Name"
                        placeholder="Enter Stock Name..."
                        value={tempValue}
                        onChange={e => setTempValue(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded text-sm mb-2"
                        autoFocus // 讓選單打開時自動對焦輸入框
                      />
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => {setFilter({...filter, stock: ""});setOpenFilterMenu(null);}}
                          className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded"
                        >
                          Clear
                        </button>
                        <button 
                          onClick={() => {setFilter({...filter, stock: tempValue}); setOpenFilterMenu(null);}}
                          className="px-2 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 rounded"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-40"
              >
                <div className="relative flex items-center gap-2">
                  <div className="flex flex-col w-full sm:col-span-1">
                    <span className="text-sm">Stock Name</span>
                    <button 
                      onClick={() => toggleFilterMenu('stock_id')}
                      className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                    </button>
                  </div>
                  {openFilterMenu === 'stock_id' && (
                    <div className="absolute top-full left-0 mt-2 w-48 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
                      <div className="text-xs mb-2 font-semibold">Filter Stock ID</div>
                      <input
                        type="text"
                        id="filter_Stock_ID"
                        placeholder="Enter Stock ID..."
                        value={tempValue}
                        onChange={e => setTempValue(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded text-sm mb-2"
                        autoFocus // 讓選單打開時自動對焦輸入框
                      />
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => {setFilter({...filter, stock_id: ""});setOpenFilterMenu(null);}}
                          className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded"
                        >
                          Clear
                        </button>
                        <button 
                          onClick={() => {setFilter({...filter, stock_id: tempValue}); setOpenFilterMenu(null);}}
                          className="px-2 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 rounded"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-40"
              >
                Amount
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-40"
              >
                <div className="relative flex items-center gap-2">
                  <div className="flex flex-col w-full sm:col-span-1">
                    <span className="text-sm">Date</span>
                    <button 
                      onClick={() => toggleFilterMenu('date')}
                      className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                    </button>
                  </div>
                  {openFilterMenu === 'date' && (
                    <div className="absolute top-full left-0 mt-2 w-48 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700">
                      <div className="text-xs mb-2 font-semibold">Filter Date</div>
                      <input
                        type="date"
                        id="filter_Stock_ID"
                        placeholder="Enter Stock ID..."
                        value={tempValue}
                        onChange={e => setTempValue(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded text-sm mb-2"
                        autoFocus // 讓選單打開時自動對焦輸入框
                      />
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => {setFilter({...filter, date: ""});setOpenFilterMenu(null);}}
                          className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded"
                        >
                          Clear
                        </button>
                        <button 
                          onClick={() => {setFilter({...filter, date: tempValue}); setOpenFilterMenu(null);}}
                          className="px-2 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600 rounded"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-40"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredTableData.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    {/*<div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={order.user.image}
                        alt={order.user.name}
                      />
                    </div>*/}
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.owner}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.stock_id}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {order.stock}
                </TableCell>
                {/*<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      order.status === "Active"
                        ? "success"
                        : order.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>*/}
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {order.amount}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {order.date}
                </TableCell>
                <TableCell>
                  <button
                    onClick={openModal}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                  >
                    <svg
                      className="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                        fill=""
                      />
                    </svg>
                    Edit
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 
