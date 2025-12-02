export const REGIONS = [
  "Addis Ababa",
  "Amhara",
  "Oromia",
  "SNNPR",
  "Tigray",
  "Somali",
  "Afar",
  "Benishangul-Gumuz",
  "Gambela",
  "Harari",
]

export const ZONES: Record<string, string[]> = {
  "Addis Ababa": [
    "Addis Ketema",
    "Arada",
    "Bole",
    "Gulele",
    "Kirkos",
    "Kolfe Keranio",
    "Lideta",
    "Nifas Silk-Lafto",
    "Yeka",
  ],
  Amhara: ["North Wollo", "South Wollo", "North Shewa", "South Shewa", "East Gojjam", "West Gojjam", "Awi"],
  Oromia: [
    "East Hararghe",
    "West Hararghe",
    "North Shewa",
    "South Shewa",
    "West Shewa",
    "Arsi",
    "Bale",
    "Borana",
    "Guji",
  ],
  // Add more zones as needed
}

export const EDUCATION_LEVELS = ["High School", "Bachelor", "Master", "PhD", "Other"]

export const VOLUNTEER_TYPES = ["General", "Youth", "Professional", "Specialized", "Other"]

export const MEMBER_TYPES = ["Individual", "Family", "Institutional"]

export const DOCUMENT_TYPES = ["National ID", "Passport", "Driving License", "Other"]

export const FAMILY_MEMBER_RELATIONS = ["Spouse", "Child", "Parent", "Sibling", "Other"]
