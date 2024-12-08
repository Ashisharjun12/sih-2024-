import Wallet from "@/models/wallet.model";

export async function ensureWallet(userId: string) {
  let wallet = await Wallet.findOne({ userId });
  
  if (!wallet) {
    wallet = await Wallet.create({
      userId,
      balance: 0,
      transactions: []
    });
  }
  
  return wallet;
}

export async function canAfford(userId: string, amount: number) {
  const wallet = await Wallet.findOne({ userId });
  return wallet ? wallet.balance >= amount : false;
}

export async function processPayment(
  userId: string, 
  amount: number, 
  description: string,
  category: string,
  metadata?: any
) {
  const wallet = await Wallet.findOne({ userId });
  
  if (!wallet || wallet.balance < amount) {
    throw new Error("Insufficient balance");
  }

  wallet.transactions.push({
    type: 'debit',
    amount,
    description,
    category,
    metadata,
    status: 'completed'
  });

  wallet.balance -= amount;
  await wallet.save();
  
  return wallet;
} 