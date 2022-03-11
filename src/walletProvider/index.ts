import { Signer } from 'arbundles/build/signing/'
import BigNumber from "bignumber.js"
export { InjectedWalletProvider } from './injectedWalletProvider'

export interface CreateTxData { amount: BigNumber | number, to: string, fee?: string };

export interface WalletProvider {
    currency: string;
    unit: string;

    activate(): Promise<string[]>;
    
    getFee(amount: BigNumber | number, to: string): Promise<BigNumber>

    createAndSendTx({amount: number, fee: any, to: string}): Promise<{ txId: string, tx: any }>;

    getPublicKey(): Promise<string>

    getSigner(): Signer
}

