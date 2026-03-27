import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import axios from "axios";

interface EditModalProps {
  isOpen: boolean;
  closeModal: () => void;
	currentRowId: number | null;
	sourceTableData: Order[];
	setSourceTableData: Dispatch<SetStateAction<Order[]>>;
}

interface Order {
  id: number;
  stock_id: string;
  stock: string;
  owner: string;
  amount: number;
  date: string;
}

export default function EditModal({isOpen, closeModal, currentRowId, sourceTableData, setSourceTableData}: EditModalProps) {
	//const rowData = sourceTableData.find((element) => element.id === currentRowId);
	const rowData = sourceTableData.find((element) => element.id === currentRowId);
	if (!rowData) return null;

	//Alarm message of inconsistant between stock id and stock name
	const [alarmMessage, setAlarmMessage] = useState<string>("");
	const [ifConsistent, setIfConsistent] =useState<boolean>(true);

	useEffect(() => {
    if (!isOpen) setAlarmMessage("");
  }, [isOpen]);
	const formRef = useRef<HTMLFormElement>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const updatedData = {
      id: rowData.id, // ID 通常不能改，直接拿原本的
      owner: rowData.owner, // Owner 也是 readonly
      stock_id: formData.get("stock_id") as string,
      stock: formData.get("stock") as string,
      amount: Number(formData.get("amount")), // 轉成數字
      date: formData.get("date") as string,
    };
		
		try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/dividends`,
        [updatedData],
        { withCredentials: true }
      );

			setSourceTableData(prev => prev.map((item) => item.id==updatedData.id? updatedData : item));
			console.log(sourceTableData)
      
      alert("修改成功: " + response.data.message);
      closeModal();
    } catch (error: any) {
      console.error("API 請求錯誤: ", error);
      // 捕捉後端回傳的錯誤訊息並顯示在畫面上
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("修改失敗，請檢查伺服器連線");
      }
    }
	};

	const handleCheck = async () =>{
		if (!formRef.current) return;
		const formData = new FormData(formRef.current);
    const stockId = formData.get("stock_id");
    const currentStockName = formData.get("stock"); // 你的 input name 是 "stock"

		try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/stocks/${stockId}`,
        { withCredentials: true }
      );
			
			const correctName = response.data.stock_name;
			// 檢查使用者填入的股票名稱是否與股票代碼相互批配
			if (correctName !== currentStockName){
        setAlarmMessage(`偵測到名稱不一致，已自動將 [${currentStockName}] 修正為 [${correctName}]`);
        setIfConsistent(false);
        const stockInput = formRef.current.elements.namedItem("stock") as HTMLInputElement;
        if (stockInput) {
          stockInput.value = correctName;
        }
      } else {
				setIfConsistent(true);
        setAlarmMessage("✅ 股票名稱與代碼完全相符！");
      }
    } catch (error: any) {
      console.error("API 請求錯誤: ", error);
      setAlarmMessage(`❌ 查無股票代碼: ${stockId}`);
    }
	};

	return(
	<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
		<Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
				<div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							Edit Row Data
						</h4>
						<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
							Update the details to keep up-to-date.
						</p>
					</div>
					<form ref={formRef} className="flex flex-col" onSubmit={handleSubmit}>
						<div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
							<div>
								<div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
									<div className="col-span-2 lg:col-span-1">
										<Label>ID</Label>
										<Input type="text" name="id" defaultValue={rowData.id} disabled/>
									</div>
									<div className="col-span-2 lg:col-span-1">
										<Label>Owner</Label>
										<Input type="text" name="owner" defaultValue={rowData.owner} disabled/>
									</div>
									<div className="col-span-2 lg:col-span-1">
										<Label>Stock ID</Label>
										<Input type="text" name="stock_id" defaultValue={rowData.stock_id}/>
									</div>
									<div className="col-span-2 lg:col-span-1">
										<Label>Stock Name</Label>
										<Input type="text" name="stock" defaultValue={rowData.stock}/>
									</div>
									<div className="col-span-2 lg:col-span-1">
										<Label>Amount</Label>
										<Input type="text" name="amount" defaultValue={String(rowData.amount)}/>
									</div>
									<div className="col-span-2 lg:col-span-1">
										<Label>Date</Label>
										<Input type="date" name="date" defaultValue={rowData.date}/>
									</div>
								</div>
							</div>
						</div>
						<div 
							className={`px-4 py-3 mt-4 text-sm font-medium rounded-lg border flex items-center gap-2 transition-colors ${
								ifConsistent 
									? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" 
									: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
							}`}
						>
							<span className={ifConsistent ? "text-teal-500" : "text-rose-400"}>
								{alarmMessage}
							</span>
						</div>
						<div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
							<Button size="sm" variant="outline" onClick={closeModal}>
								Close
							</Button>
							<Button size="sm" variant="success" onClick={handleCheck}>
								Check
							</Button>
							<Button size="sm" type="submit">
								Save Changes
							</Button>
						</div>
					</form>
				</div>
			</Modal>
		</div>
	);
}