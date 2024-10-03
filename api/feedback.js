import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    const { rating, email } = req.query;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Validate inputs
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
                <h1>Erro: Entrada inválida</h1>
                <p>Por favor, forneça uma avaliação válida e o seu email.</p>
            </body>
            </html>
        `);
    }

    // Check if the user has already submitted feedback today
    const today = new Date().toISOString().split('T')[0]; // Get current date (YYYY-MM-DD)
    
    const { data: existingFeedback, error: selectError } = await supabase
        .from('feedback')
        .select('*')
        .eq('email', email)
        .gte('timestamp', `${today}T00:00:00.000Z`);

    if (selectError) {
        return res.status(500).send(`
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
                <h1>Erro ao verificar o feedback</h1>
                <p>Ocorreu um problema ao verificar seu feedback. Tente novamente mais tarde.</p>
            </body>
            </html>
        `);
    }

    // If feedback exists for today, do not allow another submission
    if (existingFeedback && existingFeedback.length > 0) {
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
                <h1>Você já avaliou hoje</h1>
                <p>Você já enviou uma avaliação hoje. Por favor, tente novamente amanhã.</p>
            </body>
            </html>
        `);
    }

    // Insert new feedback
    const { data, error: insertError } = await supabase
        .from('feedback')
        .insert([{ email, rating, ip_address: ip }]);

    if (insertError) {
        return res.status(500).send(`
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
                <h1>Erro ao salvar seu feedback</h1>
                <p>Ocorreu um problema ao salvar seu feedback. Tente novamente mais tarde.</p>
            </body>
            </html>
        `);
    }

    // Return a thank-you page if feedback was successfully inserted
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
            <h1>Obrigado pelo seu feedback!</h1>
            <p>Agradecemos a sua avaliação. Isso nos ajuda a melhorar os nossos serviços.</p>
        </body>
        </html>
    `);
}

