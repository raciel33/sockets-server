import nodemailer from 'nodemailer';

interface Formulario {
    nombre: string;
    email: string;
    asunto: string;
    mensaje: string;
}


export const enviarCorreo = (formulario: Formulario) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'reyesblanco1988@gmail.com',
            pass: 'ralgcbyfcnilcfgk',
        },
    });

    const mailOptions = {
        from: `${formulario.nombre} 👻” <${formulario.email}>`,
        to: 'racielreyes@hotmail.es',
        subject: formulario.asunto,
        html: `
            <strong>Nombre:</strong> ${formulario.nombre} <br/>
            <strong>E-mail:</strong> ${formulario.email} <br/>
            <strong>Mensaje:</strong> ${formulario.mensaje}
        `,
    };

    transporter.sendMail(mailOptions, function(err: any, info: any) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
        }
    });
};