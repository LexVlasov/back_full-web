import {body} from 'express-validator';

export const registerValidation = [
    body('email','Неверный формат поты').isEmail(),
    body('password', 'Пароль минимум 5 символов').isLength({min:5}),
    body('fullName','Имя минимум 3 символа').isLength({min:3}),
    body('avatarUrl','Невернная ссылка на аватарку').optional().isString(),
]


export const loginValidation = [
    body('email','Неверный формат поты').isEmail(),
    body('password', 'Пароль минимум 5 символов').isLength({min:5}),
    
]

export const postCreateValidation = [
    body('title','Введите заголовк статьи').isLength({min:3}).isString(),
    body('text', 'Введите текст статьи').isLength({min:3}).isString(),
    body('tags','Неверный формат тэгов (укажите массив)').optional().isString(),
    body('imageUrl','Невернная ссылка на изображение').optional().isString(),
]