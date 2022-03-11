import Api from "arweave/node/lib/api";
import { AxiosResponse } from "axios";
import BigNumber from "bignumber.js";

export default class Utils {
    public api: Api;
    private config: { address: string };
    public currency: string;
    constructor(api: Api, currency: string, config: { address: string }) {
        this.api = api;
        this.config = config;
        this.currency = currency;
    };
    private static checkAndThrow(res: AxiosResponse) {
        if (res.status != 200) {
            throw new Error(`Error: ${res.status} ${JSON.stringify(res.data)}`);
        }
        return;
    }

    /**
     * Gets the nonce used for withdrawl request validation from the bundler
     * @returns nonce for the current user
     */
    getNonce = async (): Promise<number>  => {
        const res = await this.api.get(`/account/withdrawals/${this.currency}?address=${this.config.address}`);
        Utils.checkAndThrow(res);
        return (res).data;
    }

    /**
     * Gets the balance on the current bundler for the specified user
     * @param address the user's address to query
     * @returns the balance in winston
     */
    getBalance = async (address: string): Promise<number> => {
        const res = await this.api.get(`/account/balance/${this.currency}?address=${address}`);
        Utils.checkAndThrow(res);
        return res.data.balance;
    }

    /**
     * Queries the bundler to get it's address for a specific currency
     * @returns the bundler's address
     */
    getBundlerAddress = async (currency: string): Promise<string> => {
        const res = await this.api.get("/info");
        const address = res.data.addresses[currency]
        if (!address) {
            throw new Error(`Specified bundler does not support currency ${currency}`);
        }
        return address;
    }

    getStorageCost = async (currency: string, bytes: number): Promise<BigNumber> => {
        const res = await this.api.get(`/price/${currency}/${bytes}`)
        Utils.checkAndThrow(res);
        return new BigNumber((res).data);
    }
}
