import dotenv from 'dotenv';
dotenv.config();

function required(key, defaultValue=undefined){
    const value = process.env[key] || defaultValue;
    if(value == null){
        throw new Error(`key ${key} is undefinded`);
    } return value;
}
// or 문법을 이용하여 값이 있으면 value에 process.env[key] 없으면 defaultValue

export const config = {
    jwt: {
        secretkey: required('JWT_SECRET'),
        expiresInsec: parseInt(required('JWT_EXPIRES_SEC', 172800))
    },
    bcrypt: {
        saltRounds: parseInt(required('BCRYPT_SALT_ROUNDS', 12))
    },
    host: {
        port: parseInt(required('HOST_PORT', 8080))
    },
    db: {
        host: required('DB_HOST'),
        // user: required('DB_USER'),
        // database: required('DB_DATABASE'),
        // password: required('DB_PASSWORD')
    }
}