import {
  BarangayInfo,
  Zone,
  Household,
  Resident,
  BarangayOfficial,
  CertificateRecord,
  BlotterRecord,
  Announcement,
  BarangayEvent
} from '../types';

export function generateSqlStatements(data: {
  barangay: BarangayInfo;
  zones: Zone[];
  households: Household[];
  residents: Resident[];
  officials: BarangayOfficial[];
  certificates: CertificateRecord[];
  blotters: BlotterRecord[];
  announcements: Announcement[];
  events: BarangayEvent[];
}): string {
  const escapeSql = (str: string | undefined | null) => {
    if (str === undefined || str === null) return 'NULL';
    return `'${str.replace(/'/g, "''")}'`;
  };

  let sql = `-- ========================================================\n`;
  sql += `-- BARANGAY INFORMATION MANAGEMENT SYSTEM DATABASE SEED\n`;
  sql += `-- BARANGAY SF II, NESTOR NABAUNAG, LIMAY, BATAAN (2104)\n`;
  sql += `-- Generated on: ${new Date().toISOString()}\n`;
  sql += `-- Total Households: ${data.households.length} | Total Residents: ${data.residents.length}\n`;
  sql += `-- ========================================================\n\n`;

  // 1. BARANGAY TABLE
  sql += `-- 1. TABLE: BARANGAY\n`;
  sql += `CREATE TABLE IF NOT EXISTS barangay (\n`;
  sql += `  barangay_id VARCHAR(50) PRIMARY KEY,\n`;
  sql += `  barangay_name VARCHAR(100) NOT NULL,\n`;
  sql += `  municipality VARCHAR(100) NOT NULL,\n`;
  sql += `  province VARCHAR(100) NOT NULL,\n`;
  sql += `  address VARCHAR(255) NOT NULL,\n`;
  sql += `  zip_code VARCHAR(10) NOT NULL,\n`;
  sql += `  contact_number VARCHAR(50),\n`;
  sql += `  email VARCHAR(100),\n`;
  sql += `  barangay_captain VARCHAR(100),\n`;
  sql += `  population INT,\n`;
  sql += `  total_households INT\n`;
  sql += `);\n\n`;

  const b = data.barangay;
  sql += `INSERT INTO barangay (barangay_id, barangay_name, municipality, province, address, zip_code, contact_number, email, barangay_captain, population, total_households)\nVALUES (`;
  sql += `${escapeSql(b.barangay_id)}, ${escapeSql(b.barangay_name)}, ${escapeSql(b.municipality)}, ${escapeSql(b.province)}, ${escapeSql(b.address)}, ${escapeSql(b.zip_code)}, ${escapeSql(b.contact_number)}, ${escapeSql(b.email)}, ${escapeSql(b.barangay_captain)}, ${data.residents.length}, ${data.households.length});\n\n`;

  // 2. ZONES TABLE
  sql += `-- 2. TABLE: ZONES\n`;
  sql += `CREATE TABLE IF NOT EXISTS zones (\n`;
  sql += `  zone_id VARCHAR(50) PRIMARY KEY,\n`;
  sql += `  barangay_id VARCHAR(50) NOT NULL,\n`;
  sql += `  zone_name VARCHAR(100) NOT NULL,\n`;
  sql += `  zone_leader VARCHAR(100),\n`;
  sql += `  description TEXT,\n`;
  sql += `  FOREIGN KEY (barangay_id) REFERENCES barangay(barangay_id)\n`;
  sql += `);\n\n`;

  data.zones.forEach(z => {
    sql += `INSERT INTO zones (zone_id, barangay_id, zone_name, zone_leader, description)\n`;
    sql += `VALUES (${escapeSql(z.zone_id)}, ${escapeSql(z.barangay_id)}, ${escapeSql(z.zone_name)}, ${escapeSql(z.zone_leader)}, ${escapeSql(z.description)});\n`;
  });
  sql += `\n`;

  // 3. HOUSEHOLDS TABLE
  sql += `-- 3. TABLE: HOUSEHOLDS (${data.households.length} records)\n`;
  sql += `CREATE TABLE IF NOT EXISTS households (\n`;
  sql += `  household_id VARCHAR(50) PRIMARY KEY,\n`;
  sql += `  zone_id VARCHAR(50) NOT NULL,\n`;
  sql += `  house_number VARCHAR(50),\n`;
  sql += `  street_name VARCHAR(100),\n`;
  sql += `  household_head VARCHAR(100) NOT NULL,\n`;
  sql += `  family_name VARCHAR(100) NOT NULL,\n`;
  sql += `  contact_number VARCHAR(50),\n`;
  sql += `  household_type VARCHAR(50),\n`;
  sql += `  monthly_income DECIMAL(10,2),\n`;
  sql += `  number_of_members INT,\n`;
  sql += `  registration_date DATE,\n`;
  sql += `  status VARCHAR(20),\n`;
  sql += `  FOREIGN KEY (zone_id) REFERENCES zones(zone_id)\n`;
  sql += `);\n\n`;

  data.households.forEach(h => {
    sql += `INSERT INTO households (household_id, zone_id, house_number, street_name, household_head, family_name, contact_number, household_type, monthly_income, number_of_members, registration_date, status)\n`;
    sql += `VALUES (${escapeSql(h.household_id)}, ${escapeSql(h.zone_id)}, ${escapeSql(h.house_number)}, ${escapeSql(h.street_name)}, ${escapeSql(h.household_head)}, ${escapeSql(h.family_name)}, ${escapeSql(h.contact_number)}, ${escapeSql(h.household_type)}, ${h.monthly_income}, ${h.number_of_members}, ${escapeSql(h.registration_date)}, ${escapeSql(h.status)});\n`;
  });
  sql += `\n`;

  // 4. RESIDENTS TABLE
  sql += `-- 4. TABLE: RESIDENTS (${data.residents.length} records)\n`;
  sql += `CREATE TABLE IF NOT EXISTS residents (\n`;
  sql += `  resident_id VARCHAR(50) PRIMARY KEY,\n`;
  sql += `  household_id VARCHAR(50) NOT NULL,\n`;
  sql += `  first_name VARCHAR(100) NOT NULL,\n`;
  sql += `  middle_name VARCHAR(100),\n`;
  sql += `  last_name VARCHAR(100) NOT NULL,\n`;
  sql += `  suffix VARCHAR(20),\n`;
  sql += `  gender VARCHAR(20),\n`;
  sql += `  birth_date DATE,\n`;
  sql += `  age INT,\n`;
  sql += `  civil_status VARCHAR(50),\n`;
  sql += `  relationship_to_head VARCHAR(100),\n`;
  sql += `  occupation VARCHAR(100),\n`;
  sql += `  educational_attainment VARCHAR(100),\n`;
  sql += `  citizenship VARCHAR(50),\n`;
  sql += `  religion VARCHAR(50),\n`;
  sql += `  voter_status BOOLEAN,\n`;
  sql += `  philhealth_member BOOLEAN,\n`;
  sql += `  senior_citizen BOOLEAN,\n`;
  sql += `  pwd BOOLEAN,\n`;
  sql += `  solo_parent BOOLEAN,\n`;
  sql += `  contact_number VARCHAR(50),\n`;
  sql += `  email VARCHAR(100),\n`;
  sql += `  status VARCHAR(20),\n`;
  sql += `  FOREIGN KEY (household_id) REFERENCES households(household_id)\n`;
  sql += `);\n\n`;

  data.residents.forEach(r => {
    sql += `INSERT INTO residents (resident_id, household_id, first_name, middle_name, last_name, suffix, gender, birth_date, age, civil_status, relationship_to_head, occupation, educational_attainment, citizenship, religion, voter_status, philhealth_member, senior_citizen, pwd, solo_parent, contact_number, email, status)\n`;
    sql += `VALUES (${escapeSql(r.resident_id)}, ${escapeSql(r.household_id)}, ${escapeSql(r.first_name)}, ${escapeSql(r.middle_name)}, ${escapeSql(r.last_name)}, ${escapeSql(r.suffix)}, ${escapeSql(r.gender)}, ${escapeSql(r.birth_date)}, ${r.age}, ${escapeSql(r.civil_status)}, ${escapeSql(r.relationship_to_head)}, ${escapeSql(r.occupation)}, ${escapeSql(r.educational_attainment)}, ${escapeSql(r.citizenship)}, ${escapeSql(r.religion)}, ${r.voter_status ? 1 : 0}, ${r.philhealth_member ? 1 : 0}, ${r.senior_citizen ? 1 : 0}, ${r.pwd ? 1 : 0}, ${r.solo_parent ? 1 : 0}, ${escapeSql(r.contact_number)}, ${escapeSql(r.email)}, ${escapeSql(r.status)});\n`;
  });
  sql += `\n`;

  // 5. BARANGAY OFFICIALS TABLE
  sql += `-- 5. TABLE: BARANGAY_OFFICIALS\n`;
  sql += `CREATE TABLE IF NOT EXISTS barangay_officials (\n`;
  sql += `  official_id VARCHAR(50) PRIMARY KEY,\n`;
  sql += `  position VARCHAR(100) NOT NULL,\n`;
  sql += `  committee VARCHAR(100),\n`;
  sql += `  full_name VARCHAR(100) NOT NULL,\n`;
  sql += `  contact_number VARCHAR(50),\n`;
  sql += `  email VARCHAR(100),\n`;
  sql += `  term_start DATE,\n`;
  sql += `  term_end DATE,\n`;
  sql += `  status VARCHAR(20)\n`;
  sql += `);\n\n`;

  data.officials.forEach(o => {
    sql += `INSERT INTO barangay_officials (official_id, position, committee, full_name, contact_number, email, term_start, term_end, status)\n`;
    sql += `VALUES (${escapeSql(o.official_id)}, ${escapeSql(o.position)}, ${escapeSql(o.committee)}, ${escapeSql(o.full_name)}, ${escapeSql(o.contact_number)}, ${escapeSql(o.email)}, ${escapeSql(o.term_start)}, ${escapeSql(o.term_end)}, ${escapeSql(o.status)});\n`;
  });
  sql += `\n`;

  // 6. CERTIFICATES TABLE
  sql += `-- 6. TABLE: CERTIFICATES\n`;
  sql += `CREATE TABLE IF NOT EXISTS certificates (\n`;
  sql += `  certificate_id VARCHAR(50) PRIMARY KEY,\n`;
  sql += `  certificate_type VARCHAR(100) NOT NULL,\n`;
  sql += `  resident_id VARCHAR(50) NOT NULL,\n`;
  sql += `  resident_name VARCHAR(100) NOT NULL,\n`;
  sql += `  address VARCHAR(255),\n`;
  sql += `  purpose VARCHAR(255),\n`;
  sql += `  issue_date DATE,\n`;
  sql += `  or_number VARCHAR(50),\n`;
  sql += `  amount_paid DECIMAL(10,2),\n`;
  sql += `  issued_by VARCHAR(100),\n`;
  sql += `  status VARCHAR(20),\n`;
  sql += `  FOREIGN KEY (resident_id) REFERENCES residents(resident_id)\n`;
  sql += `);\n\n`;

  data.certificates.forEach(c => {
    sql += `INSERT INTO certificates (certificate_id, certificate_type, resident_id, resident_name, address, purpose, issue_date, or_number, amount_paid, issued_by, status)\n`;
    sql += `VALUES (${escapeSql(c.certificate_id)}, ${escapeSql(c.certificate_type)}, ${escapeSql(c.resident_id)}, ${escapeSql(c.resident_name)}, ${escapeSql(c.address)}, ${escapeSql(c.purpose)}, ${escapeSql(c.issue_date)}, ${escapeSql(c.or_number)}, ${c.amount_paid}, ${escapeSql(c.issued_by)}, ${escapeSql(c.status)});\n`;
  });
  sql += `\n`;

  // 7. BLOTTER RECORDS TABLE
  sql += `-- 7. TABLE: BLOTTER_RECORDS\n`;
  sql += `CREATE TABLE IF NOT EXISTS blotter_records (\n`;
  sql += `  blotter_id VARCHAR(50) PRIMARY KEY,\n`;
  sql += `  incident_type VARCHAR(100) NOT NULL,\n`;
  sql += `  complainant_name VARCHAR(100) NOT NULL,\n`;
  sql += `  respondent_name VARCHAR(100) NOT NULL,\n`;
  sql += `  incident_date VARCHAR(50),\n`;
  sql += `  incident_location VARCHAR(255),\n`;
  sql += `  status VARCHAR(50),\n`;
  sql += `  narrative TEXT,\n`;
  sql += `  assigned_officer VARCHAR(100)\n`;
  sql += `);\n\n`;

  data.blotters.forEach(bl => {
    sql += `INSERT INTO blotter_records (blotter_id, incident_type, complainant_name, respondent_name, incident_date, incident_location, status, narrative, assigned_officer)\n`;
    sql += `VALUES (${escapeSql(bl.blotter_id)}, ${escapeSql(bl.incident_type)}, ${escapeSql(bl.complainant_name)}, ${escapeSql(bl.respondent_name)}, ${escapeSql(bl.incident_date)}, ${escapeSql(bl.incident_location)}, ${escapeSql(bl.status)}, ${escapeSql(bl.narrative)}, ${escapeSql(bl.assigned_officer)});\n`;
  });
  sql += `\n`;

  // 8. ANNOUNCEMENTS TABLE
  sql += `-- 8. TABLE: ANNOUNCEMENTS\n`;
  sql += `CREATE TABLE IF NOT EXISTS announcements (\n`;
  sql += `  announcement_id VARCHAR(50) PRIMARY KEY,\n`;
  sql += `  title VARCHAR(255) NOT NULL,\n`;
  sql += `  content TEXT NOT NULL,\n`;
  sql += `  category VARCHAR(50),\n`;
  sql += `  target_purok VARCHAR(50),\n`;
  sql += `  date_posted DATE,\n`;
  sql += `  posted_by VARCHAR(100)\n`;
  sql += `);\n\n`;

  data.announcements.forEach(a => {
    sql += `INSERT INTO announcements (announcement_id, title, content, category, target_purok, date_posted, posted_by)\n`;
    sql += `VALUES (${escapeSql(a.announcement_id)}, ${escapeSql(a.title)}, ${escapeSql(a.content)}, ${escapeSql(a.category)}, ${escapeSql(a.target_purok)}, ${escapeSql(a.date_posted)}, ${escapeSql(a.posted_by)});\n`;
  });
  sql += `\n`;

  // 9. EVENTS TABLE
  sql += `-- 9. TABLE: EVENTS\n`;
  sql += `CREATE TABLE IF NOT EXISTS events (\n`;
  sql += `  event_id VARCHAR(50) PRIMARY KEY,\n`;
  sql += `  title VARCHAR(255) NOT NULL,\n`;
  sql += `  description TEXT,\n`;
  sql += `  location VARCHAR(255),\n`;
  sql += `  event_date DATE,\n`;
  sql += `  event_time VARCHAR(50),\n`;
  sql += `  organizer VARCHAR(100),\n`;
  sql += `  status VARCHAR(50)\n`;
  sql += `);\n\n`;

  data.events.forEach(e => {
    sql += `INSERT INTO events (event_id, title, description, location, event_date, event_time, organizer, status)\n`;
    sql += `VALUES (${escapeSql(e.event_id)}, ${escapeSql(e.title)}, ${escapeSql(e.description)}, ${escapeSql(e.location)}, ${escapeSql(e.event_date)}, ${escapeSql(e.event_time)}, ${escapeSql(e.organizer)}, ${escapeSql(e.status)});\n`;
  });

  return sql;
}

export function generateJsonExport(data: any): string {
  return JSON.stringify(data, null, 2);
}