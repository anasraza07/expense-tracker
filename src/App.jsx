import { useEffect, useState } from "react";
import { expenseCategories, incomeCategories } from "./data/categories";
import moment from 'moment';

function App() {
  const today = moment().format("YYYY-M-D");

  const storedSummary = JSON.parse(localStorage.getItem("summary"))
  const storedTransactions = JSON.parse(localStorage.getItem("transactions"))

  const [transactionForm, setTransactionForm] = useState({
    type: "", amount: "",
    category: "", description: "", date: today,
  });
  const [type, setType] = useState("");
  const [transactions, setTransactions] = useState(storedTransactions || []);
  const [summary, setSummary] = useState(storedSummary || { expense: 0, income: 0, balance: 0 });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [filters, setFilters] = useState([]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));

    const totalExpense = transactions.filter(
      transaction => transaction.type == "expense").reduce(
        (prev, curr) => prev += Number(curr.amount), 0)
    const totalIncome = transactions.filter(
      transaction => transaction.type == "income").reduce(
        (prev, curr) => prev += Number(curr.amount), 0)

    setSummary({
      expense: totalExpense,
      income: totalIncome,
      balance: totalIncome - totalExpense,
    })
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("summary", JSON.stringify(summary))
  }, [summary])

  useEffect(() => {
    console.log(filters)
  }, [filters])

  const handleInputChange = (e) => {
    if (e.target.name == "type") {
      setType(e.target.value);
    }

    setTransactionForm({
      ...transactionForm,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setTransactions(prevTransactions => {
      return [{
        id: Date.now(),
        ...transactionForm
      },
      ...prevTransactions,]
    })

    setTransactionForm({
      type: "",
      amount: "",
      category: "",
      description: "",
      date: today,
    });
  };

  const formattedDate = (date) => moment(date).format("D MMM'YY");

  const editTransaction = (id) => {
    // jis transaction pr click hua hai uska index get kro
    // ab index se obj get kro
    // obj ki values form mein show karwao
    // save click krne pr ye obj usi index pr jaa ke save hojaaye
    setIsEditing(true)
    window.scroll({ top: 116, behavior: "smooth" })

    const { amount, category, date, description, type } =
      transactions.find(t => t.id == id);
    setTransactionForm({ type, amount, category, description, date })
    setEditingId(id);
  }

  const handleFormSave = (e) => {
    e.preventDefault();

    const index = transactions.findIndex(t => t.id == editingId);
    console.log(index)

    setTransactions([
      ...transactions.slice(0, index),
      { id: editingId, ...transactionForm },
      ...transactions.slice(index + 1)
    ])

    setIsEditing(false)
    setEditingId(null)
    setTransactionForm({
      type: "", amount: "", category: "", description: "",
      date: today
    })
  }

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id != id))
  }

  const saveFilters = (e) => {
    let newFilters = []
    const value = e.target.textContent.toLowerCase()

    if (!filters.includes(value)) {
      newFilters = [...filters, value]
    } else {
      newFilters = filters.filter(f => f != value)
    }

    setFilters(newFilters);
  }

  const filteredTransactions = filters.length ?
    transactions.filter(({ type }) => filters.includes(type)) :
    transactions;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-6xl">

        {/* Balance Section */}
        <div className="bg-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center mb-8 shadow-lg">
          <div className="text-lg text-gray-300">Current Balance</div>
          <div className={`text-3xl font-bold ${summary.balance < 0 ? "text-red-400" : "text-green-400"}`}>
            Rs {summary.balance.toFixed(2)}</div>
        </div>

        {/* Form */}
        {!isEditing ? (<form
          onSubmit={handleFormSubmit}
          className="bg-slate-800 p-6 rounded-2xl shadow-lg mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="relative">
            <select
              name="type"
              value={transactionForm.type}
              onChange={handleInputChange}
              className={`bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none appearance-none w-full 
              ${!transactionForm.type ? 'text-slate-500' : 'text-white'}`}>
              <option value="" disabled className="text-slate-500">Income/Expense</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
          </div>

          <input
            type="number"
            name="amount"
            value={transactionForm.amount}
            onChange={handleInputChange}
            placeholder="Amount"
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none placeholder-slate-500"
          />

          <div className="select relative">
            <select
              name="category"
              value={transactionForm.category}
              onChange={handleInputChange}
              className={`bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none 
              ${!transactionForm.category ? 'text-slate-500' : 'text-white'} capitalize appearance-none w-full`}>
              <option value="" disabled>Category</option>
              {type === "income" ? incomeCategories.map((category, index) => <option key={index} value={category} className="capitalize">{category}</option>) : expenseCategories.map((category, index) => <option key={index} value={category} className="capitalize">{category}</option>)}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
          </div>

          <input
            type="text"
            name="description"
            value={transactionForm.description}
            onChange={handleInputChange}
            placeholder="Description (optional)"
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none placeholder-slate-500"
          />

          <input
            type="date"
            name="date"
            value={transactionForm.date}
            onChange={handleInputChange}
            className={`bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none 
              ${transactionForm.date == today ? 'text-slate-500' : 'text-white'}`}
          />

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl py-2 transition"
          >Add</button>
        </form>) : (<form
          onSubmit={handleFormSave}
          className="bg-slate-800 p-6 rounded-2xl shadow-lg mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">

          <input
            type="number"
            name="amount"
            value={transactionForm.amount}
            onChange={handleInputChange}
            placeholder="Amount"
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none placeholder-slate-500"
          />

          <div className="select relative">
            <select
              name="category"
              value={transactionForm.category}
              onChange={handleInputChange}
              className={`bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none 
              ${!transactionForm.category ? 'text-slate-500' : 'text-white'} capitalize appearance-none w-full`}>
              <option value="" disabled>Category</option>
              {type === "income" ? incomeCategories.map((category, index) => <option key={index} value={category} className="capitalize">{category}</option>) : expenseCategories.map((category, index) => <option key={index} value={category} className="capitalize">{category}</option>)}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
          </div>

          <input
            type="text"
            name="description"
            value={transactionForm.description}
            onChange={handleInputChange}
            placeholder="Description (optional)"
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none placeholder-slate-500"
          />

          <input
            type="date"
            name="date"
            value={transactionForm.date}
            onChange={handleInputChange}
            className={`bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none 
              ${transactionForm.date == today ? 'text-slate-500' : 'text-white'}`}
          />

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl py-2 transition cursor-pointer">Save</button>
        </form>)}

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-800 p-4 rounded-2xl text-center shadow-lg">
            <div className="text-gray-400">Income</div>
            <div className="text-2xl font-bold text-green-400">Rs {summary.income.toFixed(2)}</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-2xl text-center shadow-lg">
            <div className="text-gray-400">Expense</div>
            <div className="text-2xl font-bold text-red-400">Rs {summary.expense.toFixed(2)}</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-800 p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="font-medium text-gray-300">Filter:</div>
            <button className="px-4 py-1 bg-slate-700 rounded-lg hover:bg-slate-600 transition cursor-pointer" onClick={saveFilters}>Income</button>
            <button className="px-4 py-1 bg-slate-700 rounded-lg hover:bg-slate-600 transition cursor-pointer" onClick={saveFilters}>Expense</button>
          </div>

          <div className="flex items-center gap-3">
            <div className="font-medium text-gray-300">Category:</div>
            <select className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none">
              <option value="">All</option>
              <option>Food</option>
              <option>Travel</option>
              <option>Education</option>
              <option>Entertainment</option>
              <option>Vehicle</option>
              <option>Office</option>
              <option>Utilities</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.map(({ id, description, category, amount, date, type }, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-lg hover:bg-slate-700 transition">
              <div>
                <div className="text-lg font-medium">{description}</div>
                <div className="text-sm text-gray-400 capitalize  ">
                  {category} • {formattedDate(date)}
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 sm:mt-0">
                <div className={`font-semibold ${type == "expense" ? "text-red-400" : "text-green-400"}`}>
                  Rs. {amount}</div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition"
                    onClick={() => editTransaction(id)}>Edit</button>
                  <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition"
                    onClick={() => deleteTransaction(id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div >
    </div >
  );
}

export default App;