import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    const { name, rating, email, opt_out } = req.query;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Common HTML structure with styles
    const commonHtmlHead = `
        <html lang="pt-BR">
        <head>
            <title>Mazola EPI</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f8ff;
                    color: #002147;
                    text-align: center;
                }
                .message {
                    font-weight: bold;
                    margin-top: 20px;
                }
                .logo {
                    margin-top: 50px;
                }
            </style>
            <link rel="shortcut icon" sizes="16x16" href="../images/favicon16x16.ico"> 
            <link rel="shortcut icon" sizes="32x32" href="../images/favicon32x32.ico">
            <link rel="shortcut icon" sizes="96x96" href="../images/favicon96x96.ico">
            <link rel="shortcut icon" sizes="192x192" href="../images/favicon192x192.ico">
        </head>
        <body>
            <div class="logo">
                <img src="../images/logo.png" alt="Mazola EPI Logo">
            </div>
    `;

    // Validate email
    if (!email) {
        return res.status(400).send(`
            ${commonHtmlHead}
            <div class="message">
                <h1>Erro: Entrada inválida</h1>
                <p>Por favor, forneça um email válido.</p>
            </div>
        </body>
        </html>
        `);
    }

    // If the user opted out
    if (opt_out === "true") {
        const { error: insertError } = await supabase
            .from('feedback')
            .insert([{ name, email, rating, ip_address: ip, opt_out: true }]);

        if (insertError) {
            return res.status(500).send(`
                ${commonHtmlHead}
                <div class="message">
                    <h1>Erro ao salvar suas preferências</h1>
                    <p>Ocorreu um problema ao processar seu pedido de cancelamento.</p>
                </div>
            </body>
            </html>
            `);
        }

        return res.status(200).send(`
            ${commonHtmlHead}
            <div class="message">
                <h1>Você foi desinscrito!</h1>
                <p>Você não receberá mais essa pesquisa. Obrigado pelo seu tempo.</p>
            </div>
        </body>
        </html>
        `);
    }

    // Check if the user has already submitted feedback today
    const today = new Date().toISOString().split('T')[0];

    const { data: existingFeedback, error: selectError } = await supabase
        .from('feedback')
        .select('*')
        .eq('email', email)
        .gte('timestamp', `${today}T00:00:00.000Z`);

    if (selectError) {
        return res.status(500).send(`
            ${commonHtmlHead}
            <div class="message">
                <h1>Erro ao verificar o feedback</h1>
                <p>Ocorreu um problema ao verificar seu feedback. Tente novamente mais tarde.</p>
            </div>
        </body>
        </html>
        `);
    }

    // If feedback exists for today
    if (existingFeedback && existingFeedback.length > 0) {
        return res.status(400).send(`
            ${commonHtmlHead}
            <div class="message">
                <h1>Você já avaliou hoje</h1>
                <p>Você já enviou uma avaliação hoje. Por favor, tente novamente amanhã.</p>
            </div>
        </body>
        </html>
        `);
    }

    // Insert new feedback
    const { error: insertError } = await supabase
        .from('feedback')
        .insert([{ name, email, rating, ip_address: ip, opt_out: false }]);

    if (insertError) {
        return res.status(500).send(`
            ${commonHtmlHead}
            <div class="message">
                <h1>Erro ao salvar seu feedback</h1>
                <p>Ocorreu um problema ao salvar seu feedback: ${insertError.message}</p>
            </div>
        </body>
        </html>
        `);
    }

    // Return a thank-you page
    return res.status(200).send(`
        ${commonHtmlHead}
        <div class="message">
            <h1>Obrigado pelo seu feedback!</h1>
            <p>Agradecemos a sua avaliação. Isso nos ajuda a melhorar os nossos serviços.</p>
        </div>
    </body>
    </html>
    `);
}
