import Wallet from "@/models/wallet.model";

export async function ensureWallet(userId: string) {
  let wallet = await Wallet.findOne({ userId });
  
  if (!wallet) {
    wallet = await Wallet.create({
      userId,
      balance: 5000, // Default balance
      transactions: [{
        type: 'credit',
        amount: 5000,
        description: 'Initial balance'
      }]
    });
  }
  
  return wallet;
} 