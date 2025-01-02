"use server";

const params = new URLSearchParams({
  // UTM parameters (Google Analytics)
  utm_source: ["google", "facebook", "twitter", "linkedin"][
    Math.floor(Math.random() * 4)
  ],
  utm_medium: ["cpc", "social", "email", "display"][
    Math.floor(Math.random() * 4)
  ],
  utm_campaign: `campaign_${
    Math.floor(Math.random() * (100_000 - 1_000)) + 1_000
  }`,
  utm_content: ["button_1", "banner_top", "sidebar_right"][
    Math.floor(Math.random() * 3)
  ],
  utm_term: ["product_launch", "summer_sale", "black_friday"][
    Math.floor(Math.random() * 3)
  ],

  // Session and user tracking
  sid: `sess_${Math.random().toString(36).substring(2, 15)}`,
  uid: `user_${Math.random().toString(36).substring(2, 15)}`,

  // Device and platform info
  device: ["desktop", "mobile", "tablet"][Math.floor(Math.random() * 3)],
  platform: ["ios", "android", "web"][Math.floor(Math.random() * 3)],

  // Referrer info
  ref: ["direct", "organic", "paid"][Math.floor(Math.random() * 3)],

  // Time info
  t: Date.now().toString(),

  // A/B testing
  variant: ["A", "B", "control"][Math.floor(Math.random() * 3)],

  // Custom parameters
  hotel: "trivago",
  flight: "skyscanner",
  car: "rentalcars",
});

console.log(params.toString());

export async function generateUrl(
  _prevState: { short: string; long: string },
  formData: FormData
) {
  const url = formData.get("url") as string;

  const apiUrl = process.env.API_URL;

  const body = JSON.stringify({ url });
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const [shortenRes, lengthenRes] = await Promise.allSettled([
    fetch(`${apiUrl}/shorten`, {
      body,
      headers,
      method: "POST",
    }),
    fetch(`${apiUrl}/lengthen`, {
      body,
      headers,

      method: "POST",
    }),
  ]);

  if (shortenRes.status === "rejected" || lengthenRes.status === "rejected") {
    return {
      message: "An error occurred. Please try again later",
      short: "#",
      long: "#",
    };
  }

  const [shortened, lengthened] = await Promise.all([
    shortenRes.value.json(),
    lengthenRes.value.json(),
  ]);

  if (shortened.error || lengthened.error) {
    const error = shortened.message ?? lengthened.message;
    return {
      message: error[0],
      short: "#",
      long: "#",
    };
  }

  return {
    short: shortened.url,
    long: `${lengthened.url}?${params.toString()}`,
  };
}
