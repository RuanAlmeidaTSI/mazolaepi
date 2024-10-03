import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client using environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    // Get rating and email from query parameters
    const { rating, email } = req.query;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Validate inputs
    if (!rating || !email) {
        return res.status(400).send(`
            <html lang="pt-BR">
            <body>
                <h1>Erro: Entrada inválida</h1>
                <p>Por favor, forneça uma avaliação válida e o seu email.</p>
            </body>
            </html>
        `);
    }

    // Store feedback in the Supabase database
    const { data, error } = await supabase
        .from('feedback')
        .insert([{ email, rating, ip_address: ip }]);

    // Handle database error
    if (error) {
        return res.status(500).send(`
            <html lang="pt-BR">
            <body>
                <h1>Erro ao salvar seu feedback</h1>
                <p>Ocorreu um problema ao salvar seu feedback. Tente novamente mais tarde.</p>
            </body>
            </html>
        `);
    }

    // Return a thank-you page in Brazilian Portuguese
    return res.status(200).send(`
        <html lang="pt-BR">
        <body>
            <h1>Obrigado pelo seu feedback!</h1>
            <p>Agradecemos a sua avaliação. Isso nos ajuda a melhorar os nossos serviços.</p>
        </body>
        </html>
    `);
}
