export async function onRequestPost({ request }) {
  const contentType = request.headers.get("content-type") || "";

  if (!contentType.toLowerCase().startsWith("multipart/form-data;")) {
    return json({ error: "Content-Type harus multipart/form-data." }, 400);
  }

  try {
    const upstreamHeaders = new Headers();
    upstreamHeaders.set("content-type", contentType);
    upstreamHeaders.set("accept", "application/json");
    upstreamHeaders.set("user-agent", "Mozilla/5.0");

    const upstream = await fetch("https://videy.co/api/upload", {
      method: "POST",
      headers: upstreamHeaders,
      body: request.body
    });

    const text = await upstream.text();
    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { raw: text };
    }

    if (!upstream.ok) {
      return json({
        error: "Videy menolak upload.",
        upstream: payload
      }, upstream.status);
    }

    return json(payload, 200);
  } catch (error) {
    return json({
      error: "Proxy upload gagal.",
      detail: error instanceof Error ? error.message : String(error)
    }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      ...corsHeaders()
    }
  });
}

function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "Content-Type"
  };
}
