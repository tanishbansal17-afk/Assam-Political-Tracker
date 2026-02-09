export const ASSAM_DISTRICTS = [
    "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo",
    "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao",
    "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup",
    "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar",
    "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar",
    "Sonitpur", "South Salmara-Mankachar", "Tamulpur", "Tinsukia",
    "Udalguri", "West Karbi Anglong", "Bajali"
];

export const POLITICAL_KEYWORDS = [
    "BJP", "Congress", "AGP", "AIUDF", "UPPL", "BPF", "AASU", "KMSS",
    "Himanta", "Sarma", "Chief Minister", "CM", "Minister", "MLA", "MP",
    "Election", "Protest", "Memorandum", "Scheme", "Cabinet", "Government",
    "Policy", "Vote", "Poll", "Campaign", "Party", "Leader", "Strike", "Bandh"
];

export const EXCLUDE_KEYWORDS = [
    "Murder", "Killed", "Accident", "Rape", "Robbery", "Theft", "Drowned",
    "Fire", "Arrested", "Suicide", "Dead", "Injured", "Crash", "Collision",
    "Body found", "Loot", "Smuggling", "Drug", "Opium", "Ganja"
];

export function detectDistrict(text: string): string | undefined {
    // Check for exact matches first
    for (const district of ASSAM_DISTRICTS) {
        if (text.includes(district)) {
            return district;
        }
    }
    // Handle variations if needed, checking for 'Guwahati' -> Kamrup Metro
    if (text.includes("Guwahati")) return "Kamrup Metropolitan";

    return undefined;
}

export function isPolitical(text: string): boolean {
    const lowerText = text.toLowerCase();

    // 1. Check Exclusion
    for (const word of EXCLUDE_KEYWORDS) {
        if (lowerText.includes(word.toLowerCase())) return false;
    }

    // 2. Check Inclusion
    for (const word of POLITICAL_KEYWORDS) {
        if (lowerText.includes(word.toLowerCase())) return true;
    }

    return false;
}
