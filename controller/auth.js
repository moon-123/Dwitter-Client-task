import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userRepository from '../data/auth.js';
import { config } from "../config.js";

export async function signup(req, res){
    const { username, password, name, email, url } = req.body;
    const found = await userRepository.findByUsername(username);
    if(found){
        return res.status(409).json({ message: `${username}이 이미 가입되었음`});
    }

    const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
    const userId = await userRepository.createUser({
        username, 
        password: hashed,
        name,
        email,
        url
    });
    const token = createJwtToken(userId);
    res.status(201).json({ token, username });
}

export async function login(req, res){
    const { username, password } = req.body;
    const user = await userRepository.findByUsername(username);
    
    if(!user){
        return res.status(401).json({message: '아이디를 찾을 수 없음'});
    }

    const isValidpassword = await bcrypt.compare(password, user.password);

    if(!isValidpassword){
        return res.status(401).json({message:'비밀번호를 찾을 수 없음'});
    }

    const token = createJwtToken(user.id);
    res.status(200).json({token, username});
}


function createJwtToken(id){
    return jwt.sign({ id }, config.jwt.secretkey, { expiresIn : config.jwt.expiresInsec });
}

export async function me(req, res, next){
    const user = await userRepository.findById(req.userId);
    if(!user){
        return res.status(404).json({ message:`사용자를 찾을 수 없음` });
    }
    res.status(200).json({ token: req.token, username: user.username });
}