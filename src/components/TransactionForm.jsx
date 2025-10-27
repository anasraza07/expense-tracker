import moment from "moment";
import { expenseCategories, incomeCategories } from "../data/categories";
import { useEffect, useRef, useState } from "react";

function TransactionForm({ isEditing, transactionForm, handleFormSubmit, handleFormSave, handleInputChange, type, formRef }) {
    const today = moment().format("YYYY-M-D");
    const isDisabled = !transactionForm.amount || !transactionForm.category;
    // const formRef = useRef(null);

    // effects
    useEffect(() => {
        const formFirstElem = formRef.current[0];

        if (formFirstElem.tagName === "SELECT") {
            formFirstElem.setAttribute("autofocus", true)
        } else {
            formFirstElem.focus();
        }
    }, [isEditing])

    return (
        <div>
            {!isEditing ? (
                <form ref={formRef} onSubmit={handleFormSubmit} className="bg-slate-800 p-6 rounded-2xl shadow-lg mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
                    <div className="relative">
                        <select autoFocus name="type" value={transactionForm.type}
                            onChange={handleInputChange} className={`bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none appearance-none w-full ${!transactionForm.type ? 'text-slate-500' : 'text-white'}`}>
                            <option value="" disabled="text-slate-500">
                                Income/Expense</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
                    </div>

                    <input type="number" name="amount" value={transactionForm.amount}
                        onChange={handleInputChange} placeholder="Amount"
                        className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none placeholder-slate-500" />

                    <div className="select relative">
                        <select name="category" value={transactionForm.category}
                            onChange={handleInputChange} className={`bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-400 outline-none 
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

                    <button type="submit" disabled={isDisabled}
                        className={`bg-green-500 text-white font-medium rounded-xl py-2 transition ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-green-600"}`}
                    >Add</button>
                </form>) : (<form ref={formRef}
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
                        disabled={!transactionForm.amount}
                        className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl py-2 transition cursor-pointer">Save
                    </button>
                </form>
            )}
        </div>
    )
}

export default TransactionForm;