import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client using environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    const { rating, email } = req.query;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (!rating || !email) {
        return res.status(400).send(`
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mazola EPI</title>
            <link rel="shortcut icon" sizes="16x16" href="../images/favicon16x16.ico">
            <link rel="shortcut icon" sizes="32x32" href="../images/favicon32x32.ico">
            <link rel="shortcut icon" sizes="96x96" href="../images/favicon96x96.ico">
            <link rel="shortcut icon" sizes="192x192" href="../images/favicon192x192.ico">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f0f8ff;
                        color: #002147;
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                    }
                    header {
                        background-color: #002147;
                        padding: 20px;
                        text-align: center;
                    }
                    h1 {
                        color: white;
                    }
                </style>
            </head>
            <body>
                <header>
                    <h1>Erro: Entrada inválida</h1>
                </header>
                <p>Por favor, forneça uma avaliação válida e o seu email.</p>
            </body>
            </html>
        `);
    }

    // Store feedback in the database (as already done)

    return res.status(200).send(`
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mazola EPI</title>
            <link rel="shortcut icon" sizes="16x16" href="../images/favicon16x16.ico">
            <link rel="shortcut icon" sizes="32x32" href="../images/favicon32x32.ico">
            <link rel="shortcut icon" sizes="96x96" href="../images/favicon96x96.ico">
            <link rel="shortcut icon" sizes="192x192" href="../images/favicon192x192.ico">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f0f8ff;
                    color: #002147;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                header {
                    background-color: #002147;
                    padding: 20px;
                    text-align: center;
                }
                h1 {
                    color: white;
                }
                .content {
                    padding: 20px;
                    text-align: center;
                }
                footer {
                    background-color: #002147;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    margin-top: auto;
                }
            </style>
        </head>
        <body>
            <header>
                <h1>Obrigado pelo seu feedback!</h1>
            </header>
            <div class="content">
                <p>Agradecemos a sua avaliação. Isso nos ajuda a melhorar os nossos serviços.</p>
            </div>
            <footer>
                <p>© 2024 Mazola EPI. Todos os direitos reservados.</p>
            </footer>
        </body>
        </html>
    `);
}
