import moment from "moment";

function TransactionList({ filteredList, editTransaction, deleteTransaction }) {
    const formattedDate = (date) => moment(date).format("D MMM'YY");
    return (
        <>
            {filteredList.map((
                { id, description, category, amount, date, type }, index
            ) => (
                <div key={index} className="bg-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-lg hover:bg-slate-700 transition">
                    <div>
                        <div className="text-lg font-medium">{description}</div>
                        <div className="text-sm text-gray-400 capitalize  ">
                            {category} • {formattedDate(date)}
                        </div>
                    </div>
                    <div className="flex w-full sm:w-fit justify-between items-center gap-4 mt-3 sm:mt-0">
                        <div className={`font-semibold ${type == "expense" ? "text-red-400" : "text-green-400"}`}>Rs. {amount}</div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition cursor-pointer"
                                onClick={() => editTransaction(id)}>Edit</button>
                            <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition cursor-pointer"
                                onClick={() => deleteTransaction(id)}>Delete</button>
                        </div>
                    </div>
                </div>
            ))
            }
        </>
    )
}

export default TransactionList