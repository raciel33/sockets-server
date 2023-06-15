import jwt from 'jsonwebtoken';

export const generarJWT = (uid: string): Promise<string> => {

    return new Promise((resolve, reject) => {

        const payload = {
            uid
        };

        //token que se va a firmar: payload
        //Aqui esta la palabra secreta definida para firmar los token: process.env.JWT_SECRET

        jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: '24h'
        }, (err: any, token: any) => {
            if (err) {
                console.log(err);
                reject('no se pudo generar JWT');
            } else {
                resolve(token);
            }
        });

    })


}

