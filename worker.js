export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/upload-video") {
      return handleUploadVideo(request);
    }

    return env.ASSETS.fetch(request);
  }
};

async function handleUploadVideo(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders()
    });
  }

  if (request.method !== "POST") {
    return json({ error: "Method tidak diizinkan." }, 405);
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data;")) {
    return json({ error: "Content-Type harus multipart/form-data." }, 400);
  }

  try {
    const upstream = await fetch("https://videy.co/api/upload", {
      method: "POST",
      headers: {
        "content-type": contentType,
        "accept": "application/json",
        "user-agent": "Mozilla/5.0"
      },
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
