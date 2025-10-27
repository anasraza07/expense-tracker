import { incomeCategories, expenseCategories } from "../data/categories"

function Filters({ filters, saveFilters, categoryInput, setCategoryInput }) {
    return (
        <div className="bg-slate-800 p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-center mb-8 gap-4" >
            <div className="flex items-center gap-4">
                <div className="font-medium text-gray-300">Filter:</div>
                {['income', 'expense'].map((f, index) => (
                    <button key={index} className={`px-4 py-1 border-2 border-slate-600 ${!filters.includes(f) ? 'bg-transparent hover:bg-slate-700' : 'bg-slate-700 hover:bg-slate-700/80'} rounded-lg transition cursor-pointer`} onClick={saveFilters}>{f}</button>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <div className="font-medium text-gray-300">Category:</div>
                <select className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none capitalize"
                    defaultValue={categoryInput} onChange={(e) => {
                        setCategoryInput(e.target.value)
                    }}>
                    <option value="">All</option>
                    {filters.length === 1 ? (filters[0] === "income" ?
                        incomeCategories.map((category, index) => <option value={category}
                            key={index} className="capitalize">{category}</option>) : expenseCategories.map((category, index) => <option value={category}
                                key={index} className="capitalize">{category}</option>)) :
                        [...incomeCategories, ...expenseCategories].map((category, index) =>
                            <option key={index} value={category} className="capitalize">{category}</option>)}
                </select>
            </div>
        </div >
    )
}

export default Filters