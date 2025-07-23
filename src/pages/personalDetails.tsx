import React, { useState } from "react";
import "./login.css";
import peopleBg from "../assets/people.svg";
import ProgressBar from "../components/ProgressBar";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  SelectChangeEvent,
  InputAdornment,
  ListSubheader,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSavePersonalDetailsMutation } from "../store/services/baseApi";
import Spinner from "../components/Spinner";

interface LoginPageProps {
  onSubmitApplication: (formData: PersonalDetailsForm) => void;
  onGoBack: () => void;
}

// Industries list
const INDUSTRIES = [
  { id: "1", name: "Technology" },
  { id: "2", name: "Banking & Finance" },
  { id: "3", name: "Healthcare" },
  { id: "4", name: "Education" },
  { id: "5", name: "Manufacturing" },
  { id: "6", name: "Retail" },
  { id: "7", name: "Oil & Gas" },
  { id: "8", name: "Telecommunications" },
  { id: "9", name: "Construction" },
  { id: "10", name: "Agriculture" },
];

// Employers list
export const EMPLOYERS = [
  {
    id: "1",
    name: "ABUBAKAR TAFAWA BALEWA UNIVERSITY TEACHING HOSPITAL BAUCHI",
  },
  { id: "2", name: "ADAMAWA STATE GOVERNMENT" },
  {
    id: "3",
    name: "ADAMAWA STATE GOVERNMENT PRIMARY HEALTH CARE AND DEVELOPMENT AGENCY",
  },
  { id: "4", name: "ADAMAWA STATE LEA SALARY E-PAYMENT" },
  { id: "5", name: "ADMINISTRATIVE STAFF COLLEGE OF NIGERIA" },
  { id: "6", name: "ADVERTISING PRACTIONERS OF NIGERIA" },
  {
    id: "7",
    name: "AGRICULTURAL RESEARCH AND MANAGEMENT INSTITUTE (ARMTI) - ILORIN",
  },
  { id: "8", name: "AGRICULTURAL RESEARCH COUNCIL OF NIGERIA" },
  {
    id: "9",
    name: "AGRO PROCESSING, PRODUCTIVITY ENHANCEMENT AND LIVELIHOOD IMPROVEMENT SUPPORT PROJECT (APPEALS)",
  },
  { id: "10", name: "AHMADU BELLO UNIVERSITY TEACHING HOSPITAL" },
  { id: "11", name: "AJAOKUTA STEEL COMPANY LIMITED" },
  { id: "12", name: "AMINU KANO UNIVERSITY TEACHING HOSPITAL" },
  { id: "13", name: "ANAMBRA/ IMO RBDA" },
  { id: "14", name: "ASSET MGT CORP OF NIGERIA" },
  { id: "15", name: "AUDITOR GENERAL FOR THE FEDERATION" },
  { id: "16", name: "BENIN/ OWENA RBDA" },
  { id: "17", name: "BOARD FOR TECHNOLOGY BUSINESS INCUBATOR CENTRE - ABUJA" },
  { id: "18", name: "BORDER COMMUNITIES DEVELOPMENT AGENCY (BCDA) HQTRS" },
  { id: "19", name: "BOVAS AND COMPANY LIMITED" },
  { id: "20", name: "CENTRE FOR BLACK AFRICAN ARTS AND CIVILISATION" },
  { id: "21", name: "CENTRE FOR MANAGEMENT DEVELOPMENT" },
  { id: "22", name: "CENTRE FOR MANAGEMENT DEVT STAFF MU" },
  { id: "23", name: "CHAD BASIN NATIONAL PARK" },
  { id: "24", name: "CHAD BASIN RBDA" },
  { id: "25", name: "CITIZENSHIP AND LEADERSHIP TRAINING CENTRE" },
  { id: "26", name: "COCOA RESEARCH INSTITUTE- IBADAN" },
  { id: "27", name: "CODE OF CONDUCT BUREAU" },
  { id: "28", name: "CODE OF CONDUCT TRIBUNAL" },
  {
    id: "29",
    name: "COLLEGE OF VETERINARY AND MEDICAL LABORATORY TECHNOLOGY - VOM",
  },
  { id: "30", name: "CORPORATE AFFAIRS COMMISSION" },
  { id: "31", name: "COUNCIL OF LEGAL EDUCATION" },
  { id: "32", name: "CROSS RIVER NATIONAL PARK" },
  { id: "33", name: "DEBT MANAGEMENT OFFICE" },
  { id: "34", name: "DEFENCE INDUSTRIES CORPORATION OF NIGERIA (DICON)" },
  { id: "35", name: "DIRECTORATE OF TECHNICAL COOP. IN AFRICA" },
  { id: "36", name: "ECONOMIC AND FINANCIAL CRIMES COMMISSION" },
  { id: "37", name: "ECONOMIC AND FINANCIAL CRIMES COMMISSION (EFCC)" },
  { id: "38", name: "ENERGY COMMISSION OF NIGERIA" },
  { id: "39", name: "ETCHE LOCAL GOVERNMENT COUNCIL" },
  { id: "40", name: "FEDERAL AIRPORTS AUTHORITY OF NIG" },
  { id: "41", name: "FEDERAL CHARACTER COMMISSION" },
  { id: "42", name: "FEDERAL CIVIL SERVICE COMMISSION" },
  { id: "43", name: "FEDERAL COLLEGE OF AGRICULTURE - ISHIAGU" },
  {
    id: "44",
    name: "FEDERAL COLLEGE OF AGRICULTURE, MOORE PLANTATION- IBADAN",
  },
  {
    id: "45",
    name: "FEDERAL COLLEGE OF ANIMAL HEALTH AND PRODUCTION TECHNOLOGY - IBADAN",
  },
  {
    id: "46",
    name: "FEDERAL COLLEGE OF ANIMAL HEALTH AND PRODUCTION TECHNOLOGY - VOM",
  },
  {
    id: "47",
    name: "FEDERAL COLLEGE OF COMPLEMENTARY AND ALTERNATIVE MEDICINE, NIGERIA",
  },
  { id: "48", name: "FEDERAL COLLEGE OF EDUCATION BICHI - 1000088" },
  { id: "49", name: "FEDERAL COLLEGE OF EDUCATION OBUDU" },
  { id: "50", name: "FEDERAL COLLEGE OF HORTICULTURE, DADIN-KOWA, GOMBE" },
  {
    id: "51",
    name: "FEDERAL COLLEGE OF LAND RESOURCES TECHNOLOGY, KURU - JOS",
  },
  {
    id: "52",
    name: "FEDERAL COLLEGE OF PRODUCE INSPECTION AND STORED PRODUCTS TECHNOLOGY, KANO",
  },
  { id: "53", name: "Federal Competition And Consumer Protection Commission" },
  { id: "54", name: "FEDERAL CO-OPERATIVE COLLEGE- OJI RIVER" },
  { id: "55", name: "FEDERAL FIRE SERVICE" },
  { id: "56", name: "Federal Inland Revenue Service (FIRS)" },
  { id: "57", name: "FEDERAL INSTITUTE OF INDUSTRIAL RESEARCH -OSHODI" },
  { id: "58", name: "FEDERAL MEDICAL CENTRE ABEOKUTA" },
  { id: "59", name: "FEDERAL MEDICAL CENTRE, AZARE BAUCHI" },
  { id: "60", name: "FEDERAL MEDICAL CENTRE, BAYELSA STATE" },
  { id: "61", name: "FEDERAL MEDICAL CENTRE, BIDA" },
  { id: "62", name: "FEDERAL MEDICAL CENTRE, EBUTE METTA" },
  { id: "63", name: "FEDERAL MEDICAL CENTRE, GUSAU ZAMFARA" },
  { id: "64", name: "FEDERAL MEDICAL CENTRE, JIGAWA STATE" },
  { id: "65", name: "FEDERAL MEDICAL CENTRE, KEBBI STATE" },
  { id: "66", name: "FEDERAL MEDICAL CENTRE, KOGI" },
  { id: "67", name: "FEDERAL MEDICAL CENTRE, MAKURDI" },
  { id: "68", name: "FEDERAL MEDICAL CENTRE, NASARAWA STATE" },
  { id: "69", name: "FEDERAL MEDICAL CENTRE, NGURU YOBE" },
  { id: "70", name: "FEDERAL MEDICAL CENTRE, OWERRI" },
  { id: "71", name: "FEDERAL MEDICAL CENTRE, OWO" },
  { id: "72", name: "FEDERAL MEDICAL CENTRE, TARABA STATE" },
  { id: "73", name: "FEDERAL MEDICAL CENTRE, UMUAHIA" },
  { id: "74", name: "FEDERAL MEDICAL CENTRE, YOLA ADAMAWA" },
  {
    id: "75",
    name: "FEDERAL MINISTRY OF AGRICULTURE AND RURAL DEVELOPMENT HQTRS",
  },
  { id: "76", name: "FEDERAL MINISTRY OF AVIATION" },
  { id: "77", name: "FEDERAL MINISTRY OF EDUCATION - HQTRS" },
  { id: "78", name: "FEDERAL MINISTRY OF ENVIRONMENT HEADQUARTERS" },
  {
    id: "79",
    name: "FEDERAL MINISTRY OF FINANCE BUDGET AND NATIONAL PLANNING AGRICULTURE FOR FOOD AND JOBS PLAN",
  },
  {
    id: "80",
    name: "FEDERAL MINISTRY OF FINANCE, BUDGET AND NATIONAL PLANNING - HQTRS",
  },
  { id: "81", name: "FEDERAL MINISTRY OF HEALTH - HQTRS" },
  {
    id: "82",
    name: "FEDERAL MINISTRY OF HUMANITARIAN AFFAIRS DISASTER MANAGEMENT AND SOCIAL DEVELOPMENT NATIONAL SOCIAL INVESTMENT PROGRAMME",
  },
  {
    id: "83",
    name: "FEDERAL MINISTRY OF HUMANITARIAN AFFAIRS, DISASTER MANAGEMENT AND SOCIAL DEVELOPMENT",
  },
  {
    id: "84",
    name: "FEDERAL MINISTRY OF INDUSTRY, TRADE AND INVESTMENT - HQTRS",
  },
  { id: "85", name: "FEDERAL MINISTRY OF INFORMATION & CULTURE - HQTRS" },
  { id: "86", name: "FEDERAL MINISTRY OF JUSTICE - HQTRS" },
  { id: "87", name: "FEDERAL MINISTRY OF LABOUR AND EMPLOYMENT - HQTRS" },
  { id: "88", name: "FEDERAL MINISTRY OF NIGER DELTA HQTRS" },
  { id: "89", name: "FEDERAL MINISTRY OF POLICE AFFAIRS" },
  { id: "90", name: "FEDERAL MINISTRY OF POWER -HQTRS" },
  {
    id: "91",
    name: "FEDERAL MINISTRY OF SCIENCE, TECHNOLOGY AND INNOVATION - HQTRS",
  },
  { id: "92", name: "FEDERAL MINISTRY OF WATER RESOURCES - HQTRS" },
  { id: "93", name: "FEDERAL MINISTRY OF WOMEN AFFAIRS - HQTRS" },
  { id: "94", name: "FEDERAL MINISTRY OF WORKS AND HOUSING" },
  { id: "95", name: "FEDERAL MINISTRY OF YOUTH & SPORTS DEVELOPMENT - HQTRS" },
  { id: "96", name: "FEDERAL NEURO-PSYCHIATRIC HOSPITAL ABEOKUTA" },
  { id: "97", name: "FEDERAL NEURO-PSYCHIATRIC HOSPITAL KADUNA" },
  { id: "98", name: "FEDERAL NEURO-PSYCHIATRIC HOSPITAL YABA" },
  { id: "99", name: "FEDERAL NEURO-PSYCHIATRIC HOSPITAL, KWARE-SOKOTO" },
  { id: "100", name: "FEDERAL POLYTECHNIC OFFA - 1000073" },
  { id: "101", name: "FEDERAL PSYCHIATRIC HOSPITAL BENIN CITY" },
  { id: "102", name: "FEDERAL PSYCHIATRIC HOSPITAL CALABAR" },
  { id: "103", name: "FEDERAL PSYCHIATRIC HOSPITAL ENUGU" },
  { id: "104", name: "FEDERAL PSYCHIATRIC HOSPITAL KADUNA" },
  { id: "105", name: "FEDERAL PSYCHIATRIC HOSPITAL MAIDUGURI" },
  { id: "106", name: "FEDERAL RADIO CORPORATION OF NIGERIA" },
  { id: "107", name: "FEDERAL ROAD MAINTENANCE AGENCY" },
  { id: "108", name: "FEDERAL ROAD SAFETY COMMISSION" },
  { id: "109", name: "FEDERAL SCHOOL OF MEDICAL LABORATORY JOS" },
  { id: "110", name: "FEDERAL TEACHING HOSPITAL, ABAKALIKI" },
  { id: "111", name: "FEDERAL TEACHING HOSPITAL, GOMBE" },
  { id: "112", name: "FEDERAL TEACHING HOSPITAL, IDO-EKITI" },
  { id: "113", name: "FEDERAL TEACHING HOSPITAL, KATSINA" },
  { id: "114", name: "FEDERAL TRAINING CENTRE,ILORIN" },
  { id: "115", name: "FEDERAL UNIVERSITY OF TECHNOLOGY, MINNA" },
  { id: "116", name: "FGC AZARE" },
  { id: "117", name: "FGC DAURA" },
  { id: "118", name: "FGC GARKI" },
  { id: "119", name: "FGC IJANIKIN" },
  { id: "120", name: "FGC IKURIN" },
  { id: "121", name: "FGC JOS" },
  { id: "122", name: "FGC KADUNA" },
  { id: "123", name: "FGC KANO" },
  { id: "124", name: "FGC KEFFI" },
  { id: "125", name: "FGC KWALI" },
  { id: "126", name: "FGC ONITSHA" },
  { id: "127", name: "FGC POTISKUM" },
  { id: "128", name: "FGC SOKOTO" },
  { id: "129", name: "FGC, IKOLE" },
  { id: "130", name: "FGGC AKURE" },
  { id: "131", name: "FGGC ANKA" },
  { id: "132", name: "FGGC BAKORI" },
  { id: "133", name: "FGGC BAUCHI" },
  { id: "134", name: "FGGC BIDA" },
  { id: "135", name: "FGGC EFON IMNRINGI" },
  { id: "136", name: "FGGC GBOKO" },
  { id: "137", name: "FGGC GUMI TAMBAWAL" },
  { id: "138", name: "FGGC GUSAU" },
  { id: "139", name: "FGGC IBUSA" },
  { id: "140", name: "FGGC IPETUMODU" },
  { id: "141", name: "FGGC JALINGO" },
  { id: "142", name: "FGGC OYO" },
  { id: "143", name: "FGGC WUKARI" },
  { id: "144", name: "FGGC, YOLA" },
  { id: "145", name: "FGN IPPIS" },
  { id: "146", name: "FGN: FEDERAL GOVERNMENT OF NIGERIA" },
  { id: "147", name: "FIRST BANK OF NIGERIA PLC" },
  { id: "148", name: "FPO OSOGBO - 022000703100" },
  { id: "149", name: "FRSC STAFF COOPERATIVE SCHEME, CALABAR" },
  { id: "150", name: "FSTC DAYI - 051702610400" },
  { id: "151", name: "FSTC TUNGBO - YENAGOA" },
  { id: "152", name: "FTC UYO" },
  { id: "153", name: "FTC YABA" },
  { id: "154", name: "FTC ZURU" },
  { id: "155", name: "FUFORE LOCAL GOVERNMENT COUNCIL - ADAMAWA STATE" },
  { id: "156", name: "GALAXY BACKBONE LTD. - 022805700100" },
  { id: "157", name: "GASHAKA GUMTI NATIONAL PARK" },
  { id: "158", name: "GIREI LOCAL GOVERNMENT - ADAMAWA STATE GOVERNMENT" },
  {
    id: "159",
    name: "INDEPENDENT CORRUPT PRACTICES AND RELATED OFFENCES COMMISSION",
  },
  { id: "160", name: "INDUSTRIAL ARBITRATION PANEL" },
  { id: "161", name: "INSTITUTE FOR PEACE AND CONFLICT RESOLUTION" },
  { id: "162", name: "INSTITUTE OF ARCHEOLOGY AND MUSEUM STUDIES, JOS" },
  { id: "163", name: "INSTITUTE OF HUMAN VIROLOGY LTD GTE" },
  { id: "164", name: "INTERNATIONAL RESOURCES MANAGEMENT" },
  { id: "165", name: "INVESTMENT AND SECURITIES TRIBUNAL" },
  { id: "166", name: "IRRUA SPECIALIST TEACHING HOSPITAL, IRRUA" },
  {
    id: "167",
    name: "JOINT ADMISSIONS MATRICULATION BOARD -(JAMB) - 051700500100",
  },
  { id: "168", name: "JOS UNIVERSITY TEACHING HOSPITAL" },
  { id: "169", name: "KABBA BUNU LGA - KOGI STATE GOVERNMENT" },
  { id: "170", name: "KADUNA STATE PRIMARY HEALTH CARE DE" },
  { id: "171", name: "KADUNA STATE UNIVERSAL BASIC EDUCATION BOARD" },
  { id: "172", name: "KAINJI NATIONAL PARK" },
  { id: "173", name: "KAMUKU NATIONAL PARK" },
  { id: "174", name: "Kano Electricity Distribution Company (KEDCO)" },
  { id: "175", name: "Kano State LGAs" },
  { id: "176", name: "KOGI BUREAU FOR LOCAL GOVERNMENT PENSION" },
  { id: "177", name: "KOGI STATE BUREAU OF STATE GOVT PENSION" },
  { id: "178", name: "KOGI STATE GOVERNMENT" },
  { id: "179", name: "KOGI STATE UNIVERSAL BASIC EDU BOAR" },
  { id: "180", name: "KWARA STATE UNIVERSITY, MALETE" },
  { id: "181", name: "LAGOS UNIVERSITY TEACHING HOSPITAL" },
  { id: "182", name: "LAKE CHAD RESEARCH INSTITUTE MAIDUGURI" },
  { id: "183", name: "LEGAL AID COUNCIL" },
  { id: "184", name: "LOCAL EDUCATION AUTHORITY ABAJI" },
  { id: "185", name: "LOWER BENUE RBDA" },
  { id: "186", name: "LOWER NIGER RBDA" },
  { id: "187", name: "LUCK GUARDS LIMITED" },
  { id: "188", name: "MALARIA AND PUBLIC HEALTH NIGERIA LTD/GTE" },
  { id: "189", name: "MARITIME ACADEMY- ORON - 022900500100" },
  { id: "190", name: "MARITIME ACADEMY, ORON" },
  { id: "191", name: "MED REHABILITATION THERAPISTS BOARD" },
  { id: "192", name: "MICHAEL IMODU INSTITUTE OF LABOUR STUDIES" },
  { id: "193", name: "MINERAL SECTOR SUPPORT FOR ECONOMIC DIVERSIFICATION" },
  { id: "194", name: "MINISTRY OF DEFENCE - MOD HQTRS" },
  { id: "195", name: "MINISTRY OF DEFENCE HQ" },
  { id: "196", name: "MINISTRY OF FOREIGN AFFAIRS - HQTRS" },
  { id: "197", name: "MINISTRY OF INTERIOR - HQTRS" },
  { id: "198", name: "MINISTRY OF MINES AND STEEL DEVELOPMENT- HQTRS" },
  { id: "199", name: "MINISTRY OF PETROLEUM RESOURCES HQTRS" },
  { id: "200", name: "MUBI NORTH LOCAL GOVERNMENT - ADAMAWA STATE GOVERNMENT" },
  { id: "201", name: "NASARAWA STATE UNIVERSITY, KEFFI" },
  { id: "202", name: "NAT. COMM. FOR MUSEUMS & MONUMENTS" },
  {
    id: "203",
    name: "NATIONAL AGENCY FOR FOOD AND DRUG ADMINISTRATION AND CONTROL (NAFDAC)",
  },
  {
    id: "204",
    name: "NATIONAL AGENCY FOR GREAT GREEN WALL (HQTRS) - 0535021001",
  },
  { id: "205", name: "NATIONAL AGENCY FOR GREAT GREEN WALL HQTRS" },
  {
    id: "206",
    name: "NATIONAL AGENCY FOR SCIENCE AND ENGINEERING INFRASTRUCTURE (NASENI)",
  },
  { id: "207", name: "NATIONAL AGENCY FOR THE CONTROL OF AIDS (NACA)" },
  { id: "208", name: "NATIONAL AGRICULTURE SEEDS COUNCIL" },
  {
    id: "209",
    name: "NATIONAL AUTOMOTIVE DESIGN AND DEVELOPMENT COUNCIL - 022200300100",
  },
  { id: "210", name: "NATIONAL BIOSAFETY MANAGEMENT AGENCY" },
  { id: "211", name: "NATIONAL BIOSAFETY MANAGEMENT AGENCY (NBMA) HQTRS" },
  { id: "212", name: "NATIONAL BIOTECHNOLOGY DEVELOPMENT AGENCY - ABUJA" },
  { id: "213", name: "NATIONAL BLOOD SERVICE COMMISSION (NBSC)" },
  { id: "214", name: "NATIONAL BOARD FOR ARABIC AND ISLAMIC STUDIES" },
  {
    id: "215",
    name: "NATIONAL BOARD FOR ARABIC AND ISLAMIC STUDIES (NBAIS) HQTRS",
  },
  { id: "216", name: "NATIONAL BOARD FOR TECHNICAL EDUCATION" },
  { id: "217", name: "NATIONAL BOUNDARY COMMISSION (NBC) HQTRS" },
  { id: "218", name: "NATIONAL BROADCASTING COMMISSION (NBC) - 012300800100" },
  { id: "219", name: "NATIONAL BUREAU OF STATISTICS" },
  { id: "220", name: "NATIONAL BUSINESS AND TECHNICAL EDUCATION BOARD" },
  { id: "221", name: "NATIONAL CENTRE FOR WOMEN DEVELOPMENT" },
  { id: "222", name: "NATIONAL CEREALS RESEARCH INSTITUTE" },
  { id: "223", name: "NATIONAL CEREALS RESEARCH INSTITUTE AMAKAMA" },
  { id: "224", name: "NATIONAL CEREALS RESEARCH INSTITUTE- BADEGGI" },
  { id: "225", name: "NATIONAL COMMISSION FOR COLLEGE EDUCATION SECRETARIAT" },
  {
    id: "226",
    name: "NATIONAL COMMISSION FOR MASS LITERACY, ADULT & NON-FORMAL EDUCATION",
  },
  { id: "227", name: "NATIONAL COMMISSION FOR MUSEUMS AND MONUMENTS" },
  { id: "228", name: "NATIONAL COMMISSION FOR REFUGEES" },
  { id: "229", name: "NATIONAL COUNCIL OF ARTS AND CULTURE" },
  { id: "230", name: "NATIONAL DIRECTORATE OF EMPLOYMENT" },
  { id: "231", name: "NATIONAL DRUG LAW ENFORCEMENT AGENCY" },
  { id: "232", name: "NATIONAL EAR CARE CENTRE" },
  { id: "233", name: "NATIONAL EAR CARE CENTRE KADUNA" },
  { id: "234", name: "NATIONAL EDUCATION RESEARCH & DEVELOPMENT COUNCIL" },
  { id: "235", name: "NATIONAL EMERGENCY MANAGEMANT AGENCY" },
  {
    id: "236",
    name: "NATIONAL ENVIRONMENTAL STANDARDS AND REGULATIONS ENFORCEMENT AGENCY",
  },
  { id: "237", name: "NATIONAL EXAMINATION COUNCIL - 051700900100" },
  { id: "238", name: "NATIONAL EXAMINATIONS COUNCIL" },
  { id: "239", name: "NATIONAL FILM AND VEDIO CENSOR BOARD" },
  { id: "240", name: "NATIONAL GALLERY OF ART" },
  { id: "241", name: "NATIONAL HAJJ COMMISSION OF NIGERIA" },
  { id: "242", name: "National Health Ins. Scheme" },
  { id: "243", name: "NATIONAL HORTICULTURAL RESEARCH INSTITUTE- IBADAN" },
  { id: "244", name: "NATIONAL HOSPITAL" },
  { id: "245", name: "NATIONAL HOSPITAL ABUJA" },
  { id: "246", name: "NATIONAL IDENTITY MANAGEMENT COMMISSION" },
  {
    id: "247",
    name: "NATIONAL INST. OF PHARM. RESEARCH AND DEVELOPMENT, ABUJA",
  },
  {
    id: "248",
    name: "NATIONAL INSTITUTE FOR CONSTRUCTION TECHNOLOGY UROMI, EDO STATE",
  },
  { id: "249", name: "NATIONAL INSTITUTE FOR CULTURE ORIENTATION" },
  {
    id: "250",
    name: "NATIONAL INSTITUTE FOR EDUCATION PLANNING & ADMINISTRATION",
  },
  {
    id: "251",
    name: "NATIONAL INSTITUTE FOR OIL PALM RESEARCH (NIFOR) - BENIN",
  },
  {
    id: "252",
    name: "NATIONAL INSTITUTE OF HOSPITALITY AND TOURISM DEVELOPMENT STUDIES",
  },
  { id: "253", name: "NATIONAL IRON ORE MINING PROJECT - ITAKPE" },
  { id: "254", name: "NATIONAL LIBRARY OF NIGERIA" },
  {
    id: "255",
    name: "NATIONAL LOTTERY REGULATORY COMMISSION (NLRC) - 011105100100",
  },
  { id: "256", name: "NATIONAL LOTTERY TRUST FUND" },
  { id: "257", name: "NATIONAL METALLURGICAL DEVELOPMENT CENTRE, JOS" },
  { id: "258", name: "NATIONAL OBSTETRIC FISTULA CENTRE BAUCHI" },
  { id: "259", name: "NATIONAL OBSTETRIC FITSULA CENTRE, ABAKALIKI" },
  {
    id: "260",
    name: "NATIONAL OFFICE OF TECHNOLOGY ACQUISITION AND PROMOTION - ABUJA",
  },
  {
    id: "261",
    name: "NATIONAL OFFICE OF TECHNOLOGY ACQUISITION AND PROMOTION- ABUJA - 022804300100",
  },
  { id: "262", name: "NATIONAL OIL SPILL DETECTION AND RESPONSE AGENCY" },
  { id: "263", name: "NATIONAL ORIENTATION AGENCY" },
  { id: "264", name: "NATIONAL ORIENTATION AGENCY PROJECT ACCOUNT" },
  { id: "265", name: "NATIONAL ORTHOPAEDIC HOSPITAL DALA KANO" },
  { id: "266", name: "NATIONAL ORTHOPAEDIC HOSPITAL ENUGU" },
  { id: "267", name: "NATIONAL ORTHOPAEDIC HOSPITAL LAGOS" },
  { id: "268", name: "NATIONAL ORTHOPEDIC HOSPITAL LAGOS" },
  { id: "269", name: "NATIONAL PARK HEADQUARTERS" },
  { id: "270", name: "NATIONAL POPULATION COMMISSION" },
  { id: "271", name: "NATIONAL PRIMARY HEALTH CARE DEVELOPMENT AGENCY" },
  {
    id: "272",
    name: "NATIONAL PRIMARY HEALTH CARE DEVELOPMENT AGENCY - IMMUNIZATION PLUS AND MALARIA PROGRESS BY ACCELERATING COVERAGE AND TRANSFORMATION SERVICES",
  },
  {
    id: "273",
    name: "NATIONAL PRIMARY HEALTH CARE DEVELOPMENT AGENCY - UNICEF AND OTHER DONORS",
  },
  {
    id: "274",
    name: "NATIONAL PRIMARY HEALTH CARE DEVELOPMENT AGENCY BASIC HEALTH CARE PROVISION FUND",
  },
  { id: "275", name: "NATIONAL PRODUCTIVITY CENTRE" },
  {
    id: "276",
    name: "NATIONAL RESEARCH INSTITUTE FOR CHEMICAL TECHNOLOGY -ZARIA",
  },
  { id: "277", name: "NATIONAL ROOT CROPS RESEARCH INSTITUTE- UMUDIKE" },
  { id: "278", name: "NATIONAL SENIOR SECONDARY EDUCATION COMMISSION (NSSEC)" },
  { id: "279", name: "NATIONAL SPACE RESEARCH AND DEVELOPMENT AGENCY - ABUJA" },
  {
    id: "280",
    name: "NATIONAL STEEL RAW MATERIALS EXPLORATION AGENCY, KADUNA",
  },
  {
    id: "281",
    name: "NATIONAL TB AND LEPROSY REFERRED HOSPITAL AND TRAINING, ZARIA",
  },
  { id: "282", name: "NATIONAL TEACHERS INSTITUTE" },
  { id: "283", name: "NATIONAL TEACHERS INSTITUTE - 051701700100" },
  { id: "284", name: "NATIONAL THEATRE" },
  { id: "285", name: "NATIONAL TROUPE OF NIGERIA" },
  {
    id: "286",
    name: "NATIONAL TUBERCULOSIS LEPORSY AND BURULIUCLER CONTROL PROGRAMME",
  },
  { id: "287", name: "NATIONAL UNIVERSITIES COMMISSION SECRETARIAT" },
  { id: "288", name: "NATIONAL VETERINARY RESEARCH INSTITUTE- VOM" },
  { id: "289", name: "NATIONAL WATER RESOURCES INSTITUTE- KADUNA" },
  {
    id: "290",
    name: "NATIONAL. AGENCY FOR THE PROHIBITION OF TRAFFICKING IN PERSONS",
  },
  { id: "291", name: "NESTOIL PLC" },
  { id: "292", name: "NEW PARTNERSHIP FOR AFRICAN DEVELOPMENT" },
  { id: "293", name: "NEWS AGENCY OF NIGERIA" },
  { id: "294", name: "NEWS AGENCY OF NIGERIA (NAN)  - 012300500100" },
  { id: "295", name: "NIGER DELTA RBDA" },
  { id: "296", name: "NIGER STATE GOVERNMENT" },
  { id: "297", name: "NIGERIA AGRICULTURAL QUARANTINE SERVICE" },
  { id: "298", name: "NIGERIA AIRSPACE MANAGEMENT AGENCY  - 023000400100" },
  { id: "299", name: "NIGERIA ATOMIC ENERGY COMMISSION & ITS CENTRES" },
  { id: "300", name: "NIGERIA CENTRE FOR DISEASE CONTROL/WORLD BANK PROJECT" },
  { id: "301", name: "NIGERIA CHRISTIAN PILGRIM COMMISSION" },
  {
    id: "302",
    name: "NIGERIA COLLEGE OF AVIATION TECHNOLOGY - ZARIA - 023000300100",
  },
  { id: "303", name: "NIGERIA CUSTOMS SERVICE" },
  {
    id: "304",
    name: "NIGERIA DEPOSIT INSURANCE CORPORATION - CLAIMS RESOLUTION DEPARTMENT (CRD)",
  },
  { id: "305", name: "NIGERIA FOOTBALL FEDERATION" },
  { id: "306", name: "NIGERIA HYDROLOGICAL SERVICE AGENCY" },
  { id: "307", name: "NIGERIA INSTITUTE OF ADVANCED LEGAL STUDIES" },
  { id: "308", name: "NIGERIA INSTITUTE OF MINING AND GEOSCIENCE" },
  { id: "309", name: "NIGERIA INSTITUTE OF OCEANOGRAPHY AND MARINE RESEARCH" },
  { id: "310", name: "NIGERIA INSTITUTE OF SOCIAL AND ECONOMIC RESEARCH" },
  { id: "311", name: "NIGERIA INTEGRATED WATER MANAGEMENT COMMISSION" },
  { id: "312", name: "NIGERIA NATURAL MEDICINE DEVELOPMENT AGENCY" },
  { id: "313", name: "NIGERIA NUCLEAR REGULATORY AUTHORITY" },
  { id: "314", name: "NIGERIA SOCIAL INSURANCE TRUST FUND" },
  { id: "315", name: "NIGERIA STORED PRODUCTS RESEARCH, ILORIN" },
  { id: "316", name: "NIGERIAN ARMED FORCES RESETTLEMENT CENTRE, LAGOS" },
  { id: "317", name: "NIGERIAN BUILDING AND ROAD RESEARCH INSTITUTE - LAGOS" },
  { id: "318", name: "NIGERIAN CIVIL AVIATION AUTHORITY" },
  { id: "319", name: "NIGERIAN COLLEGE OF AVIATION TECHNOLOGY-ZARIA" },
  { id: "320", name: "NIGERIAN COPYRIGHT COMMISSION" },
  {
    id: "321",
    name: "NIGERIAN EDUCATIONAL RESEARCH AND DEVELOPMENT COUNCIL  051701200100",
  },
  { id: "322", name: "NIGERIAN EXPORT PROCESSING ZONES AUTHORITY" },
  { id: "323", name: "NIGERIAN EXPORT PROMOTION COUNCIL" },
  { id: "324", name: "NIGERIAN EXPORT PROMOTION COUNCIL JOS" },
  { id: "325", name: "NIGERIAN FILM CORPORATION" },
  { id: "326", name: "NIGERIAN GEOLOGICAL SURVEY AGENCY." },
  {
    id: "327",
    name: "NIGERIAN INSTITUTE FOR TRYPANOSOMIASIS RESEARCH - KADUNA",
  },
  { id: "328", name: "NIGERIAN INSTITUTE OF ANIMAL SCIENCE ? 021503600100" },
  { id: "329", name: "NIGERIAN INSTITUTE OF TRANSPORT TECHNOLOGY" },
  { id: "330", name: "NIGERIAN MARITIME ADMINISTRATION AND SAFETY AGENCY" },
  { id: "331", name: "NIGERIAN METEOROLOGICAL" },
  { id: "332", name: "NIGERIAN METEOROLOGICAL AGENCY" },
  { id: "333", name: "NIGERIAN PIPELINES AND STORAGE COMPANY LIMITED" },
  { id: "334", name: "NIGERIAN PORTS AUTHORITY - 1000143" },
  { id: "335", name: "NIGERIAN RAILWAY CORPORATION" },
  { id: "336", name: "NIGERIAN RAILWAY CORPORATION- 022900300100" },
  { id: "337", name: "NIGERIAN TELEVISION AUTHORITY" },
  { id: "338", name: "NIGERIAN TELEVISION AUTHORITY BIRNIN KEBBI" },
  { id: "339", name: "NIGERIAN TELEVISION AUTHORITY CHANNEL 5, ABUJA" },
  { id: "340", name: "NIGERIAN TELEVISION AUTHORITY DUTSE" },
  { id: "341", name: "NIGERIAN TELEVISION AUTHORITY ILORIN" },
  { id: "342", name: "NIGERIAN TELEVISION AUTHORITY KANO" },
  { id: "343", name: "NIGERIAN TELEVISION AUTHORITY KEFFI" },
  { id: "344", name: "NIGERIAN TELEVISION AUTHORITY LOKOJA" },
  { id: "345", name: "NIGERIAN TELEVISION AUTHORITY MULTI-CHANNELS" },
  {
    id: "346",
    name: "NIGERIAN TELEVISION AUTHORITY PROPERTIES INVESTMENT COMPANY",
  },
  { id: "347", name: "NIGERIAN TELEVISION AUTHORITY(HQ)" },
  { id: "348", name: "NIGERIAN TOURISM DEVELOPMENT CORPORATION" },
  { id: "349", name: "NIGERIANS IN DIASPORA COMMISSION (NIDC)" },
  { id: "350", name: "NIPOST" },
  { id: "351", name: "NIPSS, KURU" },
  { id: "352", name: "NNPC E&P Limited" },
  { id: "353", name: "NNPC Engineering & Technical Company" },
  { id: "354", name: "NNPC Limited" },
  { id: "355", name: "NNPC Upstream Investment Management Services" },
  { id: "356", name: "NOMADIC EDUCATION COMMISSION" },
  { id: "357", name: "NTA TELEVISION COLLEGE JOS" },
  { id: "358", name: "NURSE TUTOR TRAINNING KADUNA" },
  { id: "359", name: "OBAFEMI AWOLOWO UNIVERSITY TEACHING HOSPITAL" },
  { id: "360", name: "ODSG LG PENSION (LPODSG)" },
  { id: "361", name: "ODSG STAFF MATTERS SUBEB" },
  { id: "362", name: "ODSG STAFF MATTERS TESCOM" },
  {
    id: "363",
    name: "OFFICE OF THE ACCOUNT GENERAL OF THE FEDERATION - SPECIAL DUTIES",
  },
  {
    id: "364",
    name: "OFFICE OF THE ACCOUNTANT GENERAL OF THE FEDERATION - SPECIAL ACCOUNT",
  },
  { id: "365", name: "OFFICE OF THE ACCOUNTANT-GENERAL OF THE FEDERATION" },
  {
    id: "366",
    name: "OFFICE OF THE HEAD OF THE CIVIL SERVICE OF THE FEDERATION - HQTRS",
  },
  {
    id: "367",
    name: "OFFICE OF THE SECRETARY TO THE GOVERNMENT OF THE FEDERATION (OSGF)",
  },
  {
    id: "368",
    name: "OFFICE OF THE SPECIAL ADVISER TO THE PRESIDENT ON NIGER DELTA",
  },
  { id: "369", name: "OFFICE OF THE SURVEYOR-GENERAL OF THE FEDERATION" },
  { id: "370", name: "OKENE LGA - KOGI STATE GOVERNMENT" },
  { id: "371", name: "OKUMU NATIONAL PARK" },
  { id: "372", name: "OLAMABORO LGA - KOGI STATE GOVERNMENT" },
  { id: "373", name: "ONDO STATE GOVT.STAFF MATTERS ACCT" },
  { id: "374", name: "ONDO STATE LOCAL GOVT SERVICE COMM" },
  { id: "375", name: "ONDO STATE PENSION" },
  { id: "376", name: "ONDO STATE UNIVERSAL BASIC EDUCATION BOARD (SUBEB)" },
  { id: "377", name: "ONNE OIL AND GAS FREE ZONE AUTHORITY - 022201300100" },
  { id: "378", name: "OYO NATIONAL PARK" },
  {
    id: "379",
    name: "PENSION TRANSITIONAL ARRANGEMENT DEPARTMENT (PTAD) HQTRS",
  },
  { id: "380", name: "PENSION TRANSITIONAL ARRANGEMENT DIRECTORATE" },
  { id: "381", name: "PETROLEUM TECHNOLOGY DEVELOPMENT FUND" },
  { id: "382", name: "POLICE FORMATIONS AND COMMAND -" },
  { id: "383", name: "POLICE SERVICE COMMISSION HQTRS" },
  { id: "384", name: "PORT HARCOURT REFINING COMPANY LIMITED (PHRC)" },
  { id: "385", name: "PRESIDENTIAL INITIATIVE OF CONTINUOUS AUDIT (PICA)" },
  { id: "386", name: "PROJECT DEVELOPMENT INSTITUTE - ENUGU" },
  { id: "387", name: "PUBLIC COMPLAINTS COMMISSION" },
  { id: "388", name: "QUEEN'S COLLEGE LAGOS" },
  { id: "389", name: "RAILWAY PROPERTY MANAGEMENT COMPANY LIMITED" },
  { id: "390", name: "REDEEMED CHRISTIAN CHURCH OF GOD HQ" },
  { id: "391", name: "RENENT LIMITED" },
  {
    id: "392",
    name: "REVENUE MOBILIZATION, ALLOCATION, AND FISCAL COMMISSION",
  },
  { id: "393", name: "RUBBER RESEARCH INSTITUTE- BENIN" },
  { id: "394", name: "SECURITIES AND EXCHANGE COMMISSION" },
  { id: "395", name: "SOKOTO RIMA RBDA" },
  { id: "396", name: "STANDARD ORGANISATION OF NIGERIA (SON) - 022200200100" },
  { id: "397", name: "SYSTEM OPERATIONS (TCN)" },
  { id: "398", name: "TEACHERS REGISTRATION COUNCIL OF NIGERIA" },
  { id: "399", name: "TERTIARY EDUCATION TRUST FUND" },
  {
    id: "400",
    name: "THE NIGERIA INCENTIVE-BASED RISK SHARING SYSTEM FOR AGRICULTURAL LENDING",
  },
  { id: "401", name: "TRANSMISSION COMPANY OF NIGERIA" },
  {
    id: "402",
    name: "TRANSMISSION COMPANY OF NIGERIA - PROJECT MANAGEMENT UNIT",
  },
  {
    id: "403",
    name: "TRANSMISSION COMPANY OF NIGERIA - TRANSMISSION SERVICE PROVIDER KADUNA REGION",
  },
  {
    id: "404",
    name: "TRANSMISSION COMPANY OF NIGERIA - TRANSMISSION SERVICE PROVIDER SHIRORO REGION",
  },
  { id: "405", name: "UNIMED ONDO STATE MATTERS" },
  { id: "406", name: "UNIV. OF BENIN TEACHING HOSPITAL" },
  { id: "407", name: "UNIVERSITY COLLEGE HOSPITAL" },
  { id: "408", name: "UNIVERSITY COLLEGE HOSPITAL IBADAN" },
  { id: "409", name: "UNIVERSITY OF ABUJA - 1000116" },
  { id: "410", name: "UNIVERSITY OF ABUJA TEACHING HOSPITAL, GWAGWALADA" },
  { id: "411", name: "UNIVERSITY OF BENIN - 1000112" },
  { id: "412", name: "UNIVERSITY OF BENIN TEACHING HOSPITAL" },
  { id: "413", name: "UNIVERSITY OF CALABAR TEACHING HOSPITAL" },
  { id: "414", name: "UNIVERSITY OF ILORIN TEACHING HOSPITAL" },
  { id: "415", name: "UNIVERSITY OF ILORIN TEACHING HOSPITAL, ILORIN" },
  { id: "416", name: "UNIVERSITY OF MAIDUGURI TEACHING HOSPITAL" },
  { id: "417", name: "UNIVERSITY OF NIGERIA TEACHING HOSPITAL, ENUGU" },
  { id: "418", name: "UNIVERSITY OF PORT HARCOURT TEACHING HOSPITAL" },
  { id: "419", name: "UNIVERSITY OF PORT-HARCOURT TEACHING HOSPITAL" },
  { id: "420", name: "UNIVERSITY OF UYO TEACHING HOSPITAL" },
  { id: "421", name: "UPPER BENUE RBDA" },
  { id: "422", name: "USMANU DANFODIO UNIVERSITY TEACHING HOSPITAL, SOKOTO" },
  { id: "423", name: "USMANU DANFODIYO UNIVERSITY, SOKOTO" },
  { id: "424", name: "VOICE OF NIGERIA" },
  { id: "425", name: "WAZIRI UMARU FEDERAL POLYTECHNIC" },
  { id: "426", name: "YAGBA WEST LGA - KOGI STATE GOVERNMENT" },
  { id: "427", name: "YOLA NORTH LOCAL GOVERNMENT - ADAMAWA STATE GOVERNMENT" },
  { id: "428", name: "YOLA SOUTH LOCAL GOVERNMENT - ADAMAWA STATE GOVERNMENT" },
  { id: "429", name: "Microsoft Nigeria" },
  { id: "430", name: "MTN Nigeria" },
  { id: "431", name: "Globacom Limited" },
  { id: "432", name: "Access Bank" },
  { id: "433", name: "Dangote Group" },
  { id: "434", name: "Zenith Bank" },
  { id: "435", name: "Guaranty Trust Bank" },
  { id: "436", name: "Shell Nigeria" },
  { id: "437", name: "Other" },
];

