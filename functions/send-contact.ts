interface Env {
  RESEND_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const body = await context.request.json() as { 
      name: string; 
      email: string; 
      subject?: string; 
      message: string; 
    };
    
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Os campos Nome, E-mail e Mensagem são obrigatórios.' }),
        { status: 400, headers }
      );
    }

    const apiKey = context.env.RESEND_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Configuração do servidor de e-mail (RESEND_API_KEY) em falta.' }),
        { status: 500, headers }
      );
    }

    // Prepare email HTML layout
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="background-color: #0E3B2E; color: white; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">Nova Mensagem de Contacto</h1>
          <p style="margin: 8px 0 0; opacity: 0.8; font-size: 13px;">OBEA - Observatório do Bem-Estar Animal</p>
        </div>
        <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none;">
          <div style="margin-bottom: 16px;">
            <span style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Nome do Remetente</span>
            <p style="margin: 4px 0 0; font-size: 14px; color: #1e293b; font-weight: bold;">${name}</p>
          </div>
          <div style="margin-bottom: 16px;">
            <span style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">E-mail do Remetente</span>
            <p style="margin: 4px 0 0; font-size: 14px; color: #1e293b;"><a href="mailto:${email}">${email}</a></p>
          </div>
          <div style="margin-bottom: 16px;">
            <span style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Assunto</span>
            <p style="margin: 4px 0 0; font-size: 14px; color: #1e293b;">${subject || 'Sem Assunto'}</p>
          </div>
          <div>
            <span style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Mensagem</span>
            <div style="margin-top: 8px; padding: 16px; background: white; border-radius: 8px; border: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        </div>
        <div style="background: #f1f5f9; padding: 12px 24px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
          <p style="margin: 0; font-size: 11px; color: #94a3b8; text-align: center;">Enviado a partir do formulário de contacto do site obea-dogs.pages.dev</p>
        </div>
      </div>
    `;

    // Send email using Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        // Using Resend's default onboarding domain to avoid references to totalnetworth.app
        from: 'Contacto OBEA <onboarding@resend.dev>',
        to: ['observatorio.obea@gmail.com'],
        subject: `📩 [Contacto Website] ${subject || 'Nova Mensagem'}`,
        html: emailHtml,
        reply_to: email,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error('Resend API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Erro ao enviar a mensagem através do serviço de e-mail.' }),
        { status: 502, headers }
      );
    }

    const result = await resendResponse.json();
    return new Response(
      JSON.stringify({ success: true, id: (result as any).id }),
      { status: 200, headers }
    );
  } catch (error: any) {
    console.error('Error in send-contact handler:', error);
    return new Response(
      JSON.stringify({ error: 'Ocorreu um erro interno no servidor.' }),
      { status: 500, headers }
    );
  }
};

// Handle options preflight (needed for potential fetch variations)
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
