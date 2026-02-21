function withdrawAmount(amount) {
  const data = getData();

  amount = Number(amount);

  if (amount <= 0) {
    return { success: false, message: "Invalid amount" };
  }

  if (amount > data.balance) {
    return { success: false, message: "Not enough balance" };
  }

  data.balance -= amount;

  data.history.push({
    date: new Date().toISOString().split("T")[0],
    earned: 0,
    penalty: 0,
    withdraw: amount,
    balance: data.balance
  });

  saveData(data);

  return { success: true, balance: data.balance };
}

function withdrawAll() {
  const data = getData();

  const withdrawn = data.balance;

  data.balance = 0;

  data.history.push({
    date: new Date().toISOString().split("T")[0],
    earned: 0,
    penalty: 0,
    withdraw: withdrawn,
    balance: 0
  });

  saveData(data);

  return { success: true, withdrawn };
}

function getTransactionHistory() {
  const data = getData();
  return data.history || [];
}

function getWeeklySummary() {
  const data = getData();
  const today = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  let earned = 0;
  let penalty = 0;

  data.history.forEach(entry => {
    const entryDate = new Date(entry.date);
    if (entryDate >= oneWeekAgo) {
      earned += entry.earned || 0;
      penalty += entry.penalty || 0;
    }
  });

  return {
    earned,
    penalty,
    net: earned - penalty
  };
}
