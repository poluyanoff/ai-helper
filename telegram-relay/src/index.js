function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || "*";

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders(origin) });
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return new Response("Bad request", { status: 400, headers: corsHeaders(origin) });
    }

    const contact = (data.contact || "").toString().trim().slice(0, 500);
    if (!contact) {
      return new Response("Contact is required", { status: 400, headers: corsHeaders(origin) });
    }

    const text = `Новая заявка со Слот-лендинга:\n${contact}`;

    const tgResponse = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text,
        }),
      }
    );

    if (!tgResponse.ok) {
      return new Response("Failed to notify", { status: 502, headers: corsHeaders(origin) });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  },
};
