import { UNMONITORED_INDIAN_CITY_COORDINATES } from './indianCityCoordinates';

export type SupportedAqiCityKey = string;

export interface IndianCityEntry {
  city: string;
  state: string;
  isUT?: boolean;
  aliases?: string[];
  aqiDbKey?: SupportedAqiCityKey;
}

export const AQI_LOCATION_MESSAGES = {
  EMPTY: 'Please enter or select an Indian location.',
  NON_INDIAN: 'Only Indian locations are supported in this AQI module.',
  NOT_FOUND: 'Location not found. Please enter a valid Indian city name.',
  DATA_UNAVAILABLE: 'AQI data is currently unavailable for this location. Please select another location.',
  VIRTUAL_ESTIMATE_UNAVAILABLE:
    'A reliable Virtual Sensor AQI estimate cannot currently be produced for this Indian location due to insufficient nearby CPCB reference stations within the validated airshed boundary.',
} as const;

export type LocationValidationStatus =
  | 'SUPPORTED'
  | 'VIRTUAL_CANDIDATE'
  | 'DATA_UNAVAILABLE'
  | 'NON_INDIAN'
  | 'NOT_FOUND'
  | 'EMPTY';

export interface IndianLocationValidation {
  status: LocationValidationStatus;
  valid: boolean;
  hasAqiData: boolean;
  isVirtualCandidate?: boolean;
  message: string | null;
  cityEntry?: IndianCityEntry;
  aqiDbKey?: SupportedAqiCityKey;
  coordinates?: { lat: number; lng: number };
}

export function getUnmonitoredCityCoordinates(
  city: string,
  state: string
): { lat: number; lng: number } | null {
  const key = `${city.toLowerCase().trim()}|${state.toLowerCase().trim()}`;
  return UNMONITORED_INDIAN_CITY_COORDINATES[key] || null;
}

/**
 * Comprehensive directory of Indian cities across all 28 States and 8 Union Territories.
 * Only cities backed by the existing CPCB/TROPOMI station data source carry an `aqiDbKey`.
 */
