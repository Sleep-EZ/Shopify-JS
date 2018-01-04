
declare interface Promise<T> {
    all<T>(items: any[]): Promise<T>[];
}

import Client from './http/client';
import {Product, SHOPIFY_TYPE_PRODUCT} from './types';

const client = new Client({
    domain: "sleep-ez.myshopify.com"
});

let handles = [
    'roma-latex-mattress',
    'natural-latex',
];

client.getCollection('latex-mattresses')
    .then(res => console.log(res));
