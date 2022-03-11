import Utils from "./utils";
import { WalletProvider } from './walletProvider'


export default class Fund {
    private utils: Utils;
    private walletProvider: WalletProvider;

    constructor(utils: Utils, walletProvider) {
        this.utils = utils;
        this.walletProvider = walletProvider;
    }

    fund = async (amount: number, multiplier = 1.0): Promise<any> => {
        if (!Number.isInteger(amount)) { throw new Error("must use an integer for funding amount") }
        const to = await this.utils.getBundlerAddress(this.walletProvider.currency);
        let baseFee;
        if (this.walletProvider.unit === "winston") {
            baseFee = await this.walletProvider.getFee(0, to)
        } else {
            baseFee = await this.walletProvider.getFee(amount, to)
        }
        const fee = (baseFee.multipliedBy(multiplier)).toFixed(0).toString();
        const tx = await this.walletProvider.createAndSendTx({amount, fee: fee.toString(), to})
        if (this.walletProvider.currency == "matic") {
            await this.utils.api.post("/account/balance/matic", { tx_id: tx.txId });
        }
        return { reward: fee, target: to, quantity: amount, id: tx.txId };
    }
}