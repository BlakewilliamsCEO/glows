export type GalleryItem = {
  id: string;
  city: string;
  address: string;
  beforeUrl: string;
  afterUrl: string;
};

export const GALLERY_ITEMS: GalleryItem[] = [
  // Zionsville
  {
    id: "zionsville-1",
    city: "Zionsville",
    address: "Windpointe Pass",
    beforeUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/sources/de7108eb-66a5-446d-8b24-117bdebc3d26.jpg",
    afterUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/renders/dc03b150-92c7-46a2-9bfd-e850c5353a42.png",
  },
  {
    id: "zionsville-2",
    city: "Zionsville",
    address: "Turkey Foot Rd",
    beforeUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/sources/c1de9bc7-5b47-4a8f-9ac3-e3f2acbf9c5a.jpg",
    afterUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/renders/a84f432b-0ef6-43e0-8c3e-841a34c12b8b.png",
  },
  {
    id: "zionsville-3",
    city: "Zionsville",
    address: "Ansley Ct",
    beforeUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/sources/0b8b1ebd-b5c6-436a-813e-e014a9f40394.jpg",
    afterUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/renders/b528b4cb-372e-4bad-ac3b-8a7042af9ba7.png",
  },
  {
    id: "zionsville-4",
    city: "Zionsville",
    address: "Stone Lake Dr",
    beforeUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/sources/aace21bd-3283-4c32-9ef6-4fe4c527189e.jpg",
    afterUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/renders/be757526-a090-4289-a232-871e6b29fc3c.png",
  },
  // Carmel
  {
    id: "carmel-1",
    city: "Carmel",
    address: "Stonegate Ct",
    beforeUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/sources/efc04d0d-50a9-4822-9ebe-e9d02cc86917.jpg",
    afterUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/renders/813f8ae5-e3ef-474b-b495-9b2bab249c1b.png",
  },
  {
    id: "carmel-2",
    city: "Carmel",
    address: "Brookstone Dr",
    beforeUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/sources/9da41a64-d933-4ccf-abe1-1716c450b174.jpg",
    afterUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/renders/5a421a81-78e8-446a-bf1c-c7da0d49e1cf.png",
  },
  {
    id: "carmel-3",
    city: "Carmel",
    address: "Larissa Pl",
    beforeUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/sources/1d9ad7bc-01b0-42a1-97f4-1dfcae878793.jpg",
    afterUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/renders/2f349c44-9614-4d3b-8989-a0592fccbab1.png",
  },
  {
    id: "carmel-4",
    city: "Carmel",
    address: "Simon Dr",
    beforeUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/sources/c3957e34-6bc5-4f52-acbb-618ee8b72925.jpg",
    afterUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/renders/e26420b4-53d0-4191-84ce-a2f48f6fb79f.png",
  },
  {
    id: "carmel-5",
    city: "Carmel",
    address: "Rix Ct",
    beforeUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/sources/311ac215-bf54-44b5-a0ba-4b343a650811.jpg",
    afterUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/renders/14befb1d-c893-40f6-a245-812f8141baa7.png",
  },
  // Westfield
  {
    id: "westfield-1",
    city: "Westfield",
    address: "Carlton Rd",
    beforeUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/sources/75035c2d-7233-4653-be68-f7064e4c0f4a.jpg",
    afterUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/renders/fec8c9b2-1fbd-4209-bd12-d4cdec4f1839.png",
  },
  {
    id: "westfield-2",
    city: "Westfield",
    address: "Hengist Dr",
    beforeUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/sources/9f0a12e1-0247-4804-a61a-3b5428cb33b2.jpg",
    afterUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/renders/ed1b55d6-797b-407c-847c-f75f011b84a8.png",
  },
  {
    id: "westfield-3",
    city: "Westfield",
    address: "Fairlands Dr",
    beforeUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/sources/523f997a-2688-4b35-be0f-583a52dd8c39.jpg",
    afterUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/renders/06e8ac60-baab-497a-99e0-161a1accf857.png",
  },
  // Noblesville
  {
    id: "noblesville-1",
    city: "Noblesville",
    address: "Wellington Overlook",
    beforeUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/sources/4e6f96c8-6fb8-46fc-a2a3-dd5e351eeb24.jpg",
    afterUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/renders/865653e6-3747-47ad-8192-2a935a49054d.png",
  },
  {
    id: "noblesville-2",
    city: "Noblesville",
    address: "Shore Oaks Ct",
    beforeUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/sources/52c99e67-a028-47f4-a364-00b69c1280ec.jpg",
    afterUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/renders/0ddc0669-269e-46e7-ad02-1098250e5bf5.png",
  },
  // Fishers
  {
    id: "fishers-1",
    city: "Fishers",
    address: "Water Ridge Dr",
    beforeUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/sources/f864410a-86ac-4d86-976f-633487e03864.jpg",
    afterUrl: "https://pub-2dc80e7c866c40e78cd9c276adc3fb09.r2.dev/renders/7704ea5a-add3-42c1-809c-438f1418cfd4.png",
  },
  // Placeholders — replace with real addresses
  {
    id: "placeholder-1",
    city: "Fishers",
    address: "Coming soon",
    beforeUrl: "",
    afterUrl: "",
  },
  {
    id: "placeholder-2",
    city: "Noblesville",
    address: "Coming soon",
    beforeUrl: "",
    afterUrl: "",
  },
  {
    id: "placeholder-3",
    city: "Fishers",
    address: "Coming soon",
    beforeUrl: "",
    afterUrl: "",
  },
];
