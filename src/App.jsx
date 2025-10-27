import { useEffect, useMemo, useRef, useState } from "react";
import moment from 'moment';
import TransactionForm from "./components/TransactionForm";
import Filters from "./components/Filters";
import TransactionList from "./components/TransactionList";
import { toast, Toaster } from "sonner";

function App() {
  const today = moment().format("YYYY-M-D");

  // states
  const [transactionForm, setTransactionForm] = useState({
    type: "", amount: "",
    category: "", description: "", date: today,
  });

  const [type, setType] = useState("");
  const [transactions, setTransactions] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("transactions"));
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [filters, setFilters] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");

  // effects
  useEffect(() => {
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0)
  }, [])

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    console.log(filters)
  }, [filters])

  // refs
  const formRef = useRef(null);
  const listRef = useRef(null);

  // memos
  const summary = useMemo(() => {
    const totalExpense = transactions
      .filter(t => t.type == "expense")
      .reduce((sum, curr) => sum += Number(curr.amount), 0)
    const totalIncome = transactions
      .filter(t => t.type == "income")
      .reduce((sum, curr) => sum += Number(curr.amount), 0)

    return {
      expense: totalExpense,
      income: totalIncome,
      balance: totalIncome - totalExpense,
    }

  }, [transactions])

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
        ...transactionForm,
        description: transactionForm.description || "No description",
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

    setTimeout(() => listRef.current.firstElementChild.scrollIntoView({
      block: "center", behavior: "smooth"
    }), 0);
  };

  const editTransaction = (id) => {
    setIsEditing(true)
    // window.scroll({ top: 116, behavior: "smooth" })
    formRef.current.scrollIntoView({
      behavior: "smooth", block: "center"
    });

    const {
      amount, category, date, description, type
    } = transactions.find(t => t.id == id);

    setTransactionForm({ type, amount, category, description, date })
    setEditingId(id);
  }

  const handleFormSave = (e) => {
    e.preventDefault();


    setTransactions(prev => {
      const index = prev.findIndex(t => t.id == editingId);
      return [
        ...prev.slice(0, index),
        { id: editingId, ...transactionForm },
        ...prev.slice(index + 1)
      ]
    })

    setIsEditing(false)
    setEditingId(null)
    setTransactionForm({
      type: "", amount: "", category: "", description: "",
      date: today
    })
    toast("Transaction updated successfully ✅")
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

  const filteredTransactions = useMemo(() => {
    let result = transactions;
    if (filters.length) result = result.filter(t => filters.includes(t.type))
    if (categoryInput) {
      result = result.filter(t => t.category === categoryInput)
    }
    return result;
  }, [transactions, filters, categoryInput])

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-10 px-4">
      <Toaster position="bottom-center" duration={1000} toastOptions={{
        style: { background: "#90a1b9", border: 'none', color: '#0f172b' }
      }} />

      <div className="w-full max-w-6xl">
        {/* Balance Section */}
        <div className="bg-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center mb-8 shadow-lg">
          <div className="text-lg text-gray-300">Current Balance</div>
          <div className={`text-3xl font-bold ${summary.balance < 0 ? "text-red-400" : "text-green-400"}`}>
            Rs {summary.balance.toFixed(2)}</div>
        </div>

        <TransactionForm isEditing={isEditing} transactionForm={transactionForm}
          handleFormSubmit={handleFormSubmit} handleFormSave={handleFormSave}
          handleInputChange={handleInputChange} type={type} formRef={formRef} />

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

        <Filters filters={filters} saveFilters={saveFilters}
          categoryInput={categoryInput} setCategoryInput={setCategoryInput} />

        {/* Transactions List */}
        <div className="space-y-4" ref={listRef}>
          <TransactionList
            filteredList={filteredTransactions}
            editTransaction={editTransaction} deleteTransaction={deleteTransaction}
          />
        </div>
      </div>
    </div>
  );
}

export default App;