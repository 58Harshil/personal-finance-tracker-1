import React, { useState, useEffect } from 'react';
import './Home.css'; // Import CSS

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    setTransactions(storedTransactions);
    calculateBalance(storedTransactions);
  }, []);

  const addTransaction = (event) => {
    event.preventDefault();
    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      type,
    };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    calculateBalance(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    setDescription('');
    setAmount('');
    setType('income');
  };

  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter((transaction) => transaction.id !== id);
    setTransactions(updatedTransactions);
    calculateBalance(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  const calculateBalance = (transactions) => {
    const newBalance = transactions.reduce((acc, transaction) => {
      return transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount;
    }, 0);
    setBalance(newBalance);
  };

  return (
    <div className='home-main'>
      <h1>Personal Finance Tracker</h1>
      <div>
        <h2>Welcome, {localStorage.getItem('signedInUser')}</h2>
      </div>
      <div className="balance">
        <h2>Current Balance: ${balance}</h2>
      </div>
      <form onSubmit={addTransaction}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button type="submit">Add Transaction</button>
      </form>
      <ul className="transaction-list">
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <span className={transaction.type}>
              {transaction.description} - ${transaction.amount}
            </span>
            <button onClick={() => deleteTransaction(transaction.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
