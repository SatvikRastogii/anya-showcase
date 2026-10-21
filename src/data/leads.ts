export type LeadStatus = "due" | "retry_2h" | "retry_1d" | "callback" | "booked" | "dnd_blocked" | "do_not_call";

export interface Lead {
  name: string;
  company: string;
  phone: string;
  source: "Website" | "Meta lead ad" | "CSV upload";
  status: LeadStatus;
  attempts: number;
  next: string;
}

export const statusLabel: Record<LeadStatus, string> = {
  due: "Due now",
  retry_2h: "Retry in 2h",
  retry_1d: "Retry tomorrow",
  callback: "Callback",
  booked: "Booked",
  dnd_blocked: "DND",
  do_not_call: "Do not call",
};

export const leads: Lead[] = [
  { name: "Rhea Joshi", company: "Joshi Opticals", phone: "+91 98•• ••7720", source: "Website", status: "due", attempts: 0, next: "In 4 s" },
  { name: "Aditya Rao", company: "Rao Fitness", phone: "+91 90•• ••1184", source: "Meta lead ad", status: "due", attempts: 0, next: "In 38 s" },
  { name: "Arjun Mehta", company: "Mehta Logistics", phone: "+91 99•• ••0381", source: "Meta lead ad", status: "retry_2h", attempts: 1, next: "Today 19:31" },
  { name: "Farhan Ali", company: "Ali Textiles", phone: "+91 93•• ••8847", source: "Meta lead ad", status: "retry_2h", attempts: 1, next: "Today 15:58" },
  { name: "Meera Pillai", company: "Coastline Homestays", phone: "+91 94•• ••2275", source: "Website", status: "retry_2h", attempts: 1, next: "Today 14:44" },
  { name: "Sana Qureshi", company: "Bloom Dental", phone: "+91 97•• ••7752", source: "Website", status: "callback", attempts: 1, next: "Fri 16 Oct, 11:00" },
  { name: "Vikram Iyer", company: "Iyer Auto Parts", phone: "+91 96•• ••3308", source: "CSV upload", status: "retry_1d", attempts: 2, next: "Fri 16 Oct, 10:00" },
  { name: "Priya Raman", company: "Kettle & Crumb", phone: "+91 98•• ••4210", source: "Website", status: "booked", attempts: 1, next: "Demo Thu 22 Oct, 17:00" },
  { name: "Ananya Das", company: "Das Diagnostics", phone: "+91 98•• ••5521", source: "Website", status: "booked", attempts: 1, next: "Demo Wed 21 Oct, 11:30" },
  { name: "Ishaan Gupta", company: "Gupta Hardware", phone: "+91 99•• ••6648", source: "Website", status: "booked", attempts: 2, next: "Demo Mon 19 Oct, 15:00" },
  { name: "Tanvi Shah", company: "Shah Jewellers", phone: "+91 98•• ••3352", source: "CSV upload", status: "dnd_blocked", attempts: 3, next: "Never" },
  { name: "Lakshmi Narayan", company: "LN Caterers", phone: "+91 97•• ••4436", source: "Meta lead ad", status: "do_not_call", attempts: 1, next: "Never" },
];
