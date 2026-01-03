import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  MapPin,
  CreditCard,
  Upload,
  FileText,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  X,
  Shield,
  Loader2,
  FileImage,
  AlertCircle,
  Home,
  Calendar,
} from "lucide-react";
import {
  useSavePersonalDetailsMutation,
  useUploadIDMutation,
} from "../store/services/baseApi";

// ============== Color Theme ==============
const colors = {
  primary: {
    main: "#1E88E5",
    light: "#64B5F6",
    dark: "#1565C0",
    gradient: "linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)",
  },
  secondary: {
    main: "#00ACC1",
    light: "#4DD0E1",
    dark: "#00838F",
  },
  background: {
    main: "#F8FAFC",
    card: "#FFFFFF",
    elevated: "rgba(255, 255, 255, 0.95)",
  },
  text: {
    primary: "#1E293B",
    secondary: "#64748B",
    muted: "#94A3B8",
  },
  border: {
    light: "#E2E8F0",
    focus: "#1E88E5",
  },
  status: {
    success: "#00C853",
    error: "#FF4757",
    warning: "#FFB020",
  },
};

const shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  glow: "0 0 20px rgba(30, 136, 229, 0.3)",
  card: "0 4px 20px rgba(0, 0, 0, 0.08)",
};

const IDENTIFICATION_TYPES = [
  "International Passport",
  "National ID Card",
  "Driver's License",
  "Voter's Card",
];