export const INDIAN_CITIES: IndianCityEntry[] = [
  // ================= KARNATAKA =================
  { city: 'Bengaluru', state: 'Karnataka', aliases: ['bangalore', 'bengaluru urban'], aqiDbKey: 'bengaluru' },
  { city: 'Mysuru', state: 'Karnataka', aliases: ['mysore'], aqiDbKey: 'mysuru' },
  { city: 'Mangaluru', state: 'Karnataka', aliases: ['mangalore'], aqiDbKey: 'mangaluru' },
  { city: 'Hubballi', state: 'Karnataka', aliases: ['hubli', 'hubballi dharwad', 'hubli dharwad'], aqiDbKey: 'hubballi' },
  { city: 'Dharwad', state: 'Karnataka', aqiDbKey: 'dharwad' },
  { city: 'Belagavi', state: 'Karnataka', aliases: ['belgaum'], aqiDbKey: 'belagavi' },
  { city: 'Kalaburagi', state: 'Karnataka', aliases: ['gulbarga'], aqiDbKey: 'kalaburagi' },
  { city: 'Davanagere', state: 'Karnataka', aliases: ['davangere'], aqiDbKey: 'davanagere' },
  { city: 'Ballari', state: 'Karnataka', aliases: ['bellary'], aqiDbKey: 'ballari' },
  { city: 'Vijayapura', state: 'Karnataka', aliases: ['bijapur'], aqiDbKey: 'vijayapura' },
  { city: 'Shivamogga', state: 'Karnataka', aliases: ['shimoga'], aqiDbKey: 'shivamogga' },
  { city: 'Tumakuru', state: 'Karnataka', aliases: ['tumkur'], aqiDbKey: 'tumakuru' },
  { city: 'Raichur', state: 'Karnataka', aqiDbKey: 'raichur' },
  { city: 'Bidar', state: 'Karnataka', aqiDbKey: 'bidar' },
  { city: 'Udupi', state: 'Karnataka', aqiDbKey: 'udupi' },
  { city: 'Hassan', state: 'Karnataka', aqiDbKey: 'hassan' },
  { city: 'Chitradurga', state: 'Karnataka' },
  { city: 'Kolar', state: 'Karnataka' },
  { city: 'Mandya', state: 'Karnataka' },
  { city: 'Chikkamagaluru', state: 'Karnataka', aliases: ['chikmagalur'], aqiDbKey: 'chikkamagaluru' },
  { city: 'Karwar', state: 'Karnataka' },
  { city: 'Bagalkote', state: 'Karnataka', aliases: ['bagalkot'] },
  { city: 'Madikeri', state: 'Karnataka', aliases: ['coorg', 'kodagu'] },
  { city: 'Hosapete', state: 'Karnataka', aliases: ['hospet'] },
  { city: 'Gadag', state: 'Karnataka', aliases: ['gadag betageri'] },
  { city: 'Yadgir', state: 'Karnataka' },
  { city: 'Koppal', state: 'Karnataka' },
  { city: 'Haveri', state: 'Karnataka' },
  { city: 'Chamarajanagar', state: 'Karnataka' },
  { city: 'Ramanagara', state: 'Karnataka' },
  { city: 'Chikkaballapur', state: 'Karnataka' },

  // ================= DELHI (UT) =================
  { city: 'New Delhi', state: 'Delhi', isUT: true, aliases: ['delhi', 'delhi ncr', 'ncr'], aqiDbKey: 'delhi' },
  { city: 'Dwarka', state: 'Delhi', isUT: true, aqiDbKey: 'dwarka_dl' },
  { city: 'Rohini', state: 'Delhi', isUT: true, aqiDbKey: 'rohini' },
  { city: 'Shahdara', state: 'Delhi', isUT: true, aqiDbKey: 'shahdara' },

  // ================= MAHARASHTRA =================
  { city: 'Mumbai', state: 'Maharashtra', aliases: ['bombay', 'greater mumbai'], aqiDbKey: 'mumbai' },
  { city: 'Pune', state: 'Maharashtra', aliases: ['poona'], aqiDbKey: 'pune' },
  { city: 'Nagpur', state: 'Maharashtra', aqiDbKey: 'nagpur' },
  { city: 'Thane', state: 'Maharashtra', aqiDbKey: 'thane' },
  { city: 'Nashik', state: 'Maharashtra', aliases: ['nasik'], aqiDbKey: 'nashik' },
  { city: 'Navi Mumbai', state: 'Maharashtra', aqiDbKey: 'navi_mumbai' },
  { city: 'Pimpri-Chinchwad', state: 'Maharashtra', aliases: ['pimpri chinchwad', 'pimpri', 'chinchwad'], aqiDbKey: 'pimpri_chinchwad' },
  { city: 'Kalyan-Dombivli', state: 'Maharashtra', aliases: ['kalyan', 'dombivli'] },
  { city: 'Vasai-Virar', state: 'Maharashtra', aliases: ['vasai', 'virar'] },
  { city: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', aliases: ['aurangabad'], aqiDbKey: 'aurangabad' },
  { city: 'Solapur', state: 'Maharashtra', aliases: ['sholapur'], aqiDbKey: 'solapur' },
  { city: 'Kolhapur', state: 'Maharashtra', aqiDbKey: 'kolhapur' },
  { city: 'Amravati', state: 'Maharashtra', aqiDbKey: 'amravati' },
  { city: 'Nanded', state: 'Maharashtra' },
  { city: 'Sangli', state: 'Maharashtra' },
  { city: 'Jalgaon', state: 'Maharashtra' },
  { city: 'Akola', state: 'Maharashtra' },
  { city: 'Latur', state: 'Maharashtra' },
  { city: 'Dhule', state: 'Maharashtra' },
  { city: 'Ahilyanagar', state: 'Maharashtra', aliases: ['ahmednagar'] },
  { city: 'Chandrapur', state: 'Maharashtra', aqiDbKey: 'chandrapur' },
  { city: 'Parbhani', state: 'Maharashtra' },
  { city: 'Jalna', state: 'Maharashtra' },
  { city: 'Bhiwandi', state: 'Maharashtra' },
  { city: 'Mira-Bhayandar', state: 'Maharashtra', aliases: ['mira bhayandar'] },
  { city: 'Satara', state: 'Maharashtra' },
  { city: 'Ratnagiri', state: 'Maharashtra' },
  { city: 'Wardha', state: 'Maharashtra' },
  { city: 'Yavatmal', state: 'Maharashtra' },
  { city: 'Dharashiv', state: 'Maharashtra', aliases: ['osmanabad'] },
  { city: 'Beed', state: 'Maharashtra' },
  { city: 'Gondia', state: 'Maharashtra' },
  { city: 'Baramati', state: 'Maharashtra' },

  // ================= TELANGANA =================
  { city: 'Hyderabad', state: 'Telangana', aliases: ['cyberabad'], aqiDbKey: 'hyderabad' },
  { city: 'Secunderabad', state: 'Telangana', aqiDbKey: 'secunderabad' },
  { city: 'Warangal', state: 'Telangana', aqiDbKey: 'warangal' },
  { city: 'Nizamabad', state: 'Telangana' },
  { city: 'Karimnagar', state: 'Telangana' },
  { city: 'Khammam', state: 'Telangana' },
  { city: 'Ramagundam', state: 'Telangana' },
  { city: 'Mahabubnagar', state: 'Telangana' },
  { city: 'Nalgonda', state: 'Telangana' },
  { city: 'Adilabad', state: 'Telangana' },
  { city: 'Suryapet', state: 'Telangana' },
  { city: 'Siddipet', state: 'Telangana' },
  { city: 'Miryalaguda', state: 'Telangana' },
  { city: 'Mancherial', state: 'Telangana' },
  { city: 'Kothagudem', state: 'Telangana' },

  // ================= WEST BENGAL =================
  { city: 'Kolkata', state: 'West Bengal', aliases: ['calcutta'], aqiDbKey: 'kolkata' },
  { city: 'Howrah', state: 'West Bengal', aliases: ['haora'], aqiDbKey: 'howrah' },
  { city: 'Siliguri', state: 'West Bengal', aqiDbKey: 'siliguri' },
  { city: 'Durgapur', state: 'West Bengal', aqiDbKey: 'durgapur' },
  { city: 'Asansol', state: 'West Bengal', aqiDbKey: 'asansol' },
  { city: 'Bardhaman', state: 'West Bengal', aliases: ['burdwan'] },
  { city: 'Malda', state: 'West Bengal', aliases: ['english bazar'] },
  { city: 'Baharampur', state: 'West Bengal', aliases: ['berhampore'] },
  { city: 'Kharagpur', state: 'West Bengal' },
  { city: 'Haldia', state: 'West Bengal', aqiDbKey: 'haldia' },
  { city: 'Darjeeling', state: 'West Bengal' },
  { city: 'Jalpaiguri', state: 'West Bengal' },
  { city: 'Cooch Behar', state: 'West Bengal', aliases: ['koch bihar'] },
  { city: 'Bankura', state: 'West Bengal' },
  { city: 'Purulia', state: 'West Bengal' },
  { city: 'Medinipur', state: 'West Bengal', aliases: ['midnapore'] },
  { city: 'Krishnanagar', state: 'West Bengal' },
  { city: 'Kalyani', state: 'West Bengal' },
  { city: 'Raiganj', state: 'West Bengal' },
  { city: 'Balurghat', state: 'West Bengal' },
  { city: 'Alipurduar', state: 'West Bengal' },

  // ================= TAMIL NADU =================
  { city: 'Chennai', state: 'Tamil Nadu', aliases: ['madras'], aqiDbKey: 'chennai' },
  { city: 'Coimbatore', state: 'Tamil Nadu', aliases: ['kovai'], aqiDbKey: 'coimbatore' },
  { city: 'Madurai', state: 'Tamil Nadu', aqiDbKey: 'madurai' },
  { city: 'Tiruchirappalli', state: 'Tamil Nadu', aliases: ['trichy'], aqiDbKey: 'tiruchirappalli' },
  { city: 'Salem', state: 'Tamil Nadu', aqiDbKey: 'salem' },
  { city: 'Tirunelveli', state: 'Tamil Nadu', aliases: ['tinnevelly'] },
  { city: 'Tiruppur', state: 'Tamil Nadu', aliases: ['tirupur'], aqiDbKey: 'tiruppur' },
  { city: 'Vellore', state: 'Tamil Nadu', aqiDbKey: 'vellore' },
  { city: 'Erode', state: 'Tamil Nadu' },
  { city: 'Thoothukudi', state: 'Tamil Nadu', aliases: ['tuticorin'], aqiDbKey: 'thoothukudi' },
  { city: 'Dindigul', state: 'Tamil Nadu' },
  { city: 'Thanjavur', state: 'Tamil Nadu', aliases: ['tanjore'] },
  { city: 'Hosur', state: 'Tamil Nadu' },
  { city: 'Nagercoil', state: 'Tamil Nadu' },
  { city: 'Kanchipuram', state: 'Tamil Nadu', aliases: ['kanjeevaram'] },
  { city: 'Udhagamandalam', state: 'Tamil Nadu', aliases: ['ooty'] },
  { city: 'Karur', state: 'Tamil Nadu' },
  { city: 'Cuddalore', state: 'Tamil Nadu' },
  { city: 'Kumbakonam', state: 'Tamil Nadu' },
  { city: 'Tiruvannamalai', state: 'Tamil Nadu' },
  { city: 'Sivakasi', state: 'Tamil Nadu' },
  { city: 'Nagapattinam', state: 'Tamil Nadu' },
  { city: 'Rameswaram', state: 'Tamil Nadu' },
  { city: 'Kodaikanal', state: 'Tamil Nadu' },

  // ================= ANDHRA PRADESH =================
  { city: 'Visakhapatnam', state: 'Andhra Pradesh', aliases: ['vizag', 'waltair'], aqiDbKey: 'visakhapatnam' },
  { city: 'Vijayawada', state: 'Andhra Pradesh', aliases: ['bezawada'], aqiDbKey: 'vijayawada' },
  { city: 'Amaravati', state: 'Andhra Pradesh', aqiDbKey: 'amaravati' },
  { city: 'Guntur', state: 'Andhra Pradesh', aqiDbKey: 'guntur' },
  { city: 'Nellore', state: 'Andhra Pradesh' },
  { city: 'Kurnool', state: 'Andhra Pradesh' },
  { city: 'Tirupati', state: 'Andhra Pradesh', aqiDbKey: 'tirupati' },
  { city: 'Rajamahendravaram', state: 'Andhra Pradesh', aliases: ['rajahmundry'], aqiDbKey: 'rajamahendravaram' },
  { city: 'Kakinada', state: 'Andhra Pradesh' },
  { city: 'Kadapa', state: 'Andhra Pradesh', aliases: ['cuddapah'] },
  { city: 'Anantapur', state: 'Andhra Pradesh', aliases: ['ananthapuramu'] },
  { city: 'Eluru', state: 'Andhra Pradesh' },
  { city: 'Ongole', state: 'Andhra Pradesh' },
  { city: 'Vizianagaram', state: 'Andhra Pradesh' },
  { city: 'Srikakulam', state: 'Andhra Pradesh' },
  { city: 'Chittoor', state: 'Andhra Pradesh' },
  { city: 'Machilipatnam', state: 'Andhra Pradesh' },

  // ================= ARUNACHAL PRADESH =================
  { city: 'Itanagar', state: 'Arunachal Pradesh', aqiDbKey: 'itanagar' },
  { city: 'Naharlagun', state: 'Arunachal Pradesh' },
  { city: 'Pasighat', state: 'Arunachal Pradesh' },
  { city: 'Tawang', state: 'Arunachal Pradesh' },
  { city: 'Ziro', state: 'Arunachal Pradesh' },
  { city: 'Bomdila', state: 'Arunachal Pradesh' },
  { city: 'Tezu', state: 'Arunachal Pradesh' },
  { city: 'Roing', state: 'Arunachal Pradesh' },
  { city: 'Aalo', state: 'Arunachal Pradesh', aliases: ['along'] },

  // ================= ASSAM =================
  { city: 'Guwahati', state: 'Assam', aliases: ['gauhati'], aqiDbKey: 'guwahati' },
  { city: 'Dispur', state: 'Assam' },
  { city: 'Silchar', state: 'Assam', aqiDbKey: 'silchar' },
  { city: 'Dibrugarh', state: 'Assam', aqiDbKey: 'dibrugarh' },
  { city: 'Jorhat', state: 'Assam' },
  { city: 'Nagaon', state: 'Assam', aliases: ['nowgong'] },
  { city: 'Tinsukia', state: 'Assam' },
  { city: 'Tezpur', state: 'Assam' },
  { city: 'Bongaigaon', state: 'Assam' },
  { city: 'Sivasagar', state: 'Assam', aliases: ['sibsagar'] },
  { city: 'Dhubri', state: 'Assam' },
  { city: 'Diphu', state: 'Assam' },
  { city: 'Karimganj', state: 'Assam' },
  { city: 'Goalpara', state: 'Assam' },

  // ================= BIHAR =================
  { city: 'Patna', state: 'Bihar', aqiDbKey: 'patna' },
  { city: 'Gaya', state: 'Bihar', aqiDbKey: 'gaya' },
  { city: 'Bhagalpur', state: 'Bihar', aqiDbKey: 'bhagalpur' },
  { city: 'Muzaffarpur', state: 'Bihar', aqiDbKey: 'muzaffarpur' },
  { city: 'Purnia', state: 'Bihar', aliases: ['purnea'] },
  { city: 'Darbhanga', state: 'Bihar' },
  { city: 'Bihar Sharif', state: 'Bihar' },
  { city: 'Arrah', state: 'Bihar', aliases: ['ara'] },
  { city: 'Begusarai', state: 'Bihar' },
  { city: 'Katihar', state: 'Bihar' },
  { city: 'Munger', state: 'Bihar', aliases: ['monghyr'] },
  { city: 'Chhapra', state: 'Bihar', aliases: ['chapra'] },
  { city: 'Hajipur', state: 'Bihar' },
  { city: 'Sasaram', state: 'Bihar' },
  { city: 'Motihari', state: 'Bihar' },
  { city: 'Samastipur', state: 'Bihar' },
  { city: 'Bettiah', state: 'Bihar' },
  { city: 'Saharsa', state: 'Bihar' },
  { city: 'Siwan', state: 'Bihar' },
  { city: 'Rajgir', state: 'Bihar' },
  { city: 'Nalanda', state: 'Bihar' },

  // ================= CHHATTISGARH =================
  { city: 'Raipur', state: 'Chhattisgarh', aqiDbKey: 'raipur' },
  { city: 'Nava Raipur', state: 'Chhattisgarh', aliases: ['naya raipur'] },
  { city: 'Bhilai', state: 'Chhattisgarh', aqiDbKey: 'bhilai' },
  { city: 'Durg', state: 'Chhattisgarh' },
  { city: 'Bilaspur', state: 'Chhattisgarh', aqiDbKey: 'bilaspur_cg' },
  { city: 'Korba', state: 'Chhattisgarh', aqiDbKey: 'korba' },
  { city: 'Rajnandgaon', state: 'Chhattisgarh' },
  { city: 'Raigarh', state: 'Chhattisgarh' },
  { city: 'Jagdalpur', state: 'Chhattisgarh' },
  { city: 'Ambikapur', state: 'Chhattisgarh' },
  { city: 'Dhamtari', state: 'Chhattisgarh' },
  { city: 'Mahasamund', state: 'Chhattisgarh' },

  // ================= GOA =================
  { city: 'Panaji', state: 'Goa', aliases: ['panjim'], aqiDbKey: 'panaji' },
  { city: 'Margao', state: 'Goa', aliases: ['madgaon'] },
  { city: 'Vasco da Gama', state: 'Goa', aliases: ['vasco'], aqiDbKey: 'vasco' },
  { city: 'Mapusa', state: 'Goa' },
  { city: 'Ponda', state: 'Goa' },
  { city: 'Bicholim', state: 'Goa' },

  // ================= GUJARAT =================
  { city: 'Ahmedabad', state: 'Gujarat', aliases: ['amdavad'], aqiDbKey: 'ahmedabad' },
  { city: 'Gandhinagar', state: 'Gujarat', aqiDbKey: 'gandhinagar' },
  { city: 'Surat', state: 'Gujarat', aqiDbKey: 'surat' },
  { city: 'Vadodara', state: 'Gujarat', aliases: ['baroda'], aqiDbKey: 'vadodara' },
  { city: 'Rajkot', state: 'Gujarat', aqiDbKey: 'rajkot' },
  { city: 'Bhavnagar', state: 'Gujarat' },
  { city: 'Jamnagar', state: 'Gujarat' },
  { city: 'Junagadh', state: 'Gujarat' },
  { city: 'Anand', state: 'Gujarat' },
  { city: 'Navsari', state: 'Gujarat' },
  { city: 'Morbi', state: 'Gujarat' },
  { city: 'Nadiad', state: 'Gujarat' },
  { city: 'Bharuch', state: 'Gujarat', aliases: ['broach'] },
  { city: 'Ankleshwar', state: 'Gujarat', aqiDbKey: 'ankleshwar' },
  { city: 'Mehsana', state: 'Gujarat', aliases: ['mahesana'] },
  { city: 'Bhuj', state: 'Gujarat' },
  { city: 'Gandhidham', state: 'Gujarat' },
  { city: 'Porbandar', state: 'Gujarat' },
  { city: 'Palanpur', state: 'Gujarat' },
  { city: 'Valsad', state: 'Gujarat', aliases: ['bulsar'] },
  { city: 'Vapi', state: 'Gujarat' },
  { city: 'Surendranagar', state: 'Gujarat' },
  { city: 'Patan', state: 'Gujarat' },
  { city: 'Dwarka', state: 'Gujarat' },

  // ================= HARYANA =================
  { city: 'Gurugram', state: 'Haryana', aliases: ['gurgaon'], aqiDbKey: 'gurugram' },
  { city: 'Faridabad', state: 'Haryana', aqiDbKey: 'faridabad' },
  { city: 'Panipat', state: 'Haryana', aqiDbKey: 'panipat' },
  { city: 'Ambala', state: 'Haryana', aqiDbKey: 'ambala' },
  { city: 'Panchkula', state: 'Haryana', aqiDbKey: 'panchkula' },
  { city: 'Karnal', state: 'Haryana' },
  { city: 'Rohtak', state: 'Haryana', aqiDbKey: 'rohtak' },
  { city: 'Hisar', state: 'Haryana', aliases: ['hissar'] },
  { city: 'Sonipat', state: 'Haryana', aliases: ['sonepat'] },
  { city: 'Yamunanagar', state: 'Haryana' },
  { city: 'Kurukshetra', state: 'Haryana', aliases: ['thanesar'] },
  { city: 'Bhiwani', state: 'Haryana' },
  { city: 'Sirsa', state: 'Haryana' },
  { city: 'Bahadurgarh', state: 'Haryana' },
  { city: 'Jind', state: 'Haryana' },
  { city: 'Rewari', state: 'Haryana' },
  { city: 'Palwal', state: 'Haryana' },
  { city: 'Kaithal', state: 'Haryana' },

  // ================= HIMACHAL PRADESH =================
  { city: 'Shimla', state: 'Himachal Pradesh', aliases: ['simla'], aqiDbKey: 'shimla' },
  { city: 'Dharamshala', state: 'Himachal Pradesh', aliases: ['dharamsala'], aqiDbKey: 'dharamshala' },
  { city: 'Manali', state: 'Himachal Pradesh' },
  { city: 'Kullu', state: 'Himachal Pradesh' },
  { city: 'Solan', state: 'Himachal Pradesh' },
  { city: 'Mandi', state: 'Himachal Pradesh' },
  { city: 'Baddi', state: 'Himachal Pradesh', aqiDbKey: 'baddi' },
  { city: 'Palampur', state: 'Himachal Pradesh' },
  { city: 'Hamirpur', state: 'Himachal Pradesh' },
  { city: 'Una', state: 'Himachal Pradesh' },
  { city: 'Bilaspur', state: 'Himachal Pradesh' },
  { city: 'Chamba', state: 'Himachal Pradesh' },
  { city: 'Dalhousie', state: 'Himachal Pradesh' },
  { city: 'Nahan', state: 'Himachal Pradesh' },
  { city: 'Kangra', state: 'Himachal Pradesh' },

  // ================= JHARKHAND =================
  { city: 'Ranchi', state: 'Jharkhand', aqiDbKey: 'ranchi' },
  { city: 'Jamshedpur', state: 'Jharkhand', aliases: ['tatanagar'], aqiDbKey: 'jamshedpur' },
  { city: 'Dhanbad', state: 'Jharkhand', aqiDbKey: 'dhanbad' },
  { city: 'Bokaro Steel City', state: 'Jharkhand', aliases: ['bokaro'], aqiDbKey: 'bokaro' },
  { city: 'Deoghar', state: 'Jharkhand' },
  { city: 'Hazaribagh', state: 'Jharkhand' },
  { city: 'Giridih', state: 'Jharkhand' },
  { city: 'Ramgarh', state: 'Jharkhand' },
  { city: 'Dumka', state: 'Jharkhand' },
  { city: 'Medininagar', state: 'Jharkhand', aliases: ['daltonganj'] },
  { city: 'Chaibasa', state: 'Jharkhand' },

  // ================= KERALA =================
  { city: 'Thiruvananthapuram', state: 'Kerala', aliases: ['trivandrum'], aqiDbKey: 'thiruvananthapuram' },
  { city: 'Kochi', state: 'Kerala', aliases: ['cochin', 'ernakulam'], aqiDbKey: 'kochi' },
  { city: 'Kozhikode', state: 'Kerala', aliases: ['calicut'], aqiDbKey: 'kozhikode' },
  { city: 'Thrissur', state: 'Kerala', aliases: ['trichur'], aqiDbKey: 'thrissur' },
  { city: 'Kollam', state: 'Kerala', aliases: ['quilon'], aqiDbKey: 'kollam' },
  { city: 'Palakkad', state: 'Kerala', aliases: ['palghat'] },
  { city: 'Alappuzha', state: 'Kerala', aliases: ['alleppey'] },
  { city: 'Kannur', state: 'Kerala', aliases: ['cannanore'] },
  { city: 'Kottayam', state: 'Kerala' },
  { city: 'Malappuram', state: 'Kerala' },
  { city: 'Kasaragod', state: 'Kerala' },
  { city: 'Pathanamthitta', state: 'Kerala' },
  { city: 'Kalpetta', state: 'Kerala', aliases: ['wayanad'] },
  { city: 'Munnar', state: 'Kerala' },
  { city: 'Thalassery', state: 'Kerala', aliases: ['tellicherry'] },

  // ================= MADHYA PRADESH =================
  { city: 'Bhopal', state: 'Madhya Pradesh', aqiDbKey: 'bhopal' },
  { city: 'Indore', state: 'Madhya Pradesh', aqiDbKey: 'indore' },
  { city: 'Jabalpur', state: 'Madhya Pradesh', aqiDbKey: 'jabalpur' },
  { city: 'Gwalior', state: 'Madhya Pradesh', aqiDbKey: 'gwalior' },
  { city: 'Ujjain', state: 'Madhya Pradesh', aqiDbKey: 'ujjain' },
  { city: 'Sagar', state: 'Madhya Pradesh' },
  { city: 'Dewas', state: 'Madhya Pradesh' },
  { city: 'Satna', state: 'Madhya Pradesh' },
  { city: 'Ratlam', state: 'Madhya Pradesh' },
  { city: 'Rewa', state: 'Madhya Pradesh' },
  { city: 'Katni', state: 'Madhya Pradesh', aliases: ['murwara'] },
  { city: 'Singrauli', state: 'Madhya Pradesh', aqiDbKey: 'singrauli' },
  { city: 'Burhanpur', state: 'Madhya Pradesh' },
  { city: 'Khandwa', state: 'Madhya Pradesh' },
  { city: 'Chhindwara', state: 'Madhya Pradesh' },
  { city: 'Bhind', state: 'Madhya Pradesh' },
  { city: 'Guna', state: 'Madhya Pradesh' },
  { city: 'Shivpuri', state: 'Madhya Pradesh' },
  { city: 'Vidisha', state: 'Madhya Pradesh' },
  { city: 'Chhatarpur', state: 'Madhya Pradesh' },
  { city: 'Mandsaur', state: 'Madhya Pradesh' },
  { city: 'Narmadapuram', state: 'Madhya Pradesh', aliases: ['hoshangabad'] },

  // ================= MANIPUR =================
  { city: 'Imphal', state: 'Manipur', aqiDbKey: 'imphal' },
  { city: 'Thoubal', state: 'Manipur' },
  { city: 'Bishnupur', state: 'Manipur' },
  { city: 'Churachandpur', state: 'Manipur' },
  { city: 'Ukhrul', state: 'Manipur' },
  { city: 'Kakching', state: 'Manipur' },

  // ================= MEGHALAYA =================
  { city: 'Shillong', state: 'Meghalaya', aqiDbKey: 'shillong' },
  { city: 'Tura', state: 'Meghalaya' },
  { city: 'Jowai', state: 'Meghalaya' },
  { city: 'Nongstoin', state: 'Meghalaya' },
  { city: 'Nongpoh', state: 'Meghalaya' },
  { city: 'Cherrapunji', state: 'Meghalaya', aliases: ['sohra'] },

  // ================= MIZORAM =================
  { city: 'Aizawl', state: 'Mizoram', aqiDbKey: 'aizawl' },
  { city: 'Lunglei', state: 'Mizoram' },
  { city: 'Champhai', state: 'Mizoram' },
  { city: 'Kolasib', state: 'Mizoram' },
  { city: 'Serchhip', state: 'Mizoram' },
  { city: 'Saiha', state: 'Mizoram', aliases: ['siaha'] },

  // ================= NAGALAND =================
  { city: 'Kohima', state: 'Nagaland', aqiDbKey: 'kohima' },
  { city: 'Dimapur', state: 'Nagaland', aqiDbKey: 'dimapur' },
  { city: 'Mokokchung', state: 'Nagaland' },
  { city: 'Tuensang', state: 'Nagaland' },
  { city: 'Wokha', state: 'Nagaland' },
  { city: 'Zunheboto', state: 'Nagaland' },
  { city: 'Mon', state: 'Nagaland' },

  // ================= ODISHA =================
  { city: 'Bhubaneswar', state: 'Odisha', aqiDbKey: 'bhubaneswar' },
  { city: 'Cuttack', state: 'Odisha', aqiDbKey: 'cuttack' },
  { city: 'Rourkela', state: 'Odisha', aqiDbKey: 'rourkela' },
  { city: 'Berhampur', state: 'Odisha', aliases: ['brahmapur'] },
  { city: 'Sambalpur', state: 'Odisha' },
  { city: 'Puri', state: 'Odisha' },
  { city: 'Balasore', state: 'Odisha', aliases: ['baleshwar'] },
  { city: 'Bhadrak', state: 'Odisha' },
  { city: 'Baripada', state: 'Odisha' },
  { city: 'Jharsuguda', state: 'Odisha' },
  { city: 'Angul', state: 'Odisha', aqiDbKey: 'angul' },
  { city: 'Paradip', state: 'Odisha', aliases: ['paradeep'] },
  { city: 'Koraput', state: 'Odisha' },
  { city: 'Jeypore', state: 'Odisha' },

  // ================= PUNJAB =================
  { city: 'Ludhiana', state: 'Punjab', aqiDbKey: 'ludhiana' },
  { city: 'Amritsar', state: 'Punjab', aqiDbKey: 'amritsar' },
  { city: 'Jalandhar', state: 'Punjab', aliases: ['jullundur'], aqiDbKey: 'jalandhar' },
  { city: 'Patiala', state: 'Punjab', aqiDbKey: 'patiala' },
  { city: 'Bathinda', state: 'Punjab', aliases: ['bhatinda'], aqiDbKey: 'bathinda' },
  { city: 'Mohali', state: 'Punjab', aliases: ['sas nagar', 'sahibzada ajit singh nagar'] },
  { city: 'Hoshiarpur', state: 'Punjab' },
  { city: 'Pathankot', state: 'Punjab' },
  { city: 'Moga', state: 'Punjab' },
  { city: 'Batala', state: 'Punjab' },
  { city: 'Phagwara', state: 'Punjab' },
  { city: 'Kapurthala', state: 'Punjab' },
  { city: 'Firozpur', state: 'Punjab', aliases: ['ferozepur'] },
  { city: 'Rupnagar', state: 'Punjab', aliases: ['ropar'] },
  { city: 'Sangrur', state: 'Punjab' },
  { city: 'Barnala', state: 'Punjab' },

  // ================= RAJASTHAN =================
  { city: 'Jaipur', state: 'Rajasthan', aqiDbKey: 'jaipur' },
  { city: 'Jodhpur', state: 'Rajasthan', aqiDbKey: 'jodhpur' },
  { city: 'Kota', state: 'Rajasthan', aqiDbKey: 'kota' },
  { city: 'Bikaner', state: 'Rajasthan', aqiDbKey: 'bikaner' },
  { city: 'Udaipur', state: 'Rajasthan', aqiDbKey: 'udaipur' },
  { city: 'Ajmer', state: 'Rajasthan', aqiDbKey: 'ajmer' },
  { city: 'Bhilwara', state: 'Rajasthan' },
  { city: 'Alwar', state: 'Rajasthan' },
  { city: 'Bharatpur', state: 'Rajasthan' },
  { city: 'Sikar', state: 'Rajasthan' },
  { city: 'Pali', state: 'Rajasthan' },
  { city: 'Sri Ganganagar', state: 'Rajasthan', aliases: ['ganganagar'] },
  { city: 'Jaisalmer', state: 'Rajasthan' },
  { city: 'Barmer', state: 'Rajasthan' },
  { city: 'Chittorgarh', state: 'Rajasthan' },
  { city: 'Sawai Madhopur', state: 'Rajasthan' },
  { city: 'Mount Abu', state: 'Rajasthan' },
  { city: 'Jhunjhunu', state: 'Rajasthan' },
  { city: 'Churu', state: 'Rajasthan' },
  { city: 'Hanumangarh', state: 'Rajasthan' },
  { city: 'Tonk', state: 'Rajasthan' },
  { city: 'Kishangarh', state: 'Rajasthan' },

  // ================= SIKKIM =================
  { city: 'Gangtok', state: 'Sikkim', aqiDbKey: 'gangtok' },
  { city: 'Namchi', state: 'Sikkim' },
  { city: 'Gyalshing', state: 'Sikkim', aliases: ['gezing'] },
  { city: 'Mangan', state: 'Sikkim' },
  { city: 'Rangpo', state: 'Sikkim' },
  { city: 'Pelling', state: 'Sikkim' },

  // ================= TRIPURA =================
  { city: 'Agartala', state: 'Tripura', aqiDbKey: 'agartala' },
  { city: 'Dharmanagar', state: 'Tripura' },
  { city: 'Udaipur', state: 'Tripura' },
  { city: 'Kailashahar', state: 'Tripura' },
  { city: 'Belonia', state: 'Tripura' },
  { city: 'Khowai', state: 'Tripura' },

  // ================= UTTAR PRADESH =================
  { city: 'Lucknow', state: 'Uttar Pradesh', aqiDbKey: 'lucknow' },
  { city: 'Kanpur', state: 'Uttar Pradesh', aliases: ['cawnpore'], aqiDbKey: 'kanpur' },
  { city: 'Noida', state: 'Uttar Pradesh', aqiDbKey: 'noida' },
  { city: 'Greater Noida', state: 'Uttar Pradesh', aqiDbKey: 'greater_noida' },
  { city: 'Ghaziabad', state: 'Uttar Pradesh', aqiDbKey: 'ghaziabad' },
  { city: 'Agra', state: 'Uttar Pradesh', aqiDbKey: 'agra' },
  { city: 'Varanasi', state: 'Uttar Pradesh', aliases: ['banaras', 'benares', 'kashi'], aqiDbKey: 'varanasi' },
  { city: 'Prayagraj', state: 'Uttar Pradesh', aliases: ['allahabad'], aqiDbKey: 'prayagraj' },
  { city: 'Meerut', state: 'Uttar Pradesh', aqiDbKey: 'meerut' },
  { city: 'Bareilly', state: 'Uttar Pradesh' },
  { city: 'Aligarh', state: 'Uttar Pradesh' },
  { city: 'Moradabad', state: 'Uttar Pradesh' },
  { city: 'Saharanpur', state: 'Uttar Pradesh' },
  { city: 'Gorakhpur', state: 'Uttar Pradesh', aqiDbKey: 'gorakhpur' },
  { city: 'Ayodhya', state: 'Uttar Pradesh', aliases: ['faizabad'] },
  { city: 'Jhansi', state: 'Uttar Pradesh' },
  { city: 'Mathura', state: 'Uttar Pradesh' },
  { city: 'Vrindavan', state: 'Uttar Pradesh' },
  { city: 'Firozabad', state: 'Uttar Pradesh' },
  { city: 'Muzaffarnagar', state: 'Uttar Pradesh' },
  { city: 'Shahjahanpur', state: 'Uttar Pradesh' },
  { city: 'Rampur', state: 'Uttar Pradesh' },
  { city: 'Hapur', state: 'Uttar Pradesh' },
  { city: 'Etawah', state: 'Uttar Pradesh' },
  { city: 'Mirzapur', state: 'Uttar Pradesh' },
  { city: 'Bulandshahr', state: 'Uttar Pradesh' },
  { city: 'Raebareli', state: 'Uttar Pradesh' },
  { city: 'Sitapur', state: 'Uttar Pradesh' },
  { city: 'Jaunpur', state: 'Uttar Pradesh' },
  { city: 'Azamgarh', state: 'Uttar Pradesh' },
  { city: 'Basti', state: 'Uttar Pradesh' },
  { city: 'Sultanpur', state: 'Uttar Pradesh' },

  // ================= UTTARAKHAND =================
  { city: 'Dehradun', state: 'Uttarakhand', aqiDbKey: 'dehradun' },
  { city: 'Haridwar', state: 'Uttarakhand', aqiDbKey: 'haridwar' },
  { city: 'Rishikesh', state: 'Uttarakhand', aqiDbKey: 'rishikesh' },
  { city: 'Haldwani', state: 'Uttarakhand' },
  { city: 'Roorkee', state: 'Uttarakhand' },
  { city: 'Rudrapur', state: 'Uttarakhand' },
  { city: 'Kashipur', state: 'Uttarakhand' },
  { city: 'Nainital', state: 'Uttarakhand' },
  { city: 'Mussoorie', state: 'Uttarakhand' },
  { city: 'Almora', state: 'Uttarakhand' },
  { city: 'Pithoragarh', state: 'Uttarakhand' },
  { city: 'Tehri', state: 'Uttarakhand' },

  // ================= UNION TERRITORIES (Remaining 7) =================
  // 1. Andaman and Nicobar Islands
  { city: 'Port Blair', state: 'Andaman and Nicobar Islands', isUT: true, aliases: ['sri vijaya puram'], aqiDbKey: 'port_blair' },
  { city: 'Diglipur', state: 'Andaman and Nicobar Islands', isUT: true },
  { city: 'Car Nicobar', state: 'Andaman and Nicobar Islands', isUT: true },

  // 2. Chandigarh
  { city: 'Chandigarh', state: 'Chandigarh', isUT: true, aqiDbKey: 'chandigarh' },

  // 3. Dadra and Nagar Haveli and Daman and Diu
  { city: 'Daman', state: 'Dadra and Nagar Haveli and Daman and Diu', isUT: true, aqiDbKey: 'daman' },
  { city: 'Diu', state: 'Dadra and Nagar Haveli and Daman and Diu', isUT: true },
  { city: 'Silvassa', state: 'Dadra and Nagar Haveli and Daman and Diu', isUT: true, aqiDbKey: 'silvassa' },

  // 4. Jammu and Kashmir
  { city: 'Srinagar', state: 'Jammu and Kashmir', isUT: true, aqiDbKey: 'srinagar' },
  { city: 'Jammu', state: 'Jammu and Kashmir', isUT: true, aqiDbKey: 'jammu' },
  { city: 'Anantnag', state: 'Jammu and Kashmir', isUT: true },
  { city: 'Baramulla', state: 'Jammu and Kashmir', isUT: true },
  { city: 'Udhampur', state: 'Jammu and Kashmir', isUT: true },
  { city: 'Kathua', state: 'Jammu and Kashmir', isUT: true },
  { city: 'Sopore', state: 'Jammu and Kashmir', isUT: true },
  { city: 'Pahalgam', state: 'Jammu and Kashmir', isUT: true },
  { city: 'Gulmarg', state: 'Jammu and Kashmir', isUT: true },
  { city: 'Pulwama', state: 'Jammu and Kashmir', isUT: true },

  // 5. Ladakh
  { city: 'Leh', state: 'Ladakh', isUT: true, aqiDbKey: 'leh' },
  { city: 'Kargil', state: 'Ladakh', isUT: true },
  { city: 'Diskit', state: 'Ladakh', isUT: true },

  // 6. Lakshadweep
  { city: 'Kavaratti', state: 'Lakshadweep', isUT: true },
  { city: 'Agatti', state: 'Lakshadweep', isUT: true },
  { city: 'Minicoy', state: 'Lakshadweep', isUT: true },

  // 7. Puducherry
  { city: 'Puducherry', state: 'Puducherry', isUT: true, aliases: ['pondicherry', 'pondy'], aqiDbKey: 'puducherry' },
  { city: 'Karaikal', state: 'Puducherry', isUT: true },
  { city: 'Mahe', state: 'Puducherry', isUT: true },
  { city: 'Yanam', state: 'Puducherry', isUT: true },
];

const STATE_ALIASES: Record<string, string> = {
  ka: 'karnataka',
  dl: 'delhi',
  'nct of delhi': 'delhi',
  mh: 'maharashtra',
  ts: 'telangana',
  tg: 'telangana',
  wb: 'west bengal',
  tn: 'tamil nadu',
  ap: 'andhra pradesh',
  ar: 'arunachal pradesh',
  as: 'assam',
  br: 'bihar',
  cg: 'chhattisgarh',
  ct: 'chhattisgarh',
  ga: 'goa',
  gj: 'gujarat',
  hr: 'haryana',
  hp: 'himachal pradesh',
  jh: 'jharkhand',
  kl: 'kerala',
  mp: 'madhya pradesh',
  mn: 'manipur',
  ml: 'meghalaya',
  mz: 'mizoram',
  nl: 'nagaland',
  od: 'odisha',
  or: 'odisha',
  orissa: 'odisha',
  pb: 'punjab',
  rj: 'rajasthan',
  sk: 'sikkim',
  tr: 'tripura',
  up: 'uttar pradesh',
  uk: 'uttarakhand',
  ut: 'uttarakhand',
  uttaranchal: 'uttarakhand',
  an: 'andaman and nicobar islands',
  'andaman and nicobar': 'andaman and nicobar islands',
  'andaman & nicobar islands': 'andaman and nicobar islands',
  'andaman & nicobar': 'andaman and nicobar islands',
  ch: 'chandigarh',
  dn: 'dadra and nagar haveli and daman and diu',
  dd: 'dadra and nagar haveli and daman and diu',
  'daman and diu': 'dadra and nagar haveli and daman and diu',
  'dadra and nagar haveli': 'dadra and nagar haveli and daman and diu',
  jk: 'jammu and kashmir',
  'j&k': 'jammu and kashmir',
  'jammu & kashmir': 'jammu and kashmir',
  la: 'ladakh',
  ld: 'lakshadweep',
  py: 'puducherry',
  pondicherry: 'puducherry',
};

/**
 * Recognized non-Indian countries, territories, US states, and major international cities
 * so non-Indian inputs strictly produce: "Only Indian locations are supported in this AQI module."
 */
const NON_INDIAN_COUNTRIES_AND_REGIONS = new Set([
  'united kingdom', 'uk', 'great britain', 'england', 'scotland', 'wales', 'northern ireland',
  'united states', 'usa', 'us', 'america', 'united states of america',
  'california', 'texas', 'florida', 'new york', 'illinois', 'pennsylvania', 'ohio', 'georgia',
  'michigan', 'north carolina', 'new jersey', 'virginia', 'washington', 'arizona', 'massachusetts',
  'tennessee', 'indiana', 'missouri', 'maryland', 'wisconsin', 'colorado', 'minnesota', 'oregon',
  'nevada', 'hawaii', 'alaska', 'ontario', 'quebec', 'british columbia', 'alberta',
  'japan', 'china', 'pakistan', 'bangladesh', 'sri lanka', 'nepal', 'bhutan', 'maldives',
  'afghanistan', 'myanmar', 'burma', 'russia', 'germany', 'france', 'italy', 'spain',
  'canada', 'australia', 'new zealand', 'brazil', 'argentina', 'mexico', 'chile', 'colombia', 'peru',
  'south africa', 'egypt', 'nigeria', 'kenya', 'morocco', 'ethiopia', 'ghana', 'tanzania',
  'uae', 'united arab emirates', 'saudi arabia', 'qatar', 'kuwait', 'oman', 'bahrain',
  'iran', 'iraq', 'israel', 'jordan', 'lebanon', 'syria', 'yemen', 'turkey', 'turkiye',
  'thailand', 'indonesia', 'malaysia', 'philippines', 'vietnam', 'cambodia', 'laos', 'brunei',
  'singapore', 'south korea', 'korea', 'north korea', 'taiwan', 'hong kong', 'macau', 'mongolia',
  'switzerland', 'netherlands', 'holland', 'belgium', 'sweden', 'norway', 'denmark', 'finland',
  'iceland', 'poland', 'austria', 'greece', 'portugal', 'ireland', 'czechia', 'czech republic',
  'hungary', 'romania', 'bulgaria', 'ukraine', 'serbia', 'croatia', 'slovakia', 'slovenia',
  'kazakhstan', 'uzbekistan', 'turkmenistan', 'kyrgyzstan', 'tajikistan', 'azerbaijan', 'armenia',
  'europe', 'africa', 'antarctica', 'north america', 'south america',
]);

const NON_INDIAN_CITIES = new Set([
  // UK & Europe
  'london', 'manchester', 'birmingham', 'leeds', 'glasgow', 'liverpool', 'newcastle', 'sheffield',
  'bristol', 'edinburgh', 'cardiff', 'belfast', 'oxford', 'cambridge', 'nottingham', 'southampton',
  'paris', 'marseille', 'lyon', 'toulouse', 'nice', 'nantes', 'strasbourg', 'bordeaux', 'lille',
  'berlin', 'hamburg', 'munich', 'cologne', 'frankfurt', 'stuttgart', 'dusseldorf', 'leipzig', 'dortmund',
  'rome', 'milan', 'naples', 'turin', 'palermo', 'genoa', 'bologna', 'florence', 'venice', 'verona',
  'madrid', 'barcelona', 'valencia', 'seville', 'zaragoza', 'malaga', 'bilbao',
  'amsterdam', 'rotterdam', 'the hague', 'utrecht', 'eindhoven',
  'brussels', 'antwerp', 'ghent', 'bruges',
  'vienna', 'salzburg', 'graz', 'innsbruck',
  'zurich', 'geneva', 'basel', 'bern', 'lausanne',
  'stockholm', 'gothenburg', 'malmo', 'oslo', 'bergen', 'copenhagen', 'helsinki',
  'dublin', 'cork', 'galway', 'lisbon', 'porto', 'athens', 'thessaloniki',
  'warsaw', 'krakow', 'wroclaw', 'gdansk', 'prague', 'budapest', 'bucharest', 'sofia',
  'belgrade', 'zagreb', 'ljubljana', 'bratislava', 'kyiv', 'kiev',
  'moscow', 'saint petersburg', 'st petersburg', 'novosibirsk', 'yekaterinburg',
  'istanbul', 'ankara', 'izmir', 'antalya', 'reykjavik', 'luxembourg', 'monaco',

  // East & Southeast Asia
  'tokyo', 'yokohama', 'osaka', 'nagoya', 'sapporo', 'fukuoka', 'kobe', 'kyoto', 'hiroshima', 'sendai',
  'beijing', 'shanghai', 'guangzhou', 'shenzhen', 'chengdu', 'chongqing', 'tianjin', 'wuhan', 'xian',
  'hangzhou', 'nanjing', 'suzhou', 'harbin', 'qingdao', 'dalian', 'zhengzhou', 'peking',
  'taipei', 'kaohsiung', 'taichung', 'seoul', 'busan', 'incheon', 'daegu', 'daejeon', 'gwangju', 'pyongyang',
  'bangkok', 'chiang mai', 'phuket', 'pattaya',
  'jakarta', 'surabaya', 'bandung', 'medan', 'bali', 'denpasar',
  'kuala lumpur', 'george town', 'penang', 'johor bahru',
  'manila', 'quezon city', 'cebu', 'davao',
  'ho chi minh city', 'saigon', 'hanoi', 'da nang',
  'phnom penh', 'siem reap', 'vientiane', 'yangon', 'rangoon', 'mandalay', 'naypyidaw', 'ulaanbaatar',
  'tashkent', 'almaty', 'astana', 'bishkek', 'baku', 'tbilisi',

  // South Asia (Non-Indian)
  'karachi', 'lahore', 'faisalabad', 'rawalpindi', 'gujranwala', 'peshawar', 'multan', 'islamabad',
  'quetta', 'sialkot', 'bahawalpur', 'sargodha', 'abbottabad', 'gwadar',
  'dhaka', 'dacca', 'chattogram', 'chittagong', 'khulna', 'rajshahi', 'sylhet', 'barishal', 'rangpur', 'comilla',
  'colombo', 'kandy', 'galle', 'jaffna', 'negombo', 'trincomalee',
  'kathmandu', 'pokhara', 'lalitpur', 'biratnagar', 'birgunj', 'janakpur',
  'thimphu', 'paro', 'phuentsholing', 'male', 'kabul', 'kandahar', 'herat',

  // Middle East
  'dubai', 'abu dhabi', 'sharjah', 'ajman', 'al ain', 'ras al khaimah',
  'riyadh', 'jeddah', 'mecca', 'makkah', 'medina', 'madinah', 'dammam',
  'doha', 'kuwait city', 'muscat', 'salalah', 'manama',
  'tehran', 'mashhad', 'isfahan', 'shiraz', 'tabriz',
  'baghdad', 'basra', 'erbil', 'mosul', 'amman', 'beirut', 'damascus', 'aleppo', 'sanaa',
  'tel aviv', 'jerusalem', 'haifa',

  // Americas
  'new york city', 'nyc', 'los angeles', 'chicago', 'houston', 'phoenix', 'philadelphia',
  'san antonio', 'san diego', 'dallas', 'san jose', 'austin', 'jacksonville', 'san francisco',
  'columbus', 'indianapolis', 'seattle', 'denver', 'washington dc', 'boston', 'nashville',
  'detroit', 'portland', 'las vegas', 'memphis', 'baltimore', 'milwaukee', 'atlanta', 'miami',
  'orlando', 'tampa', 'minneapolis', 'cleveland', 'new orleans', 'honolulu', 'anchorage',
  'toronto', 'montreal', 'vancouver', 'calgary', 'edmonton', 'ottawa', 'winnipeg', 'halifax',
  'mexico city', 'guadalajara', 'monterrey', 'cancun', 'tijuana', 'havana',
  'sao paulo', 'rio de janeiro', 'brasilia', 'salvador', 'fortaleza', 'belo horizonte', 'manaus',
  'buenos aires', 'cordoba', 'rosario', 'mendoza', 'santiago', 'valparaiso',
  'lima', 'cusco', 'bogota', 'medellin', 'cali', 'cartagena', 'caracas', 'quito', 'guayaquil',
  'la paz', 'montevideo', 'asuncion', 'panama city',

  // Oceania & Africa
  'sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'gold coast', 'canberra', 'hobart', 'darwin',
  'auckland', 'wellington', 'christchurch', 'queenstown', 'suva', 'port moresby',
  'cairo', 'alexandria', 'giza', 'lagos', 'abuja', 'kano', 'johannesburg', 'cape town', 'durban',
  'pretoria', 'nairobi', 'mombasa', 'addis ababa', 'casablanca', 'rabat', 'marrakech', 'algiers',
  'tunis', 'tripoli', 'accra', 'dakar', 'kampala', 'dar es salaam', 'kigali', 'lusaka', 'harare',
]);

function normalizeToken(value: string): string {
  return value
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeStateName(value: string): string {
  const norm = normalizeToken(value);
  return STATE_ALIASES[norm] || norm;
}

// Build fast exact-lookup map from normalized city name & aliases -> matching IndianCityEntry[]
const CITY_LOOKUP_MAP = new Map<string, IndianCityEntry[]>();
for (const entry of INDIAN_CITIES) {
  const keys = new Set<string>([
    normalizeToken(entry.city),
    normalizeToken(entry.city.replace(/-/g, ' ')),
    ...(entry.aliases || []).map(normalizeToken),
  ]);

  for (const key of keys) {
    const existing = CITY_LOOKUP_MAP.get(key) || [];
    existing.push(entry);
    CITY_LOOKUP_MAP.set(key, existing);
  }
}

/**
 * Strictly validates a user-entered location string for the Indian-only AQI module.
 * - Rejects empty input
 * - Rejects non-Indian cities & countries
 * - Rejects misspelled names, state-only inputs, and random text
 * - Distinguishes valid Indian cities with AQI data vs valid Indian cities without AQI data
 */
export function validateIndianLocation(rawInput: string): IndianLocationValidation {
  const trimmed = (rawInput || '').trim();
  if (!trimmed) {
    return {
      status: 'EMPTY',
      valid: false,
      hasAqiData: false,
      message: AQI_LOCATION_MESSAGES.EMPTY,
    };
  }

  // Split by comma (e.g. "Bengaluru, Karnataka", "Bengaluru, India", "London, United Kingdom")
  const rawSegments = trimmed.split(',').map((s) => s.trim());
  if (rawSegments.some((s) => s.length === 0)) {
    return {
      status: 'NOT_FOUND',
      valid: false,
      hasAqiData: false,
      message: AQI_LOCATION_MESSAGES.NOT_FOUND,
    };
  }

  const segments = rawSegments.map(normalizeToken);
  const fullNormalized = normalizeToken(trimmed);

  // 1. Check if any qualifier segment explicitly names a non-Indian country or foreign region
  // (e.g. "London, United Kingdom", "Tokyo, Japan", "Hyderabad, Pakistan", "Delhi, USA")
  for (let i = 1; i < segments.length; i++) {
    const seg = segments[i];
    if (seg !== 'india' && seg !== 'bharat' && seg !== 'in') {
      if (NON_INDIAN_COUNTRIES_AND_REGIONS.has(seg) || NON_INDIAN_CITIES.has(seg)) {
        return {
          status: 'NON_INDIAN',
          valid: false,
          hasAqiData: false,
          message: AQI_LOCATION_MESSAGES.NON_INDIAN,
        };
      }
    }
  }

  // 2. Check exact match against Indian city directory
  const cityToken = segments[0];
  const candidates =
    CITY_LOOKUP_MAP.get(cityToken) ||
    CITY_LOOKUP_MAP.get(cityToken.replace(/-/g, ' '));

  if (candidates && candidates.length > 0 && segments.length <= 3) {
    let matchedEntry: IndianCityEntry | undefined;

    if (segments.length === 1) {
      // Prefer an entry with supported AQI data if multiple exist, otherwise first canonical entry
      matchedEntry = candidates.find((c) => c.aqiDbKey) || candidates[0];
    } else if (segments.length === 2) {
      const qual = segments[1];
      if (qual === 'india' || qual === 'bharat' || qual === 'in') {
        matchedEntry = candidates.find((c) => c.aqiDbKey) || candidates[0];
      } else {
        const normQualState = normalizeStateName(qual);
        matchedEntry = candidates.find(
          (c) => normalizeStateName(c.state) === normQualState
        );
      }
    } else if (segments.length === 3) {
      const stateQual = normalizeStateName(segments[1]);
      const countryQual = segments[2];
      if (countryQual === 'india' || countryQual === 'bharat' || countryQual === 'in') {
        matchedEntry = candidates.find(
          (c) => normalizeStateName(c.state) === stateQual
        );
      }
    }

    if (matchedEntry) {
      if (matchedEntry.aqiDbKey) {
        return {
          status: 'SUPPORTED',
          valid: true,
          hasAqiData: true,
          isVirtualCandidate: false,
          message: null,
          cityEntry: matchedEntry,
          aqiDbKey: matchedEntry.aqiDbKey,
        };
      }
      const coords = getUnmonitoredCityCoordinates(matchedEntry.city, matchedEntry.state);
      if (coords) {
        return {
          status: 'VIRTUAL_CANDIDATE',
          valid: true,
          hasAqiData: false,
          isVirtualCandidate: true,
          message: null,
          cityEntry: matchedEntry,
          coordinates: coords,
        };
      }
      return {
        status: 'DATA_UNAVAILABLE',
        valid: false,
        hasAqiData: false,
        isVirtualCandidate: false,
        message: AQI_LOCATION_MESSAGES.DATA_UNAVAILABLE,
        cityEntry: matchedEntry,
      };
    }
  }

  // 3. Check if the entered location is a non-Indian city or country
  if (
    NON_INDIAN_CITIES.has(fullNormalized) ||
    NON_INDIAN_COUNTRIES_AND_REGIONS.has(fullNormalized) ||
    NON_INDIAN_CITIES.has(cityToken) ||
    NON_INDIAN_COUNTRIES_AND_REGIONS.has(cityToken)
  ) {
    return {
      status: 'NON_INDIAN',
      valid: false,
      hasAqiData: false,
      message: AQI_LOCATION_MESSAGES.NON_INDIAN,
    };
  }

  // 4. Otherwise: misspelled Indian city, state-only name, random text, or unknown location
  return {
    status: 'NOT_FOUND',
    valid: false,
    hasAqiData: false,
    message: AQI_LOCATION_MESSAGES.NOT_FOUND,
  };
}

/**
 * Checks whether a raster filename explicitly references a non-Indian city or country.
 */
export function containsNonIndianLocationToken(filename: string): boolean {
  const words = filename
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .split(/[^a-z]+/)
    .filter((w) => w.length >= 3);

  for (const w of words) {
    // Skip words that are also Indian cities
    if (CITY_LOOKUP_MAP.has(w)) continue;
    if (NON_INDIAN_CITIES.has(w) || NON_INDIAN_COUNTRIES_AND_REGIONS.has(w)) {
      return true;
    }
  }
  return false;
}

/**
 * Searches Indian cities across all 28 States and 8 Union Territories for autocomplete suggestions.
 */
export function searchIndianCities(query: string, limit = 40): IndianCityEntry[] {
  const norm = normalizeToken(query);

  if (!norm) {
    // Show primary metro stations first, followed by all paired CPCB + Sentinel-5P stations, then other Indian cities
    const primaryKeys = new Set(['bengaluru', 'delhi', 'mumbai', 'hyderabad', 'kolkata', 'chennai']);
    const primary = INDIAN_CITIES.filter((c) => c.aqiDbKey && primaryKeys.has(c.aqiDbKey));
    const otherSupported = INDIAN_CITIES.filter((c) => c.aqiDbKey && !primaryKeys.has(c.aqiDbKey));
    const supported = [...primary, ...otherSupported];
    const remaining = Math.max(0, limit - supported.length);
    const others = remaining > 0 ? INDIAN_CITIES.filter((c) => !c.aqiDbKey).slice(0, remaining) : [];
    return [...supported, ...others].slice(0, limit);
  }

  const queryCityPart = norm.split(',')[0].trim();

  const scored: Array<{ entry: IndianCityEntry; score: number }> = [];

  for (const entry of INDIAN_CITIES) {
    const cityNorm = normalizeToken(entry.city);
    const stateNorm = normalizeToken(entry.state);
    const fullStateLabel = `${cityNorm}, ${stateNorm}`;
    const fullIndiaLabel = `${cityNorm}, india`;
    const aliases = (entry.aliases || []).map(normalizeToken);

    let score = 0;

    if (cityNorm === norm || fullStateLabel === norm || fullIndiaLabel === norm) {
      score = 100;
    } else if (aliases.includes(norm) || aliases.includes(queryCityPart)) {
      score = 95;
    } else if (cityNorm.startsWith(norm) || cityNorm.startsWith(queryCityPart && norm)) {
      score = 85;
    } else if (aliases.some((a) => a.startsWith(norm))) {
      score = 80;
    } else if (stateNorm === norm || STATE_ALIASES[norm] === stateNorm) {
      score = 75;
    } else if (stateNorm.startsWith(norm)) {
      score = 70;
    } else if (fullStateLabel.includes(norm) || fullIndiaLabel.includes(norm)) {
      score = 60;
    } else if (aliases.some((a) => a.includes(norm))) {
      score = 50;
    }

    if (score > 0) {
      // Slight tie-breaker boost for stations with active AQI data
      if (entry.aqiDbKey) score += 2;
      scored.push({ entry, score });
    }
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.entry.city.localeCompare(b.entry.city);
  });

  return scored.slice(0, limit).map((s) => s.entry);
}
