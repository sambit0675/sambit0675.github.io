import { deepHash } from "arbundles";
import { stringToBuffer } from "arweave/node/lib/utils";
import { AxiosResponse } from "axios";
import Utils from "./utils";
import Api from "arweave/node/lib/api";
import { WalletProvider } from "./walletProvider";
import base64url from 'base64url';

interface WithdrawData {
    publicKey: string,
    currency: string,
    amount: string,
    nonce: number,
    signature: string;
}


const toHexString = bytes =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

/**
 * Create and send a withdrawl request 
 * @param utils Instance of Utils 
 * @param api Instance of API
 * @param wallet Wallet to use
 * @param amount amount to withdraw in winston
 * @returns the response from the bundler
 */
export async function withdrawBalance(utils: Utils, api: Api, amount: number, walletProvider: WalletProvider): Promise<AxiosResponse> {
    // //todo: make util functions directly return data rather than having to post-return mutate
    
    const publicKeyHex = await walletProvider.getPublicKey();
    const signer = walletProvider.getSigner();

    const nonce = await utils.getNonce();
    

    const deephash = await deepHash([stringToBuffer(walletProvider.currency), stringToBuffer(amount.toString(10)), stringToBuffer(nonce.toString())]);

    const signature = await signer.sign(deephash);

    const data: WithdrawData = {
        publicKey: base64url(Buffer.from(publicKeyHex, 'hex')),
        currency: utils.currency,
        amount: amount.toString(10),
        nonce,
        signature: base64url(Buffer.from(toHexString(signature), 'hex')),
    }
    return api.post("/account/withdraw", data);
}
