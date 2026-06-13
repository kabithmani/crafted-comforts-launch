export const SITE = {
  whatsappNumber: "919663962020",
  callNumber: "+919663962020",
  phoneDisplay: "+91 96639 62020",
  email: "craftedcomfortlife@gmail.com",
  formEndpoint: "https://api.web3forms.com/submit",
  web3formsKey: "3d95349a-1271-41ef-b947-20c280ed8ccd",
  metaPixelId: "1145840866837977",
  ga4Id: "G-8X17DC4NN8",
  clarityId: "x6ab0nt3r1",
  websiteUrl: "https://www.craftedcomforts.life",
  studioAddress:
    "3092, Paramahansa Yogananda Rd, HAL 2nd Stage, Eshwara Layout, Indiranagar, Bengaluru, Karnataka 560008",
  instagram: "https://www.instagram.com/craftedcomfortslife",
  facebook: "https://www.facebook.com/CraftedComfortsLife",
};

export const waPrefill = (msg?: string) =>
  `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(
    msg ??
      "Hi Crafted Comforts — I'd like to book a consultation for my space. My name is ___ and the property is in ___.",
  )}`;

export const telHref = `tel:${SITE.callNumber}`;