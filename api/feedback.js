import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    const { rating, email, opt_out } = req.query;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Validate email
    if (!email) {
        return res.status(400).send(`
            <html lang="pt-BR">
            <head><style>body { font-family: Arial, sans-serif; }</style></head>
            <body>
                <h1>Erro: Entrada inválida</h1>
                <p>Por favor, forneça um email válido.</p>
            </body>
            </html>
        `);
    }

    // If the user opted out
    if (opt_out === "true") {
        // Update the user's opt_out status in the database
        const { error: updateError } = await supabase
            .from('feedback')
            .update({ opt_out: true })
            .eq('email', email);

        if (updateError) {
            return res.status(500).send(`
                <html lang="pt-BR">
                <head><style>body { font-family: Arial, sans-serif; }</style></head>
                <body>
                    <h1>Erro ao atualizar suas preferências</h1>
                    <p>Ocorreu um problema ao processar seu pedido de cancelamento.</p>
                </body>
                </html>
            `);
        }

        return res.status(200).send(`
            <html lang="pt-BR">
            <head><style>body { font-family: Arial, sans-serif; }</style></head>
            <body>
                <h1>Você foi desinscrito!</h1>
                <p>Você não receberá mais essa pesquisa. Obrigado pelo seu tempo.</p>
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
            <head><style>body { font-family: Arial, sans-serif; }</style></head>
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
            <head><style>body { font-family: Arial, sans-serif; }</style></head>
            <body>
                <h1>Você já avaliou hoje</h1>
                <p>Você já enviou uma avaliação hoje. Por favor, tente novamente amanhã.</p>
            </body>
            </html>
        `);
    }

    // Insert new feedback
    const { error: insertError } = await supabase
        .from('feedback')
        .insert([{ email, rating, ip_address: ip, opt_out: false }]); // Set opt_out to false by default

    if (insertError) {
        return res.status(500).send(`
            <html lang="pt-BR">
            <head><style>body { font-family: Arial, sans-serif; }</style></head>
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
        <head><style>body { font-family: Arial, sans-serif; }</style></head>
        <body>
            <h1>Obrigado pelo seu feedback!</h1>
            <p>Agradecemos a sua avaliação. Isso nos ajuda a melhorar os nossos serviços.</p>
        </body>
        </html>
    `);
}
