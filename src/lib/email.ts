import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM || "AlugaFácil <onboarding@resend.dev>";

export async function enviarEmailBoasVindas(nome: string, email: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Bem-vindo ao AlugaFácil! 🎉",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <div style="background:#1D9E75;padding:32px;text-align:center;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:24px">AlugaFácil</h1>
          <p style="color:#9FE1CB;margin:8px 0 0;font-size:13px">Soluções para sua obra</p>
        </div>
        <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px">
          <h2 style="color:#111827;font-size:18px;margin:0 0 12px">Olá, ${nome}! 👋</h2>
          <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 20px">
            Seja bem-vindo ao <strong>AlugaFácil</strong>! Sua conta foi criada com sucesso.
            Agora você pode alugar máquinas, ferramentas e equipamentos com facilidade.
          </p>
          <a href="${process.env.NEXTAUTH_URL}/equipamentos"
            style="display:inline-block;background:#1D9E75;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500">
            Ver equipamentos
          </a>
          <p style="color:#9ca3af;font-size:12px;margin:24px 0 0">
            AlugaFácil — Locação de ferramentas & máquinas
          </p>
        </div>
      </div>
    `,
  });
}

export async function enviarEmailConfirmacaoReserva({
  nome,
  email,
  equipamento,
  dataInicio,
  dataFim,
  total,
  entrega,
}: {
  nome: string;
  email: string;
  equipamento: string;
  dataInicio: Date;
  dataFim: Date;
  total: number;
  entrega: boolean;
}) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reserva realizada com sucesso! 📦",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <div style="background:#1D9E75;padding:32px;text-align:center;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:24px">AlugaFácil</h1>
          <p style="color:#9FE1CB;margin:8px 0 0;font-size:13px">Reserva confirmada</p>
        </div>
        <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px">
          <h2 style="color:#111827;font-size:18px;margin:0 0 12px">Olá, ${nome}!</h2>
          <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 20px">
            Sua reserva foi realizada com sucesso e está aguardando confirmação.
          </p>
          <div style="background:white;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:20px">
            <p style="margin:0 0 8px;font-size:13px;color:#6b7280">Equipamento</p>
            <p style="margin:0 0 16px;font-size:15px;font-weight:600;color:#111827">${equipamento}</p>
            <div style="display:flex;gap:16px">
              <div>
                <p style="margin:0 0 4px;font-size:12px;color:#6b7280">Início</p>
                <p style="margin:0;font-size:14px;color:#111827">${dataInicio.toLocaleDateString("pt-BR")}</p>
              </div>
              <div>
                <p style="margin:0 0 4px;font-size:12px;color:#6b7280">Devolução</p>
                <p style="margin:0;font-size:14px;color:#111827">${dataFim.toLocaleDateString("pt-BR")}</p>
              </div>
              <div>
                <p style="margin:0 0 4px;font-size:12px;color:#6b7280">Modalidade</p>
                <p style="margin:0;font-size:14px;color:#111827">${entrega ? "Entrega" : "Retirada"}</p>
              </div>
            </div>
            <div style="border-top:1px solid #e5e7eb;margin-top:16px;padding-top:16px">
              <p style="margin:0;font-size:15px;font-weight:600;color:#1D9E75">Total: R$ ${total.toFixed(2)}</p>
            </div>
          </div>
          <a href="${process.env.NEXTAUTH_URL}/minha-conta"
            style="display:inline-block;background:#1D9E75;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500">
            Ver minha conta
          </a>
          <p style="color:#9ca3af;font-size:12px;margin:24px 0 0">
            AlugaFácil — Locação de ferramentas & máquinas
          </p>
        </div>
      </div>
    `,
  });
}

export async function enviarEmailReservaConfirmada(
  nome: string,
  email: string,
  equipamento: string,
) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Sua reserva foi confirmada! ✅",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <div style="background:#1D9E75;padding:32px;text-align:center;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:24px">AlugaFácil</h1>
        </div>
        <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px">
          <h2 style="color:#111827;font-size:18px;margin:0 0 12px">Reserva confirmada! ✅</h2>
          <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 20px">
            Olá, <strong>${nome}</strong>! Sua reserva do equipamento
            <strong>${equipamento}</strong> foi confirmada pela nossa equipe.
            Em breve entraremos em contato com mais detalhes.
          </p>
          <a href="${process.env.NEXTAUTH_URL}/minha-conta"
            style="display:inline-block;background:#1D9E75;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500">
            Ver minha conta
          </a>
          <p style="color:#9ca3af;font-size:12px;margin:24px 0 0">
            AlugaFácil — Locação de ferramentas & máquinas
          </p>
        </div>
      </div>
    `,
  });
}

export async function enviarEmailLembreteDevulucao(
  nome: string,
  email: string,
  equipamento: string,
  dataFim: Date,
) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Lembrete: devolução do equipamento amanhã ⏰",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <div style="background:#f59e0b;padding:32px;text-align:center;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:24px">AlugaFácil</h1>
          <p style="color:white;margin:8px 0 0;opacity:0.9;font-size:13px">Lembrete de devolução</p>
        </div>
        <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px">
          <h2 style="color:#111827;font-size:18px;margin:0 0 12px">Olá, ${nome}!</h2>
          <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 20px">
            Este é um lembrete de que o equipamento <strong>${equipamento}</strong>
            deve ser devolvido amanhã, <strong>${dataFim.toLocaleDateString("pt-BR")}</strong>.
          </p>
          <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 20px">
            Por favor, certifique-se de devolver o equipamento no prazo para evitar cobranças adicionais.
          </p>
          <a href="${process.env.NEXTAUTH_URL}/minha-conta"
            style="display:inline-block;background:#1D9E75;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500">
            Ver minha conta
          </a>
          <p style="color:#9ca3af;font-size:12px;margin:24px 0 0">
            AlugaFácil — Locação de ferramentas & máquinas
          </p>
        </div>
      </div>
    `,
  });
}

export async function enviarEmailReservaCancelada(
  nome: string,
  email: string,
  equipamento: string,
) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reserva cancelada ❌",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <div style="background:#ef4444;padding:32px;text-align:center;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:24px">AlugaFácil</h1>
          <p style="color:white;margin:8px 0 0;opacity:0.9;font-size:13px">Reserva cancelada</p>
        </div>
        <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px">
          <h2 style="color:#111827;font-size:18px;margin:0 0 12px">Olá, ${nome}!</h2>
          <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 20px">
            Infelizmente sua reserva do equipamento <strong>${equipamento}</strong>
            foi cancelada. Se você tiver dúvidas, entre em contato conosco.
          </p>
          <a href="${process.env.NEXTAUTH_URL}/equipamentos"
            style="display:inline-block;background:#1D9E75;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500">
            Ver outros equipamentos
          </a>
          <p style="color:#9ca3af;font-size:12px;margin:24px 0 0">
            AlugaFácil — Locação de ferramentas & máquinas
          </p>
        </div>
      </div>
    `,
  });
}