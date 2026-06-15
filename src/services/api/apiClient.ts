export const apiClient = {
  get: async (url: string) => {
    const res = await fetch(url);
    return res.json();
  },
  post: async (url: string, body: any) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  }
};