interface PersonalDetailsForm {
  address: string;
  document?: string;
  id: string;
}

const PersonalDetails: React.FC<LoginPageProps> = ({
  onSubmitApplication,
  onGoBack,
}) => {
  const [formData, setFormData] = useState<PersonalDetailsForm>({
    address: "",
    id: "",
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [displayedEmployers, setDisplayedEmployers] = useState<
    { id: string; name: string }[]
  >(EMPLOYERS.slice(0, 100));
  const [fileName, setFileName] = useState<string>("");

  const [savePersonalDetails, { isLoading }] = useSavePersonalDetailsMutation();

  const handleTextChange =
    (field: keyof PersonalDetailsForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({
        ...formData,
        [field]: e.target.value,
      });
    };

  const handleSelectChange =
    (field: keyof PersonalDetailsForm) => (e: SelectChangeEvent) => {
      setFormData({
        ...formData,
        [field]: e.target.value,
      });
    };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        let base64String = reader.result as string;
        // Remove data URL prefix if present
        if (base64String.startsWith("data:image/png;base64,")) {
          base64String = base64String.substring(base64String.indexOf(",") + 1);
        }
        setFormData({
          ...formData,
          document: base64String,
        });
        setFileName(file.name);
        console.log("Selected file (base64):", base64String);
        console.log("Selected file name:", file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    const loanId = localStorage.getItem("loanId");
    e.preventDefault();

    const formDataToSubmit = {
      address: formData.address,
      idNumber: formData.id,
      frontImageBase64: formData.document || "string",
      backImageBase64: formData.document || "string",
      loanId: loanId || "",
      frontImageExtension: "png",
      backImageExtension: "png",
    };
    console.log("Submitting personal details:", formDataToSubmit);
    try {
      savePersonalDetails(formDataToSubmit)
        .unwrap()
        .then(() => {
          console.log("Personal details submitted successfully");
          onSubmitApplication(formData);
        })
        .catch((error) => {
          // onSubmitApplication(formData);
          console.error("Error submitting personal details:", error);
          // Handle error appropriately, e.g., show a notification
          alert("Failed to submit personal details. Please try again.");
        });
    } catch (error) {
      console.error("Error submitting personal details:", error);
    }
    // onSubmitApplication(formDataToSubmit);
  };

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <div className="logo-container">
          <h1 className="logo-text">deVpay</h1>
        </div>
        <div className="illustration-container">
          <img src={peopleBg} alt="Business People" className="illustration" />
        </div>
      </div>

      <div className="login-right-panel">
        <div className="back-button-container">
          <button className="back-button" onClick={onGoBack}>
            <span className="back-icon">‹</span>
            <span>Go Back</span>
          </button>
        </div>

        <div className="login-form-container">
          <ProgressBar currentStep={3} />
          <div className="login-header">
            <h1>Personal Details</h1>
            <p>Please provide your employment and personal information.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {/* <div className="form-group">
              <FormControl fullWidth sx={{ width: "100%" }}>
                <InputLabel id="employer-select-label">Employer</InputLabel>
                <Select
                  labelId="employer-select-label"
                  id="employer-select"
                  value={formData.employer}
                  label="Employer"
                  onChange={handleSelectChange("employer")}
                  required
                  sx={{
                    height: "48px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    width: "100%",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                    },
                    "& .MuiSelect-select": {
                      padding: "12px 16px",
                      fontSize: "16px",
                    },
                  }}
                  className="form-input"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 450,
                        maxWidth: "40%",
                      },
                    },
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                    onClose: () => {
                      setSearchQuery("");
                      setDisplayedEmployers(EMPLOYERS.slice(0, 100));
                    },
                  }}
                  displayEmpty
                >
                  <ListSubheader sx={{ p: 0 }}>
                    <TextField
                      size="small"
                      autoFocus
                      placeholder="Search employers..."
                      value={searchQuery}
                      sx={{
                        width: "calc(100% - 16px)",
                        m: 1,
                        mb: 1,
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      onChange={(e) => {
                        const query = e.target.value.toLowerCase();
                        setSearchQuery(query);
                        if (query) {
                          const filtered = EMPLOYERS.filter((emp) =>
                            emp.name.toLowerCase().includes(query)
                          );
                          setDisplayedEmployers(filtered.slice(0, 100));
                        } else {
                          setDisplayedEmployers(EMPLOYERS.slice(0, 100));
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key !== "Escape") {
                          e.stopPropagation();
                        }
                      }}
                    />
                  </ListSubheader>
                  {displayedEmployers.map((employer) => (
                    <MenuItem
                      key={employer.id}
                      value={employer.id}
                      sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                    >
                      {employer.name}
                    </MenuItem>
                  ))}
                  {displayedEmployers.length === 0 && (
                    <MenuItem disabled>No matching employers found</MenuItem>
                  )}
                  {searchQuery === "" &&
                    displayedEmployers.length === 100 &&
                    EMPLOYERS.length > 100 && (
                      <MenuItem
                        sx={{ justifyContent: "center", color: "primary.main" }}
                        onClick={() => {
                          setDisplayedEmployers(EMPLOYERS);
                        }}
                      >
                        Load all employers ({EMPLOYERS.length})
                      </MenuItem>
                    )}
                </Select>
              </FormControl>
            </div> */}

            {/* <div className="form-group">
              <FormControl fullWidth>
                <InputLabel id="industry-select-label">Industry</InputLabel>
                <Select
                  labelId="industry-select-label"
                  id="industry-select"
                  value={formData.industry}
                  label="Industry"
                  onChange={handleSelectChange("industry")}
                  required
                  sx={{
                    height: "48px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0",
                    },
                    "& .MuiSelect-select": {
                      padding: "12px 16px",
                      fontSize: "16px",
                    },
                  }}
                  className="form-input"
                >
                  {INDUSTRIES.map((industry) => (
                    <MenuItem key={industry.id} value={industry.id}>
                      {industry.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div> */}

            <div className="form-group">
              <TextField
                fullWidth
                label="Residential Address"
                value={formData.address}
                onChange={handleTextChange("address")}
                required
                multiline
                rows={2}
                placeholder="Enter your full residential address"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#e0e0e0",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#666",
                  },
                }}
              />
            </div>

            <div className="form-group">
              <TextField
                fullWidth
                label="ID Number"
                value={formData.id}
                onChange={handleTextChange("id")}
                required
                placeholder="Enter your ID number"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    height: "48px",
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#e0e0e0",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#666",
                  },
                }}
              />
            </div>

            <div className="form-group">
              <InputLabel sx={{ color: "#666", fontSize: "14px", mb: 1 }}>
                Upload Document (ID Card, Passport, or Driver's License)
              </InputLabel>
              <input
                type="file"
                id="document-upload"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="document-upload">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  sx={{
                    height: "48px",
                    backgroundColor: "#f5f5f5",
                    borderColor: "#e0e0e0",
                    color: "#666",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                      borderColor: "#d0d0d0",
                    },
                  }}
                >
                  {fileName || "Choose File"}
                </Button>
              </label>
            </div>

            <div className="form-group">
              {isLoading ? (
                <button
                  type="submit"
                  className="login-button"
                  disabled
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Spinner size={22} />
                </button>
              ) : (
                <button type="submit" className="login-button">
                  Continue
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
