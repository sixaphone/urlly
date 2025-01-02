"use server";

export async function generateUrl(
  prevState: { short: string; long: string },
  formData: FormData
) {
  const URL_REGEX = /^(http|https):\/\/[^ "]+$/;
  const url = formData.get("url") as string;

  if (!URL_REGEX.test(url)) {
    return {
      short: "#",
      long: "#",
      message: "Please enter a valid URL",
    };
  }

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

  console.log({ shortened, lengthened });

  return {
    short: shortened.url,
    long: lengthened.url,
  };
}