// ============== Employers List ==============
const EMPLOYERS_LIST = [
  "A.A. RANO NIG. LTD",
  "AAUA",
  "ABBA GANA IKO MULTI AGENCY",
  "ABDU DIOBU MULTI-PURPOSE",
  "ABDUL IBRAHIM INVESTMENT LTD",
  "ABIA STATE GOVERNMENT",
  "ABIA STATE HOUSE OF ASSEMBLY",
  "ABIA STATE JUDICIAL SERVICE COMMISSION",
  "ABU ZARIA",
  "ABUJA ELECTRICITY DISTRIBUTION COMPANY (AEDC)",
  "ABUJA MUNICIPAL AREA COUNCIL",
  "ACCESS BANK",
  "ADAMAWA STATE GOVERNMENT",
  "ADEGOKE NIG LTD",
  "ADEXEN RECRUITMENT AGENCY",
  "ADMINISTRATIVE STAFF COLLEGE OF NIGERIA",
  "ADVANCED TECHNOLOGY SOLUTIONS",
  "AERO CONTRACTORS COMPANY OF NIG LTD",
  "AFL",
  "AFRICA ATLANTIC COAST LTD",
  "AFRICAN ALLIANCE INS. CO. LTD",
  "AFRICAN INTERNATIONAL BANK",
  "AFRICAN PETROLEUM PLC",
  "AFRILAND PROPERTIES PLC",
  "AG LEVENTIS NIG. PLC",
  "AGIP ENERGY & NATURAL RESOURCES",
  "AHMADU BELLO UNIV. ZARIA",
  "AKWA IBOM STATE GOVERNMENT",
  "ALAT BY WEMA",
  "ALBARKA AIRLINES LIMITED",
  "ALPHA PHARMACY & STORES LTD",
  "AMSCO NIG. PLC",
  "AMINU KANO TEACHING HOSPITAL",
  "ANAMMCO LTD",
  "ANAMBRA STATE GOVERNMENT",
  "ANCHOR INSURANCE COMPANY LTD",
  "ANDERSEN TAX LP",
  "AP MOLLER MAERSK",
  "APAPA LOCAL GOVERNMENT",
  "ARM LIFE ASSURANCE",
  "ASHAKA CEMENT PLC",
  "ASSOCIATED BUS COMPANY PLC",
  "ATLANTIC SHRIMPERS LIMITED",
  "AVON HMO",
  "AWO-ODUA PLASTICS LTD",
  "AXA MANSARD INSURANCE",
  "AZMAN AIR SERVICES LIMITED",
  "BABS FAFUNWA MILLENNIUM SECONDARY SCHOOL",
  "BAFRA INTERNATIONAL LTD",
  "BAUCHI STATE GOVERNMENT",
  "BAYELSA STATE GOVERNMENT",
  "BCG CONSULTING GROUP",
  "BENUE STATE GOVERNMENT",
  "BERGER PAINTS NIGERIA PLC",
  "BETA GLASS COMPANY PLC",
  "BGL GROUP",
  "BORNO STATE GOVERNMENT",
  "BRITISH AIRWAYS",
  "BRITISH AMERICAN TOBACCO NIG",
  "BROOK MEDICAL CENTRE",
  "C & I LEASING PLC",
  "CADBURY NIGERIA PLC",
  "CAP PLC",
  "CAPITAL HOTEL",
  "CAPITAL OIL & GAS INDUSTRIES",
  "CAVERTON HELICOPTERS",
  "CBN",
  "CENTRAL BANK OF NIGERIA",
  "CFAO NIGERIA PLC",
  "CHEVRON NIGERIA LTD",
  "CHI LIMITED",
  "CIBN",
  "CITI BANK",
  "CITIBANK NIGERIA LTD",
  "CONOIL PLC",
  "CONSOLIDATED BREWERIES PLC",
  "CONSOLIDATED HALLMARK INSURANCE PLC",
  "CORONA SCHOOLS",
  "CORONATION INSURANCE",
  "CORNERSTONE INSURANCE PLC",
  "COUNTY FINANCE LIMITED",
  "COURT OF APPEAL",
  "COVENANT UNIVERSITY",
  "CREDITREGISTRY",
  "CROSS RIVER STATE GOVERNMENT",
  "CSL STOCKBROKERS LTD",
  "CUSTOMS",
  "CUTIX PLC",
  "DANGOTE GROUP",
  "DATA SCIENCES NIGERIA LTD",
  "DECCA NIGERIA PLC",
  "DEEPWATER PRODUCTION CO.",
  "DELOITTE & TOUCHE",
  "DELTA STATE GOVERNMENT",
  "DIAMOND BANK",
  "DHL INTERNATIONAL",
  "DSTV",
  "DUNLOP NIG. PLC",
  "EASTERN BULKCEM CO. LTD",
  "ECOBANK NIGERIA PLC",
  "ECONOMIC AND FINANCIAL CRIMES COMMISSION (EFCC)",
  "EDO STATE GOVERNMENT",
  "EKITI STATE GOVERNMENT",
  "EL - RUFAI & PARTNERS",
  "ELIZADE UNIVERSITY",
  "EMBASSY OF CANADA",
  "EMBASSY OF FRANCE",
  "EMBASSY OF GERMANY",
  "EMBASSY OF JAPAN",
  "EMBASSY OF THE UNITED STATES",
  "ENUGU DISCO (EEDC)",
  "ENUGU STATE GOVERNMENT",
  "EQUITY ASSURANCE PLC",
  "ERNST & YOUNG",
  "ETERNA OIL & GAS PLC",
  "ETI-OSA LOCAL GOVERNMENT",
  "EXPRESS DISCOUNT LIMITED",
  "FAIRMONEY MICROFINANCE BANK",
  "FBN HOLDINGS PLC",
  "FBN INSURANCE LIMITED",
  "FBN QUEST MERCHANT BANK",
  "FCMB",
  "FCMB PENSIONS LIMITED",
  "FCT ADMINISTRATION",
  "FEDERAL AIRPORT AUTHORITY OF NIGERIA (FAAN)",
  "FEDERAL GOVERNMENT OF NIGERIA",
  "FEDERAL HIGH COURT",
  "FEDERAL INLAND REVENUE SERVICE (FIRS)",
  "FEDERAL MEDICAL CENTRE",
  "FEDERAL MINISTRY OF AGRICULTURE",
  "FEDERAL MINISTRY OF COMMUNICATIONS",
  "FEDERAL MINISTRY OF DEFENCE",
  "FEDERAL MINISTRY OF EDUCATION",
  "FEDERAL MINISTRY OF ENVIRONMENT",
  "FEDERAL MINISTRY OF FINANCE",
  "FEDERAL MINISTRY OF FOREIGN AFFAIRS",
  "FEDERAL MINISTRY OF HEALTH",
  "FEDERAL MINISTRY OF HOUSING",
  "FEDERAL MINISTRY OF INFORMATION",
  "FEDERAL MINISTRY OF INTERIOR",
  "FEDERAL MINISTRY OF JUSTICE",
  "FEDERAL MINISTRY OF LABOUR",
  "FEDERAL MINISTRY OF MINES",
  "FEDERAL MINISTRY OF POWER",
  "FEDERAL MINISTRY OF SCIENCE",
  "FEDERAL MINISTRY OF TRADE",
  "FEDERAL MINISTRY OF TRANSPORT",
  "FEDERAL MINISTRY OF WATER RESOURCES",
  "FEDERAL MINISTRY OF WOMEN AFFAIRS",
  "FEDERAL MINISTRY OF WORKS",
  "FEDERAL MINISTRY OF YOUTH",
  "FEDERAL POLYTECHNIC",
  "FEDERAL ROAD SAFETY CORPS (FRSC)",
  "FIDELITY BANK PLC",
  "FINANCIAL REPORTING COUNCIL",
  "FIRST ALUMINIUM NIG. PLC",
  "FIRST BANK OF NIGERIA LIMITED",
  "FIRST CITY MONUMENT BANK",
  "FIRST CONTINENTAL REINSURANCE",
  "FLOURMILLS NIGERIA PLC",
  "FORTE OIL PLC",
  "FOSAD CONSULTING LIMITED",
  "FRIESLAND CAMPINA WAMCO NIG. PLC",
  "FUNKE AKINDELE PRODUCTIONS",
  "GAC MOTORS NIGERIA",
  "GBENGA OYEBODE & CO",
  "GE NIGERIA",
  "GENERAL ELECTRIC",
  "GENERAL HOSPITAL",
  "GENESIS CINEMAS",
  "GIVAUDAN NIGERIA LIMITED",
  "GLAXOSMITHKLINE",
  "GLOBACOM LIMITED",
  "GLOBAL FLEET OIL AND GAS",
  "GN POWER",
  "GOMBE STATE GOVERNMENT",
  "GOOGLE NIGERIA",
  "GRACE GROUP",
  "GREENWICH MERCHANT BANK",
  "GTI SECURITIES",
  "GUARANTY TRUST BANK PLC",
  "GUINNESS NIGERIA PLC",
  "HALLMARK HMO",
  "HEALTH & MANAGEMENT CONSULT LTD",
  "HERITAGE BANK PLC",
  "HEWLETT PACKARD",
  "HIGHERLIFE GLOBAL LIMITED",
  "HONEYWELL FLOUR MILLS PLC",
  "HONEYWELL SUPERFINE FOODS",
  "HOTEL DE BENTLEY",
  "HP NIGERIA",
  "HYGEIA HMO",
  "IBEDC",
  "IBM NIGERIA LTD",
  "IBOM AIRLINES",
  "ICRC",
  "IDEA VILLAGE NIG. LTD",
  "IKEJA CITY MALL",
  "IKEJA DISCO (IKEDC)",
  "IKEJA LOCAL GOVERNMENT",
  "IMO STATE GOVERNMENT",
  "IMMIGRATION",
  "INDOMIE NIGERIA",
  "INFINITY TRUST MORTGAGE BANK",
  "INGRAM MICRO",
  "INTERAHAMWE",
  "INTERCONTINENTAL BANK",
  "INTERSWITCH LTD",
  "IPNX NIGERIA LIMITED",
  "JAIZ BANK",
  "JIGAWA STATE GOVERNMENT",
  "JOHN HOLT PLC",
  "JOS ELECTRICITY DISTRIBUTION PLC (JEDC)",
  "JULIUS BERGER NIGERIA PLC",
  "KADUNA ELECTRICITY DISTRIBUTION COMPANY (KAEDCO)",
  "KADUNA STATE GOVERNMENT",
  "KANO ELECTRICITY DISTRIBUTION COMPANY (KEDCO)",
  "KANO STATE GOVERNMENT",
  "KATSINA STATE GOVERNMENT",
  "KEBBI STATE GOVERNMENT",
  "KEYSTONE BANK LTD",
  "KIA MOTORS NIGERIA",
  "KIMBERLY CLARK",
  "KONGA",
  "KPMG",
  "KRAFT FOODS",
  "KWARA STATE GOVERNMENT",
  "LAFARGE AFRICA PLC",
  "LAGOS BUSINESS SCHOOL",
  "LAGOS DEEP OFFSHORE LOGISTICS (LADOL)",
  "LAGOS STATE GOVERNMENT",
  "LAGOS STATE INTERNAL REVENUE SERVICE (LIRS)",
  "LAGOS STATE JUDICIAL SERVICE COMMISSION",
  "LAGOS STATE TRAFFIC MANAGEMENT AUTHORITY (LASTMA)",
  "LAGOS STATE UNIVERSITY (LASU)",
  "LAGOS STATE WATERWAYS AUTHORITY (LASWA)",
  "LAW SCHOOL",
  "LEADWAY ASSURANCE COMPANY LTD",
  "LEKOIL LIMITED",
  "LEVERAGING GROUP",
  "LINKAGE ASSURANCE PLC",
  "LMRC",
  "LOCAL GOVERNMENT SERVICE COMMISSION",
  "LOTUS BANK LIMITED",
  "LSFDA",
  "MAINSTREET BANK",
  "MANTRAC NIGERIA LIMITED",
  "MARYLAND MALL",
  "MAY & BAKER NIG. PLC",
  "MCKINSEY & COMPANY",
  "MCNICHOLS CONSOLIDATED PLC",
  "MEADOW HALL GROUP",
  "MEDIA TRUST",
  "MEDICARE SPECIALIST HOSPITAL",
  "MEDVIEW AIRLINE",
  "MERISTEM SECURITIES LIMITED",
  "METRO FM",
  "METUH FOUNDATION",
  "MICROSOFT NIGERIA",
  "MOBIL OIL NIGERIA",
  "MRS OIL NIGERIA PLC",
  "MTN NIGERIA",
  "MULTI-TREX INTEGRATED FOODS",
  "MULTICHOICE NIGERIA",
  "MUTUAL BENEFITS ASSURANCE PLC",
  "NAICOM",
  "NAIRA BET",
  "NASARAWA STATE GOVERNMENT",
  "NATIONAL ASSEMBLY",
  "NATIONAL DRUG LAW ENFORCEMENT AGENCY (NDLEA)",
  "NATIONAL HEALTH INSURANCE SCHEME (NHIS)",
  "NATIONAL HOSPITAL",
  "NATIONAL IDENTITY MANAGEMENT COMMISSION (NIMC)",
  "NATIONAL INDUSTRIAL COURT",
  "NATIONAL INSURANCE COMMISSION",
  "NATIONAL JUDICIAL COUNCIL",
  "NATIONAL LOTTERY REGULATORY COMMISSION",
  "NATIONAL ORTHOPAEDIC HOSPITAL",
  "NATIONAL PENSION COMMISSION (PENCOM)",
  "NATIONAL PETROLEUM INVESTMENT MANAGEMENT SERVICES (NAPIMS)",
  "NATIONAL POPULATION COMMISSION",
  "NATIONAL PRIMARY HEALTH CARE DEVELOPMENT AGENCY",
  "NATIONAL SPACE RESEARCH AND DEVELOPMENT AGENCY (NASRDA)",
  "NATIONAL TEACHERS INSTITUTE",
  "NCC",
  "NEIMETH INT. PHARMACEUTICALS PLC",
  "NESTLE NIGERIA PLC",
  "NETFLIX NIGERIA",
  "NETLINK DIGITAL SOLUTIONS",
  "NEW CRYSTAL COMMUNICATIONS LTD",
  "NEW HAMPSHIRE CAPITAL LIMITED",
  "NEWREST ASL NIGERIA LIMITED",
  "NEXIM BANK",
  "NHN COURIERS",
  "NIGER DELTA POWER HOLDING COMPANY",
  "NIGER INSURANCE PLC",
  "NIGER STATE GOVERNMENT",
  "NIGERIA BULK ELECTRICITY TRADING PLC",
  "NIGERIA DEPOSIT INSURANCE CORPORATION (NDIC)",
  "NIGERIA INTER-BANK SETTLEMENT SYSTEM PLC (NIBSS)",
  "NIGERIA LNG LIMITED",
  "NIGERIA MORTGAGE REFINANCE COMPANY (NMRC)",
  "NIGERIA NATIONAL PETROLEUM CORPORATION (NNPC)",
  "NIGERIA POLICE FORCE",
  "NIGERIA PORTS AUTHORITY",
  "NIGERIA PRISONS SERVICE",
  "NIGERIA SECURITY AND CIVIL DEFENCE CORPS (NSCDC)",
  "NIGERIA SOVEREIGN INVESTMENT AUTHORITY",
  "NIGERIA STOCK EXCHANGE",
  "NIGERIAN AIR FORCE",
  "NIGERIAN AIRSPACE MANAGEMENT AGENCY (NAMA)",
  "NIGERIAN ARMY",
  "NIGERIAN BOTTLING COMPANY PLC",
  "NIGERIAN BREWERIES PLC",
  "NIGERIAN CIVIL AVIATION AUTHORITY (NCAA)",
  "NIGERIAN COMMUNICATIONS COMMISSION (NCC)",
  "NIGERIAN CUSTOMS SERVICE",
  "NIGERIAN ECONOMIC SUMMIT GROUP",
  "NIGERIAN ELECTRICITY REGULATORY COMMISSION (NERC)",
  "NIGERIAN EXPORT PROMOTION COUNCIL",
  "NIGERIAN IMMIGRATION SERVICE",
  "NIGERIAN MARITIME ADMINISTRATION AND SAFETY AGENCY (NIMASA)",
  "NIGERIAN NAVY",
  "NIGERIAN TELEVISION AUTHORITY (NTA)",
  "NOVA MERCHANT BANK",
  "NNPC RETAIL LTD",
  "NOVA MERCHANT BANK",
  "OANDO PLC",
  "OGI CAPITAL LIMITED",
  "OGUN STATE GOVERNMENT",
  "OIL AND GAS FREE ZONE AUTHORITY",
  "OLAM NIGERIA LIMITED",
  "ONDO STATE GOVERNMENT",
  "OPAY",
  "ORACLE NIGERIA LTD",
  "OSUN STATE GOVERNMENT",
  "OYO STATE GOVERNMENT",
  "PAGA",
  "PALMPAY",
  "PAN AFRICAN CAPITAL PLC",
  "PARTNERS MEDICAL CENTRE",
  "PASSPORT OFFICE",
  "PAYSTACK",
  "PEACE MICROFINANCE BANK",
  "PENTAGON CONSULTING",
  "PENTSTATES INTERNATIONAL LIMITED",
  "PEPPER SOUP RESTAURANT",
  "PFIZER NIGERIA",
  "PHARMAPLUS NIG. LTD",
  "PHILIPS CONSULTING",
  "PHOTIZO ENERGY LIMITED",
  "PINNACLE OIL & GAS LIMITED",
  "PLATEAU STATE GOVERNMENT",
  "POLARIS BANK LTD",
  "PORTLAND PAINTS & PRODUCTS NIG PLC",
  "PREMIERE BROKERS LIMITED",
  "PRESIDENTIAL ENABLING BUSINESS ENVIRONMENT COUNCIL (PEBEC)",
  "PRESCO PLC",
  "PRIMEWATER VIEW HOTELS",
  "PRIMUS INTERNATIONAL",
  "PROCTER & GAMBLE",
  "PROSHARENG",
  "PROVIDENCE GROUP",
  "PRUDENTIAL ZENITH LIFE INSURANCE",
  "PZ CUSSONS NIGERIA PLC",
  "QUICKMART LIMITED",
  "RACINE BUSINESS VENTURE NIG LTD",
  "RAHEEM MOHAMMED LAW FIRM",
  "RAND MERCHANT BANK",
  "RBC NIGERIA LTD",
  "REAL BANK",
  "RED STAR EXPRESS PLC",
  "REGENCY ALLIANCE INSURANCE PLC",
  "RENAISSANCE CAPITAL",
  "RIVERS STATE GOVERNMENT",
  "RUFF & TUMBLE",
  "SAHARA GROUP",
  "SANLAM LIFE INSURANCE",
  "SARO AGRO SCIENCES LTD",
  "SCB NIGERIA",
  "SCHINDLER NIGERIA LTD",
  "SEC NIGERIA",
  "SECURITIES AND EXCHANGE COMMISSION",
  "SHELTER AFRIQUE",
  "SHELL PETROLEUM DEVELOPMENT COMPANY (SPDC)",
  "SKYE BANK",
  "SLB (SCHLUMBERGER)",
  "SMITHKLINE BEECHAM",
  "SOKOTO STATE GOVERNMENT",
  "SONIA FOODS INDUSTRIES LTD",
  "SPECTRA INDUSTRIES LIMITED",
  "STANBIC IBTC BANK PLC",
  "STANBIC IBTC HOLDINGS",
  "STANBIC IBTC STOCKBROKERS",
  "STANDARD CHARTERED BANK",
  "STANDARD ORGANISATION OF NIGERIA (SON)",
  "STARSIGHT POWER UTILITY LTD",
  "STATE HOUSE ABUJA",
  "STERLING BANK PLC",
  "SUJIMOTO CONSTRUCTION LTD",
  "SUNLIGHT MEDIA VENTURES LTD",
  "SUNTORY BEVERAGE & FOOD NIG LTD",
  "SUPREME COURT",
  "SWISS PHARMA NIGERIA LTD",
  "TAM AFRICA SERVICES LTD",
  "TANGERINE LIFE INSURANCE",
  "TARABA STATE GOVERNMENT",
  "TCN",
  "TEACHING HOSPITAL",
  "TESCOM",
  "TETFUND",
  "THE COCA COLA COMPANY",
  "THE LAW SCHOOL",
  "THE PUNCH NIGERIA LTD",
  "THOMAS WYATT NIGERIA",
  "TIGER BRANDS CONSUMER GOODS",
  "TITAN TRUST BANK",
  "TOLARAM GROUP",
  "TOMMY HILFIGER",
  "TOTAL ENERGIES NIGERIA",
  "TOYOTA NIGERIA LIMITED",
  "TREASURY SINGLE ACCOUNT (TSA)",
  "TROPICAL GENERAL INVESTMENT (TGI)",
  "TRUST MERCHANT BANK LIMITED",
  "TRUSTBOND MORTGAGE BANK",
  "U-CONNECT HR SOLUTIONS LTD",
  "UAC OF NIGERIA PLC",
  "UBA INSURANCE",
  "UBA PENSIONS CUSTODIAN LIMITED",
  "UMUCHINEMERE PROCREDIT MICROFINANCE BANK",
  "UNILEVER NIGERIA PLC",
  "UNION BANK OF NIGERIA PLC",
  "UNION DIAGNOSTIC AND CLINICAL SERVICES PLC",
  "UNION DICON SALT PLC",
  "UNITED BANK FOR AFRICA PLC",
  "UNITED CAPITAL PLC",
  "UNITED NATIONS",
  "UNIVERSITY COLLEGE HOSPITAL IBADAN",
  "UNIVERSITY OF ABUJA",
  "UNIVERSITY OF BENIN",
  "UNIVERSITY OF CALABAR",
  "UNIVERSITY OF IBADAN",
  "UNIVERSITY OF ILORIN",
  "UNIVERSITY OF JOS",
  "UNIVERSITY OF LAGOS",
  "UNIVERSITY OF MAIDUGURI",
  "UNIVERSITY OF NIGERIA",
  "UNIVERSITY OF PORT HARCOURT",
  "UNIVERSITY OF UYO",
  "UPS NIGERIA",
  "UPWAY & PARTNERS",
  "UTILITY SOLUTIONS LIMITED",
  "VERITASI HOMES AND PROPERTIES LTD",
  "VERVE INTERNATIONAL",
  "VFD MICROFINANCE BANK",
  "VIVO ENERGY NIGERIA",
  "WATER CORPORATION",
  "WEMA BANK PLC",
  "WEST AFRICA MILK COMPANY",
  "WESTERN UNION",
  "WESTGATE CONSULT LTD",
  "WICTECH LIMITED",
  "WORLD BANK",
  "WORLD HEALTH ORGANIZATION (WHO)",
  "YOBE STATE GOVERNMENT",
  "ZAMFARA STATE GOVERNMENT",
  "ZEE COMMUNICATIONS NIGERIA LIMITED",
  "ZENITH BANK PLC",
  "ZENITH GENERAL INSURANCE",
  "ZENITH PENSIONS CUSTODIAN LIMITED",
  "ZUBIDU CONSULTING LIMITED",
  "OTHER",
];

