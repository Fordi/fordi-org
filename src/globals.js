import { join } from 'path';
export const joinClass = (...classes) => classes.filter(a => !!a).join(' ');
export const asset = file => join(process.env.PUBLIC_URL, file).replace(/\\\\/g, '/');