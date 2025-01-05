
// import {useEffect, useState } from 'react';
// import './App.css';



// function App() {
  
//   const [name,setName] = useState(''); 
//   const [datetime,setDatetime] = useState('');
//   const [description , setDescription] = useState('');
//   const [transactions, setTransactions] = useState([]);
//   useEffect(() => {
//   getTransactions().then((data) => setTransactions(data));
// }, []);


//   async function getTransactions(){
//     const url = process.env.REACT_APP_API_URL+'/transactions';
//     const response = await fetch(url);
//     return await response.json();
     
//   }
//   // function addNewTransaction(ev){
//   //   ev.preventDefault();
//   //   const url = process.env.REACT_APP_API_URL+'/transaction';
//   //   if (!name.includes(' ')) {
//   //     console.error('Invalid input format for name');
//   //     return;
//   //   }
//   //   const price = name.split(' ')[0];
   
//   //   fetch(url, {
//   //     method: 'POST',
//   //     headers: { 'Content-type': 'application/json' },
//   //     body: JSON.stringify({
//   //       price,
//   //       name: name.substring(price.length + 1),
//   //       description,
//   //       datetime,
//   //     }),
//   //   })
//   //     .then((response) => {
//   //       if (!response.ok) {
//   //         throw new Error('Network response was not ok');
//   //       }
//   //       return response.json();
//   //     })
//   //     .then((json) => {
//   //       setName('');
//   //       setDatetime('');
//   //       setDescription('');
//   //       console.log('result', json);
//   //     })
//   //     .catch((error) => {
//   //       console.error('There was a problem with the fetch operation:', error);
//   //     });
    
//   // }
//   function refreshTransactions() {
//     getTransactions()
//       .then((data) => {
//         console.log('Fetched transactions:', data); // Log to verify
//         setTransactions(data);
//       })
//       .catch((error) => console.error('Error refreshing transactions:', error));
//   }
  
//   function addNewTransaction(ev) {
//     ev.preventDefault();
//     const url = process.env.REACT_APP_API_URL + '/transaction';
//     if (!name.includes(' ')) {
//       console.error('Invalid input format for name');
//       return;
//     }
//     const price = name.split(' ')[0];
  
//     fetch(url, {
//       method: 'POST',
//       headers: { 'Content-type': 'application/json' },
//       body: JSON.stringify({
//         price,
//         name: name.substring(price.length + 1),
//         description,
//         datetime,
//       }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then((newTransaction) => {
//         setName('');
//         setDatetime('');
//         setDescription('');
//         // Update the transactions state to include the new transaction
//         setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
//       })
//       .catch((error) => {
//         console.error('There was a problem with the fetch operation:', error);
//       });
//   }
  
//   let balance =0;
//   for (let transaction of transactions){
//     balance = balance + transaction.price;
//   }
//   balance = balance.toFixed(2);
//   const fraction = balance.split('.')[1];
//   balance = balance.split('.')[0];
//   return (
//     <>
//     <main>
//       <h1>Rs.{balance}<span>{fraction}</span></h1>
//       <button onClick={refreshTransactions} className="refresh-button">
//   Refresh
// </button>

//       <form onSubmit={addNewTransaction}>
//         <div className='basic'>
//           <input type="text" 
//           value={name} 
//           onChange={ev => setName(ev.target.value)}
//           placeholder={'+rs.2000 for earphones'}/>
//           <input value={datetime} 
//           onChange={ev => setDatetime(ev.target.value)} 
//           type="datetime-local"/>


//         </div>
//         <div className='description'>
//           <input type="text" 
//           value={description}
//           onChange={ev => setDescription(ev.target.value)}
//           placeholder={'description'}/>

//         </div>
//         <button type="submit">Add new transaction</button>
       
//       </form>
//       <div className='transactions'>
     
// {transactions.length > 0 &&
//   transactions.map((transaction) => (
//     <div className='transaction' key={transaction.id}>
//       <div className='left'>
//         <div className='name'>{transaction.name}</div>
//         <div className='description'>{transaction.description}</div>
//       </div>
//       <div className='right'>
//         <div className={`price ${transaction.price < 0 ? 'red' : 'green'}`}>
//           {transaction.price < 0
//             ? `-Rs.${Math.abs(transaction.price)}`
//             : `+Rs.${transaction.price}`}
//         </div>
//         <div className='datetime'>{transaction.datetime}</div>
//       </div>
//     </div>
//   ))
// }


        
         



        


       
//       </div>

//     </main>
//     </>
//   );
// }

// export default App;
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    const url = process.env.REACT_APP_API_URL + '/transactions';
    try {
      const response = await fetch(url);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }

  function resetToZeroState() {
    // Clear only the frontend state
    setTransactions([]);
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    if (!name.includes(' ')) {
      console.error('Invalid input format for name');
      return;
    }
    const price = parseFloat(name.split(' ')[0]);

    const newTransaction = {
      price,
      name: name.substring(name.indexOf(' ') + 1),
      description,
      datetime,
    };

    const url = process.env.REACT_APP_API_URL + '/transaction';

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTransaction),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to save transaction to the database');
        }
        return response.json();
      })
      .then((savedTransaction) => {
        setTransactions((prevTransactions) => [...prevTransactions, savedTransaction]);
        setName('');
        setDatetime('');
        setDescription('');
      })
      .catch((error) => {
        console.error('Error adding new transaction:', error);
      });
  }

  let balance = 0;
  for (let transaction of transactions) {
    balance += transaction.price;
  }
  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1] || '00';
  balance = balance.split('.')[0];

  return (
    <>
      <main>
        <h1>
          Rs.{balance}
          <span>{fraction}</span>
        </h1>
        <button onClick={resetToZeroState} className="reset-button">
          Reset 
        </button>
        <form onSubmit={addNewTransaction}>
          <div className="basic">
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              placeholder={'+rs.2000 for earphones'}
            />
            <input
              value={datetime}
              onChange={(ev) => setDatetime(ev.target.value)}
              type="datetime-local"
            />
          </div>
          <div className="description">
            <input
              type="text"
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
              placeholder={'Description'}
            />
          </div>
          <button type="submit">Add new transaction</button>
        </form>
        <div className="transactions">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div className="transaction" key={transaction.id}>
                <div className="left">
                  <div className="name">{transaction.name}</div>
                  <div className="description">{transaction.description}</div>
                </div>
                <div className="right">
                  <div className={`price ${transaction.price < 0 ? 'red' : 'green'}`}>
                    {transaction.price < 0
                      ? `-Rs.${Math.abs(transaction.price)}`
                      : `+Rs.${transaction.price}`}
                  </div>
                  <div className="datetime">{transaction.datetime}</div>
                </div>
              </div>
            ))
          ) : (
            <div>No transactions to display</div>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