// Export as SelectOption format for apply.tsx
export const EMPLOYERS = EMPLOYERS_LIST.map((name) => ({ id: name, name }));
export const IDENTIFICATION_OPTIONS = IDENTIFICATION_TYPES.map((type) => ({
  id: type,
  name: type,
}));
// ============== Styles ==============
const styles = {
  container: {
    minHeight: "100vh",
    background: `linear-gradient(135deg, ${colors.background.main} 0%, #E3F2FD 100%)`,
    padding: "24px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  } as React.CSSProperties,

  innerContainer: {
    maxWidth: "640px",
    margin: "0 auto",
  } as React.CSSProperties,

  header: {
    textAlign: "center" as const,
    marginBottom: "32px",
  },

  logo: {
    width: "160px",
    height: "auto",
    marginBottom: "16px",
  },

  progressContainer: {
    marginBottom: "32px",
  } as React.CSSProperties,

  progressSteps: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0",
  } as React.CSSProperties,

  stepItem: (active: boolean, completed: boolean) =>
    ({
      display: "flex",
      alignItems: "center",
      gap: "8px",
    } as React.CSSProperties),

  stepCircle: (active: boolean, completed: boolean) =>
    ({
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: completed
        ? colors.status.success
        : active
        ? colors.primary.gradient
        : "#E2E8F0",
      color: completed || active ? "#FFFFFF" : colors.text.muted,
      fontSize: "14px",
      fontWeight: 600,
      transition: "all 0.3s ease",
      boxShadow: active ? shadows.glow : "none",
    } as React.CSSProperties),

  stepLine: (completed: boolean) =>
    ({
      width: "40px",
      height: "3px",
      background: completed ? colors.status.success : "#E2E8F0",
      borderRadius: "2px",
      marginLeft: "4px",
      marginRight: "4px",
    } as React.CSSProperties),

  card: {
    background: colors.background.card,
    borderRadius: "20px",
    padding: "32px",
    boxShadow: shadows.card,
    border: `1px solid ${colors.border.light}`,
  } as React.CSSProperties,

  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: colors.text.primary,
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  } as React.CSSProperties,

  subtitle: {
    fontSize: "15px",
    color: colors.text.secondary,
    marginBottom: "24px",
    lineHeight: 1.6,
  } as React.CSSProperties,

  formSection: {
    marginBottom: "24px",
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: colors.text.primary,
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  } as React.CSSProperties,

  inputGroup: {
    marginBottom: "16px",
  } as React.CSSProperties,

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    color: colors.text.primary,
    marginBottom: "6px",
  } as React.CSSProperties,

  inputWrapper: {
    position: "relative" as const,
  } as React.CSSProperties,

  input: {
    width: "100%",
    padding: "14px 16px 14px 44px",
    fontSize: "15px",
    border: `2px solid ${colors.border.light}`,
    borderRadius: "12px",
    outline: "none",
    transition: "all 0.2s ease",
    background: "#FFFFFF",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,

  inputIcon: {
    position: "absolute" as const,
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: colors.text.muted,
    pointerEvents: "none" as const,
  } as React.CSSProperties,

  selectContainer: {
    position: "relative" as const,
    marginBottom: "16px",
  } as React.CSSProperties,

  selectTrigger: {
    width: "100%",
    padding: "14px 16px 14px 44px",
    fontSize: "15px",
    border: `2px solid ${colors.border.light}`,
    borderRadius: "12px",
    background: "#FFFFFF",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    transition: "all 0.2s ease",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,

  dropdown: {
    position: "absolute" as const,
    top: "calc(100% + 4px)",
    left: 0,
    right: 0,
    background: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: shadows.xl,
    border: `1px solid ${colors.border.light}`,
    zIndex: 100,
    maxHeight: "300px",
    overflow: "hidden",
  } as React.CSSProperties,

  searchInput: {
    width: "100%",
    padding: "14px 16px 14px 44px",
    fontSize: "14px",
    border: "none",
    borderBottom: `1px solid ${colors.border.light}`,
    outline: "none",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,

  optionsList: {
    maxHeight: "240px",
    overflow: "auto",
  } as React.CSSProperties,

  option: {
    padding: "12px 16px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background 0.15s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  } as React.CSSProperties,

  fileUpload: {
    border: `2px dashed ${colors.border.light}`,
    borderRadius: "16px",
    padding: "32px 24px",
    textAlign: "center" as const,
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: "#FAFAFA",
  } as React.CSSProperties,

  filePreview: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    background: "#F8FAFC",
    borderRadius: "12px",
    border: `1px solid ${colors.border.light}`,
  } as React.CSSProperties,

  button: {
    width: "100%",
    padding: "16px 24px",
    fontSize: "16px",
    fontWeight: 600,
    color: "#FFFFFF",
    background: colors.primary.gradient,
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    boxShadow: shadows.md,
  } as React.CSSProperties,

  buttonSecondary: {
    width: "100%",
    padding: "14px 24px",
    fontSize: "15px",
    fontWeight: 500,
    color: colors.text.primary,
    background: "#F1F5F9",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s ease",
  } as React.CSSProperties,

  buttonGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
  } as React.CSSProperties,

  error: {
    fontSize: "13px",
    color: colors.status.error,
    marginTop: "6px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  } as React.CSSProperties,

  infoBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "16px",
    background: "#EEF6FF",
    borderRadius: "12px",
    marginBottom: "24px",
  } as React.CSSProperties,
};

// ============== Employer Select Component ==============
// Commented out as employer field is no longer required
/* 
interface EmployerSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const EmployerSelect: React.FC<EmployerSelectProps> = ({
  value,
  onChange,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredEmployers = EMPLOYERS_LIST.filter((emp) =>
    emp.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={styles.selectContainer} ref={dropdownRef}>
      <label style={styles.label}>Employer *</label>
      <div
        style={{
          ...styles.selectTrigger,
          borderColor: error
            ? colors.status.error
            : isOpen
            ? colors.primary.main
            : colors.border.light,
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={styles.inputIcon}>
          <Briefcase size={18} />
        </span>
        <span
          style={{
            color: value ? colors.text.primary : colors.text.muted,
            flex: 1,
            textAlign: "left",
          }}
        >
          {value || "Select your employer"}
        </span>
        <ChevronDown
          size={18}
          style={{
            color: colors.text.muted,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            style={styles.dropdown}
          >
            <div style={{ position: "relative" }}>
              <span
                style={{
                  ...styles.inputIcon,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search employers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
                autoFocus
              />
            </div>
            <div style={styles.optionsList}>
              {filteredEmployers.map((employer) => (
                <div
                  key={employer}
                  style={{
                    ...styles.option,
                    background: employer === value ? "#EEF6FF" : "transparent",
                  }}
                  onClick={() => {
                    onChange(employer);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#F8FAFC";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      employer === value ? "#EEF6FF" : "transparent";
                  }}
                >
                  <Building2 size={16} color={colors.text.muted} />
                  {employer}
                  {employer === value && (
                    <CheckCircle
                      size={16}
                      color={colors.status.success}
                      style={{ marginLeft: "auto" }}
                    />
                  )}
                </div>
              ))}
              {filteredEmployers.length === 0 && (
                <div
                  style={{
                    padding: "24px",
                    textAlign: "center",
                    color: colors.text.muted,
                  }}
                >
                  No employers found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {error && (
        <div style={styles.error}>
          <AlertCircle size={14} /> {error}
        </div>
      )}
    </div>
  );
};
*/

// ============== Identification Type Select Component ==============
interface IdentificationTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const IdentificationTypeSelect: React.FC<IdentificationTypeSelectProps> = ({
  value,
  onChange,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={styles.selectContainer} ref={dropdownRef}>
      <label style={styles.label}>Identification Type *</label>
      <div
        style={{
          ...styles.selectTrigger,
          borderColor: error
            ? colors.status.error
            : isOpen
            ? colors.primary.main
            : colors.border.light,
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={styles.inputIcon}>
          <CreditCard size={18} />
        </span>
        <span
          style={{
            color: value ? colors.text.primary : colors.text.muted,
            flex: 1,
            textAlign: "left",
          }}
        >
          {value || "Select identification type"}
        </span>
        <ChevronDown
          size={18}
          style={{
            color: colors.text.muted,
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            style={styles.dropdown}
          >
            <div style={styles.optionsList}>
              {IDENTIFICATION_TYPES.map((idType) => (
                <div
                  key={idType}
                  style={{
                    ...styles.option,
                    background: idType === value ? "#EEF6FF" : "transparent",
                  }}
                  onClick={() => {
                    onChange(idType);
                    setIsOpen(false);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#F8FAFC";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      idType === value ? "#EEF6FF" : "transparent";
                  }}
                >
                  <CreditCard size={16} color={colors.text.muted} />
                  {idType}
                  {idType === value && (
                    <CheckCircle
                      size={16}
                      color={colors.status.success}
                      style={{ marginLeft: "auto" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {error && (
        <div style={styles.error}>
          <AlertCircle size={14} /> {error}
        </div>
      )}
    </div>
  );
};

// ============== Google Places Autocomplete Component ==============
declare global {
  interface Window {
    google: any;
  }
}

interface GooglePlacesInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
}

const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  value,
  onChange,
  onBlur,
  error,
  touched,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if Google Places API is loaded
    const checkGoogleLoaded = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsLoaded(true);
        initAutocomplete();
      } else {
        setTimeout(checkGoogleLoaded, 100);
      }
    };
    checkGoogleLoaded();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initAutocomplete = () => {
    if (!inputRef.current || !window.google) return;

    const autocompleteService =
      new window.google.maps.places.AutocompleteService();
    autocompleteRef.current = autocompleteService;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length > 2 && autocompleteRef.current) {
      autocompleteRef.current.getPlacePredictions(
        {
          input: inputValue,
          componentRestrictions: { country: "ng" }, // Restrict to Nigeria
          types: ["address"],
        },
        (predictions: any[], status: string) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setSuggestions(predictions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: any) => {
    onChange(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div style={styles.inputGroup} ref={containerRef}>
      <label style={styles.label}>Address Line *</label>
      <div style={{ ...styles.inputWrapper, position: "relative" }}>
        <span style={styles.inputIcon}>
          <MapPin size={18} />
        </span>
        <input
          ref={inputRef}
          type="text"
          placeholder={
            isLoaded
              ? "Start typing your address..."
              : "Enter your residential address"
          }
          value={value}
          onChange={handleInputChange}
          onBlur={() => {
            setTimeout(() => {
              setShowSuggestions(false);
              onBlur();
            }, 200);
          }}
          onFocus={(e) => {
            e.target.style.borderColor = colors.primary.main;
            e.target.style.boxShadow = shadows.glow;
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlurCapture={(e) => {
            e.target.style.borderColor = error
              ? colors.status.error
              : colors.border.light;
            e.target.style.boxShadow = "none";
          }}
          style={{
            ...styles.input,
            borderColor:
              touched && error ? colors.status.error : colors.border.light,
          }}
          autoComplete="off"
        />

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                background: "#FFFFFF",
                borderRadius: "12px",
                boxShadow: shadows.xl,
                border: `1px solid ${colors.border.light}`,
                zIndex: 100,
                maxHeight: "240px",
                overflow: "auto",
              }}
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.place_id || index}
                  style={{
                    padding: "12px 16px",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "background 0.15s ease",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    borderBottom:
                      index < suggestions.length - 1
                        ? `1px solid ${colors.border.light}`
                        : "none",
                  }}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#F8FAFC";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <MapPin
                    size={16}
                    color={colors.primary.main}
                    style={{ marginTop: "2px", flexShrink: 0 }}
                  />
                  <div>
                    <div
                      style={{ fontWeight: 500, color: colors.text.primary }}
                    >
                      {suggestion.structured_formatting?.main_text ||
                        suggestion.description.split(",")[0]}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: colors.text.muted,
                        marginTop: "2px",
                      }}
                    >
                      {suggestion.structured_formatting?.secondary_text ||
                        suggestion.description}
                    </div>
                  </div>
                </div>
              ))}
              {/* Google Attribution */}
              <div
                style={{
                  padding: "8px 16px",
                  fontSize: "11px",
                  color: colors.text.muted,
                  textAlign: "right",
                  borderTop: `1px solid ${colors.border.light}`,
                  background: "#FAFAFA",
                }}
              >
                Powered by Google
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {touched && error && (
        <div style={styles.error}>
          <AlertCircle size={14} /> {error}
        </div>
      )}
    </div>
  );
};

// ============== Progress Steps Component ==============
const ProgressSteps: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps = [
    { icon: User, label: "Start" },
    { icon: FileText, label: "Review" },
    { icon: User, label: "Details" },
    { icon: CreditCard, label: "Loan" },
    { icon: CheckCircle, label: "Confirm" },
  ];

  return (
    <div style={styles.progressContainer}>
      <div style={styles.progressSteps}>
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;

          return (
            <React.Fragment key={index}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                style={styles.stepItem(isActive, isCompleted)}
              >
                <div style={styles.stepCircle(isActive, isCompleted)}>
                  {isCompleted ? (
                    <CheckCircle size={18} />
                  ) : (
                    <StepIcon size={18} />
                  )}
                </div>
              </motion.div>
              {index < steps.length - 1 && (
                <div style={styles.stepLine(isCompleted)} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// ============== Main Component ==============
const PersonalDetails: React.FC = () => {
  const navigate = useNavigate();
  const [savePersonalDetails, { isLoading }] = useSavePersonalDetailsMutation();
  const [uploadID, { isLoading: isUploading }] = useUploadIDMutation();

  const [formData, setFormData] = useState({
    employer: "",
    addressLine: "",
    identificationType: "",
    idNumber: "",
    expiryDate: "",
    document: "",
  });
  const [frontDocument, setFrontDocument] = useState<File | null>(null);
  const [backDocument, setBackDocument] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const frontFileInputRef = useRef<HTMLInputElement>(null);
  const backFileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      // Clear expiry date if switching to an ID type that doesn't require it
      if (field === "identificationType") {
        const requiresExpiry =
          value === "International Passport" || value === "Driver's License";
        if (!requiresExpiry) {
          newData.expiryDate = "";
        }
      }
      return newData;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    let error = "";
    const requiresExpiry =
      formData.identificationType === "International Passport" ||
      formData.identificationType === "Driver's License";

    switch (field) {
      // case "employer":
      //   if (!formData.employer) error = "Please select your employer";
      //   break;
      case "addressLine":
        if (!formData.addressLine) error = "Please enter your address";
        else if (formData.addressLine.length < 3)
          error = "Address must be at least 3 characters";
        break;
      case "identificationType":
        if (!formData.identificationType)
          error = "Please select an identification type";
        break;
      case "idNumber":
        if (!formData.idNumber) error = "Please enter your ID number";
        else if (formData.idNumber.length < 5)
          error = "ID number must be at least 5 characters";
        break;
      case "expiryDate":
        if (requiresExpiry && !formData.expiryDate) {
          error = "Please enter the expiry date";
        } else if (requiresExpiry && formData.expiryDate) {
          const expiry = new Date(formData.expiryDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (expiry <= today) {
            error = "Expiry date must be in the future";
          }
        }
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateForm = () => {
    const requiresExpiry =
      formData.identificationType === "International Passport" ||
      formData.identificationType === "Driver's License";
    const fields = ["addressLine", "identificationType", "idNumber"];
    if (requiresExpiry) {
      fields.push("expiryDate");
    }
    let isValid = true;
    fields.forEach((field) => {
      if (!validateField(field)) isValid = false;
    });
    if (!frontDocument) {
      setErrors((prev) => ({
        ...prev,
        frontDocument: "Please upload the front of your ID document",
      }));
      isValid = false;
    }
    if (!backDocument) {
      setErrors((prev) => ({
        ...prev,
        backDocument: "Please upload the back of your ID document",
      }));
      isValid = false;
    }
    return isValid;
  };

  const handleFrontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          frontDocument: "Please upload a valid image (JPG, PNG) or PDF file",
        }));
        return;
      }
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          frontDocument: "File size must be less than 5MB",
        }));
        return;
      }
      setFrontDocument(file);
      setErrors((prev) => ({ ...prev, frontDocument: "" }));
    }
  };

  const handleBackFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          backDocument: "Please upload a valid image (JPG, PNG) or PDF file",
        }));
        return;
      }
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          backDocument: "File size must be less than 5MB",
        }));
        return;
      }
      setBackDocument(file);
      setErrors((prev) => ({ ...prev, backDocument: "" }));
    }
  };

  // Convert file to base64 (strips the data URL prefix)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64String = result.includes(",")
          ? result.split(",")[1]
          : result;
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Get file extension from file name or mime type
  const getFileExtension = (file: File): string => {
    // Try to get extension from file name
    const fileNameParts = file.name.split(".");
    if (fileNameParts.length > 1) {
      return fileNameParts.pop()?.toLowerCase() || "";
    }
    // Fallback to mime type
    const mimeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "application/pdf": "pdf",
    };
    return mimeToExt[file.type] || "";
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const loanId = localStorage.getItem("loanId");
      if (!loanId) {
        navigate("/");
        return;
      }

      const imageIds: string[] = [];

      // Upload front document
      if (frontDocument) {
        const frontBase64 = await fileToBase64(frontDocument);
        const frontExtension = getFileExtension(frontDocument);
        const frontDocumentName = `ID_Front_${
          formData.identificationType
        }_${Date.now()}`;

        console.log("Uploading front document...");
        const frontUploadResponse = await uploadID({
          documentName: frontDocumentName,
          base64String: frontBase64,
          fileExtension: frontExtension,
        }).unwrap();

        console.log("Front upload response:", frontUploadResponse);

        const frontId = frontUploadResponse.data.id;
        imageIds.push(frontId);
        console.log("Front document uploaded. ID:", frontId);
      }

      // Upload back document
      if (backDocument) {
        const backBase64 = await fileToBase64(backDocument);
        const backExtension = getFileExtension(backDocument);
        const backDocumentName = `ID_Back_${
          formData.identificationType
        }_${Date.now()}`;

        console.log("Uploading back document...");
        const backUploadResponse = await uploadID({
          documentName: backDocumentName,
          base64String: backBase64,
          fileExtension: backExtension,
        }).unwrap();

        const backId = backUploadResponse.data.id;
        imageIds.push(backId);
        console.log("Back document uploaded. ID:", backId);
      }

      const formDataToSubmit = {
        address: formData.addressLine,
        idNumber: formData.idNumber,
        imageIds: imageIds,
        loanId: loanId,
      };
      console.log("Submitting form data:", formDataToSubmit);

      const response = await savePersonalDetails(formDataToSubmit).unwrap();

      console.log("Save personal details response:", response);
      if (response.success) {
        console.log("personalResponse", response);

        // Store maxLoanEligible if it exists in the response
        if (response.data?.maxLoanEligible) {
          localStorage.setItem(
            "maxLoanEligible",
            response.data.maxLoanEligible.toString()
          );
          console.log("Stored maxLoanEligible:", response.data.maxLoanEligible);
        }

        navigate("/loan-application");
      }
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        submit:
          error?.data?.message || "Something went wrong. Please try again.",
      }));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.header}
        >
          <img
            src="/logo.png"
            alt="Logo"
            style={styles.logo}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </motion.div>

        <ProgressSteps currentStep={3} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={styles.card}
        >
          <h1 style={styles.title}>
            <User size={28} color={colors.primary.main} />
            Personal Details
          </h1>
          <p style={styles.subtitle}>
            Help us verify your identity by providing your personal information
            and uploading a valid ID document.
          </p>

          <div style={styles.infoBox}>
            <Shield
              size={20}
              color={colors.primary.main}
              style={{ flexShrink: 0, marginTop: "2px" }}
            />
            <div>
              <p
                style={{
                  fontSize: "14px",
                  color: colors.text.primary,
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                Your data is secure
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: colors.text.secondary,
                  margin: "4px 0 0",
                }}
              >
                We use bank-level encryption to protect your personal
                information.
              </p>
            </div>
          </div>

          {/* Employment Section */}
          {/* <div style={styles.formSection}>
            <div style={styles.sectionTitle}>
              <Briefcase size={16} color={colors.primary.main} />
              Employment Information
            </div>

            <EmployerSelect
              value={formData.employer}
              onChange={(value) => handleInputChange("employer", value)}
              error={touched.employer ? errors.employer : undefined}
            />
          </div> */}

          {/* Address Section */}
          <div style={styles.formSection}>
            <div style={styles.sectionTitle}>
              <Home size={16} color={colors.primary.main} />
              Residential Address
            </div>

            <GooglePlacesInput
              value={formData.addressLine}
              onChange={(value) => handleInputChange("addressLine", value)}
              onBlur={() => handleBlur("addressLine")}
              error={errors.addressLine}
              touched={touched.addressLine}
            />
          </div>

          {/* Identity Section */}
          <div style={styles.formSection}>
            <div style={styles.sectionTitle}>
              <CreditCard size={16} color={colors.primary.main} />
              Identity Verification
            </div>

            {/* Identification Type Selector */}
            <IdentificationTypeSelect
              value={formData.identificationType}
              onChange={(value) =>
                handleInputChange("identificationType", value)
              }
              error={
                touched.identificationType
                  ? errors.identificationType
                  : undefined
              }
            />

            {/* ID Number - shown for all identification types */}
            {formData.identificationType && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                style={styles.inputGroup}
              >
                <label style={styles.label}>ID Number *</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>
                    <CreditCard size={18} />
                  </span>
                  <input
                    type="text"
                    placeholder={`Enter your ${formData.identificationType} number`}
                    value={formData.idNumber}
                    onChange={(e) =>
                      handleInputChange("idNumber", e.target.value)
                    }
                    onBlur={() => handleBlur("idNumber")}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary.main;
                      e.target.style.boxShadow = shadows.glow;
                    }}
                    onBlurCapture={(e) => {
                      e.target.style.borderColor = errors.idNumber
                        ? colors.status.error
                        : colors.border.light;
                      e.target.style.boxShadow = "none";
                    }}
                    style={{
                      ...styles.input,
                      borderColor:
                        touched.idNumber && errors.idNumber
                          ? colors.status.error
                          : colors.border.light,
                    }}
                  />
                </div>
                {touched.idNumber && errors.idNumber && (
                  <div style={styles.error}>
                    <AlertCircle size={14} /> {errors.idNumber}
                  </div>
                )}
              </motion.div>
            )}

            {/* Expiry Date - only for International Passport and Driver's License */}
            {(formData.identificationType === "International Passport" ||
              formData.identificationType === "Driver's License") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                style={styles.inputGroup}
              >
                <label style={styles.label}>Expiry Date *</label>
                <div style={styles.inputWrapper}>
                  <span style={styles.inputIcon}>
                    <Calendar size={18} />
                  </span>
                  <input
                    type="date"
                    placeholder="Select expiry date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      handleInputChange("expiryDate", e.target.value)
                    }
                    onBlur={() => handleBlur("expiryDate")}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary.main;
                      e.target.style.boxShadow = shadows.glow;
                    }}
                    onBlurCapture={(e) => {
                      e.target.style.borderColor = errors.expiryDate
                        ? colors.status.error
                        : colors.border.light;
                      e.target.style.boxShadow = "none";
                    }}
                    min={new Date().toISOString().split("T")[0]}
                    style={{
                      ...styles.input,
                      borderColor:
                        touched.expiryDate && errors.expiryDate
                          ? colors.status.error
                          : colors.border.light,
                    }}
                  />
                </div>
                {touched.expiryDate && errors.expiryDate && (
                  <div style={styles.error}>
                    <AlertCircle size={14} /> {errors.expiryDate}
                  </div>
                )}
              </motion.div>
            )}

            {/* Front Document Upload */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>ID Document (Front) *</label>
              <input
                type="file"
                ref={frontFileInputRef}
                onChange={handleFrontFileChange}
                accept="image/*,.pdf"
                style={{ display: "none" }}
              />

              {!frontDocument ? (
                <motion.div
                  whileHover={{ borderColor: colors.primary.main }}
                  style={{
                    ...styles.fileUpload,
                    borderColor: errors.frontDocument
                      ? colors.status.error
                      : colors.border.light,
                  }}
                  onClick={() => frontFileInputRef.current?.click()}
                >
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Upload
                      size={40}
                      color={colors.primary.main}
                      style={{ marginBottom: "12px" }}
                    />
                  </motion.div>
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: 500,
                      color: colors.text.primary,
                      margin: 0,
                    }}
                  >
                    Click to upload front of ID
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: colors.text.muted,
                      margin: "8px 0 0",
                    }}
                  >
                    JPG, PNG or PDF (max 5MB)
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={styles.filePreview}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: "#E3F2FD",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {frontDocument.type.includes("pdf") ? (
                      <FileText size={24} color={colors.primary.main} />
                    ) : (
                      <FileImage size={24} color={colors.primary.main} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: colors.text.primary,
                        margin: 0,
                      }}
                    >
                      {frontDocument.name}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: colors.text.muted,
                        margin: "4px 0 0",
                      }}
                    >
                      {(frontDocument.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setFrontDocument(null);
                      if (frontFileInputRef.current)
                        frontFileInputRef.current.value = "";
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "8px",
                    }}
                  >
                    <X size={20} color={colors.text.muted} />
                  </motion.button>
                </motion.div>
              )}
              {errors.frontDocument && (
                <div style={styles.error}>
                  <AlertCircle size={14} /> {errors.frontDocument}
                </div>
              )}
            </div>

            {/* Back Document Upload */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>ID Document (Back) *</label>
              <input
                type="file"
                ref={backFileInputRef}
                onChange={handleBackFileChange}
                accept="image/*,.pdf"
                style={{ display: "none" }}
              />

              {!backDocument ? (
                <motion.div
                  whileHover={{ borderColor: colors.primary.main }}
                  style={{
                    ...styles.fileUpload,
                    borderColor: errors.backDocument
                      ? colors.status.error
                      : colors.border.light,
                  }}
                  onClick={() => backFileInputRef.current?.click()}
                >
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <Upload
                      size={40}
                      color={colors.primary.main}
                      style={{ marginBottom: "12px" }}
                    />
                  </motion.div>
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: 500,
                      color: colors.text.primary,
                      margin: 0,
                    }}
                  >
                    Click to upload back of ID
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: colors.text.muted,
                      margin: "8px 0 0",
                    }}
                  >
                    JPG, PNG or PDF (max 5MB)
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={styles.filePreview}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: "#E3F2FD",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {backDocument.type.includes("pdf") ? (
                      <FileText size={24} color={colors.primary.main} />
                    ) : (
                      <FileImage size={24} color={colors.primary.main} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: colors.text.primary,
                        margin: 0,
                      }}
                    >
                      {backDocument.name}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: colors.text.muted,
                        margin: "4px 0 0",
                      }}
                    >
                      {(backDocument.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setBackDocument(null);
                      if (backFileInputRef.current)
                        backFileInputRef.current.value = "";
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "8px",
                    }}
                  >
                    <X size={20} color={colors.text.muted} />
                  </motion.button>
                </motion.div>
              )}
              {errors.backDocument && (
                <div style={styles.error}>
                  <AlertCircle size={14} /> {errors.backDocument}
                </div>
              )}
            </div>
          </div>

          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "12px 16px",
                background: "#FEF2F2",
                borderRadius: "12px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <AlertCircle size={18} color={colors.status.error} />
              <span style={{ fontSize: "14px", color: colors.status.error }}>
                {errors.submit}
              </span>
            </motion.div>
          )}

          <div style={styles.buttonGroup}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ ...styles.buttonSecondary, flex: 1 }}
              onClick={() => navigate("/statement-review")}
            >
              <ArrowLeft size={18} />
              Back
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: shadows.lg }}
              whileTap={{ scale: 0.98 }}
              style={{
                ...styles.button,
                flex: 2,
                opacity: isLoading || isUploading ? 0.7 : 1,
              }}
              onClick={handleSubmit}
              disabled={isLoading || isUploading}
            >
              {isLoading || isUploading ? (
                <>
                  <Loader2
                    size={20}
                    className="animate-spin"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  {isUploading ? "Uploading..." : "Saving..."}
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: colors.text.muted,
            marginTop: "24px",
          }}
        >
          Your information is protected with bank-level security
        </motion.p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: ${colors.text.muted};
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #F1F5F9;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
      `}</style>
    </div>
  );
};

export default PersonalDetails;
